import { useState, useEffect, useRef } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2, MessageCircle, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import TypewriterText from '@/components/TypewriterText';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const ScholarAssistant = () => {
  const { user, loading } = useSupabaseAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversationId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    if (!user) return;

    setIsLoadingConversations(true);
    const { data, error } = await supabase
      .from('scholar_assistant_conversations')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } else {
      setConversations(data || []);
      if (data && data.length > 0 && !currentConversationId) {
        setCurrentConversationId(data[0].id);
      }
    }
    setIsLoadingConversations(false);
  };

  const fetchMessages = async () => {
    if (!currentConversationId) return;

    const { data, error } = await supabase
      .from('scholar_assistant_messages')
      .select('*')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } else {
      setMessages((data || []).map(msg => ({
        ...msg,
        role: msg.role as 'user' | 'assistant'
      })));
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !user) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage('');

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: 'temp-user-' + Date.now(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };

    // Add temporary streaming assistant message
    const tempAssistantMessage: Message = {
      id: 'temp-assistant-' + Date.now(),
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
      isStreaming: true
    };

    setMessages(prev => [...prev, tempUserMessage, tempAssistantMessage]);

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      // Make streaming request
      const response = await fetch(`https://nrhmxgfcobcpsnrxguli.supabase.co/functions/v1/scholar-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId: currentConversationId
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullMessage = '';
      let newConversationId = currentConversationId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content') {
                fullMessage += parsed.content;
                setStreamingMessage(fullMessage);
                
                // Update the streaming message in real-time
                setMessages(prev => prev.map(msg => 
                  msg.id === tempAssistantMessage.id 
                    ? { ...msg, content: fullMessage }
                    : msg
                ));
              } else if (parsed.type === 'done') {
                newConversationId = parsed.conversationId;
                break;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Update conversation ID if it's new
      if (!currentConversationId && newConversationId) {
        setCurrentConversationId(newConversationId);
        await fetchConversations();
      }

      // Remove temp messages and refresh from database
      setMessages(prev => prev.filter(m => 
        m.id !== tempUserMessage.id && m.id !== tempAssistantMessage.id
      ));
      await fetchMessages();

      toast({
        title: "Response received",
        description: "The scholar assistant has responded to your question"
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove temp messages on error
      setMessages(prev => prev.filter(m => 
        m.id !== tempUserMessage.id && m.id !== tempAssistantMessage.id
      ));
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingMessage('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
            Scholar Assistant
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Get authentic Islamic guidance powered by AI and verified sources
          </p>
          {/* Special user greeting */}
          {user && ['shankp', 'nizam', 'masood'].some(name => user.email?.toLowerCase().includes(name)) && (
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20 animate-pulse">
              <p className="text-sm text-primary font-medium">
                🌟 Welcome back, valued community member! You'll receive enhanced responses.
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 h-[600px] sm:h-[700px]">
          {/* Conversations Sidebar */}
          <Card className="p-3 sm:p-4 lg:col-span-1 animate-slide-in-right">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-primary text-sm sm:text-base">Conversations</h2>
              <Button size="sm" variant="outline" onClick={startNewConversation} className="hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <ScrollArea className="h-[500px] sm:h-[600px]">
              {isLoadingConversations ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground text-center p-4">
                  No conversations yet. Start by asking a question!
                </p>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conversation, index) => (
                    <button
                      key={conversation.id}
                      onClick={() => setCurrentConversationId(conversation.id)}
                      className={`w-full text-left p-2 sm:p-3 rounded-lg transition-all duration-300 hover:scale-105 animate-fade-in ${
                        currentConversationId === conversation.id
                          ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg'
                          : 'hover:bg-muted/60'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start space-x-2">
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium truncate">{conversation.title}</p>
                          <p className="text-xs opacity-70">
                            {new Date(conversation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3 flex flex-col animate-scale-in">
            {/* Messages */}
            <ScrollArea className="flex-1 p-3 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Bot className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Welcome to Scholar Assistant</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
                      Ask any question about Islam, Islamic law, worship, ethics, or spiritual guidance. 
                      I provide authentic answers based on Quran and Sunnah.
                    </p>
                    <div className="grid gap-2 max-w-lg mx-auto text-xs sm:text-sm">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-3 rounded-lg hover:from-muted/60 hover:to-muted/40 transition-all duration-300">
                        <p className="font-medium mb-1">Example questions:</p>
                        <ul className="text-left space-y-1 text-muted-foreground">
                          <li>• How should I perform Wudu properly?</li>
                          <li>• What are the pillars of Islam?</li>
                          <li>• How can I improve my relationship with Allah?</li>
                          <li>• What does Islam say about charity?</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 sm:gap-4 animate-fade-in ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-secondary to-secondary/80 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-lg transition-all duration-300 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg'
                            : 'bg-gradient-to-r from-muted to-muted/80 hover:from-muted/80 hover:to-muted/60'
                        }`}
                      >
                        {message.isStreaming ? (
                          <TypewriterText 
                            text={message.content} 
                            speed={20}
                            className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed"
                          />
                        ) : (
                          <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{message.content}</p>
                        )}
                        <p className="text-xs opacity-70 mt-2">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex gap-2 sm:gap-4 justify-start animate-fade-in">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-secondary to-secondary/80 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-foreground" />
                    </div>
                    <div className="bg-gradient-to-r from-muted to-muted/80 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Scholar is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-3 sm:p-4 bg-gradient-to-r from-background/50 to-secondary/5">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask your Islamic question..."
                  disabled={isLoading}
                  className="flex-1 text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !inputMessage.trim()}
                  className="transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Always consult qualified scholars for important religious matters. This AI provides general guidance only.
              </p>
              
              {/* Footer with contact info */}
              <div className="mt-3 pt-2 border-t border-border/50">
                <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                  <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
                  <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
                  <a href="mailto:shankp562@gmail.com" className="hover:text-primary transition-colors">Contact</a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScholarAssistant;