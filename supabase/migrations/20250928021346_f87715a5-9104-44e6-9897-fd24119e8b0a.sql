-- Create scholar_assistant_conversations table
CREATE TABLE public.scholar_assistant_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scholar_assistant_messages table
CREATE TABLE public.scholar_assistant_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.scholar_assistant_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scholar_assistant_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholar_assistant_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for scholar_assistant_conversations
CREATE POLICY "Users can manage their own conversations" 
ON public.scholar_assistant_conversations 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for scholar_assistant_messages
CREATE POLICY "Users can manage messages in their conversations" 
ON public.scholar_assistant_messages 
FOR ALL 
USING (
  conversation_id IN (
    SELECT id FROM public.scholar_assistant_conversations 
    WHERE user_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_scholar_assistant_conversations_updated_at
BEFORE UPDATE ON public.scholar_assistant_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create notification_preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  prayer_notifications BOOLEAN NOT NULL DEFAULT true,
  community_notifications BOOLEAN NOT NULL DEFAULT true,
  article_notifications BOOLEAN NOT NULL DEFAULT false,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for notification_preferences
CREATE POLICY "Users can manage their own notification preferences" 
ON public.notification_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for notification_preferences updated_at
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();