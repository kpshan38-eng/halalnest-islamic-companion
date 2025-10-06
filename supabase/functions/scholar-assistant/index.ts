import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY') as string;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId } = await req.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Scholar Assistant request:', { message, conversationId });

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User authenticated:', user.id);

    // Get conversation history if conversationId provided
    let conversationHistory: Message[] = [];
    let currentConversationId = conversationId;

    if (currentConversationId) {
      const { data: messages } = await supabase
        .from('scholar_assistant_messages')
        .select('role, content')
        .eq('conversation_id', currentConversationId)
        .order('created_at', { ascending: true });
      
      if (messages) {
        conversationHistory = messages as Message[];
      }
    } else {
      // Create new conversation
      const { data: conversation } = await supabase
        .from('scholar_assistant_conversations')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        })
        .select()
        .single();
      
      if (conversation) {
        currentConversationId = conversation.id;
      }
    }

    // Save user message
    await supabase
      .from('scholar_assistant_messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: message
      });

    // Prepare conversation context
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are a knowledgeable Islamic scholar assistant. You provide authentic Islamic guidance based on the Quran and authentic Hadith. Always:

1. Base your answers on authentic Islamic sources (Quran, authentic Hadith, scholarly consensus)
2. Be respectful and humble in your responses
3. If unsure about a ruling, recommend consulting local scholars
4. Use appropriate Islamic etiquette and terminology
5. Provide practical, actionable guidance
6. Address both spiritual and practical aspects of questions
7. Always say "Allahu A'lam" (Allah knows best) when appropriate
8. Cite sources when possible

You help Muslims in their daily lives with questions about worship, Islamic jurisprudence (fiqh), Islamic ethics, family matters, and spiritual development. Always maintain the dignity and beauty of Islamic teachings.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Calling OpenRouter API with messages:', messages.length);

    // Check for special users and add personalized greeting
    const specialUsers = ['shankp', 'nizam', 'masood'];
    const userEmail = user.email?.toLowerCase() || '';
    const isSpecialUser = specialUsers.some(name => userEmail.includes(name));
    
    if (isSpecialUser && conversationHistory.length === 0) {
      messages[0].content += `\n\nNote: This user (${user.email}) is a valued member of our community. Provide especially thoughtful and detailed responses.`;
    }

    // Call OpenRouter API with grok-4-fast and streaming
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://halalnest.lovableproject.com',
        'X-Title': 'HalalNest Islamic Companion'
      },
      body: JSON.stringify({
        model: 'alibaba/tongyi-deepresearch-30b-a3b:free',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9,
        stream: true
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullMessage = '';
    
    // Create a readable stream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // Save complete message to database
                  await supabase
                    .from('scholar_assistant_messages')
                    .insert({
                      conversation_id: currentConversationId,
                      role: 'assistant',
                      content: fullMessage
                    });
                  
                  controller.enqueue(`data: ${JSON.stringify({ type: 'done', conversationId: currentConversationId })}\n\n`);
                  controller.close();
                  return;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices?.[0]?.delta?.content) {
                    const content = parsed.choices[0].delta.content;
                    fullMessage += content;
                    controller.enqueue(`data: ${JSON.stringify({ type: 'content', content })}\n\n`);
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: unknown) {
    console.error('Error in scholar-assistant function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});