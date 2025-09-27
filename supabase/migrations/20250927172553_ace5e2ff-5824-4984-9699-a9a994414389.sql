-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Create essays table
CREATE TABLE public.essays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for essays
ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;

-- Essays policies
CREATE POLICY "Users can view their own essays" ON public.essays
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view published essays" ON public.essays
FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create their own essays" ON public.essays
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own essays" ON public.essays
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own essays" ON public.essays
FOR DELETE USING (auth.uid() = user_id);

-- Create quran_progress table
CREATE TABLE public.quran_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  surah_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  total_verses INTEGER NOT NULL,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bookmarked BOOLEAN DEFAULT false,
  UNIQUE(user_id, surah_number)
);

-- Enable RLS for quran_progress
ALTER TABLE public.quran_progress ENABLE ROW LEVEL SECURITY;

-- Quran progress policies
CREATE POLICY "Users can manage their own quran progress" ON public.quran_progress
FOR ALL USING (auth.uid() = user_id);

-- Create zakat_calculations table
CREATE TABLE public.zakat_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cash_savings DECIMAL(15,2) DEFAULT 0,
  gold_value DECIMAL(15,2) DEFAULT 0,
  silver_value DECIMAL(15,2) DEFAULT 0,
  investments DECIMAL(15,2) DEFAULT 0,
  total_wealth DECIMAL(15,2) NOT NULL,
  zakat_due DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for zakat_calculations
ALTER TABLE public.zakat_calculations ENABLE ROW LEVEL SECURITY;

-- Zakat calculations policies
CREATE POLICY "Users can manage their own zakat calculations" ON public.zakat_calculations
FOR ALL USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_essays_updated_at
  BEFORE UPDATE ON public.essays
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();