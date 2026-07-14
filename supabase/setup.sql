-- ==========================================
-- 1. Create Tables
-- ==========================================

-- Create Profiles Table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Reports Table (Lost & Found posts)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT CHECK (status IN ('Lost', 'Found')) NOT NULL,
  location TEXT NOT NULL,
  contact TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Setup Automatic Profiles Trigger
-- ==========================================
-- This function and trigger automatically creates a row in the public.profiles table
-- whenever a new user signs up via Supabase Authentication.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 3. Enable Row Level Security (RLS)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. RLS Policies for Profiles
-- ==========================================
-- 4.1. Anyone can read profiles (needed to render author name/avatar on report details)
CREATE POLICY "Allow public read access to profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- 4.2. Users can only update their own profile
CREATE POLICY "Allow users to update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- 5. RLS Policies for Reports
-- ==========================================
-- 5.1. Anyone can view all reports (authenticated or guest)
CREATE POLICY "Allow public read access to reports" 
  ON public.reports 
  FOR SELECT 
  USING (true);

-- 5.2. Authenticated users can insert their own reports
CREATE POLICY "Allow authenticated users to insert reports" 
  ON public.reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 5.3. Users can update only their own reports
CREATE POLICY "Allow users to update their own reports" 
  ON public.reports 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5.4. Users can delete only their own reports
CREATE POLICY "Allow users to delete their own reports" 
  ON public.reports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ==========================================
-- 6. Setup Storage Buckets
-- ==========================================
-- Insert buckets into storage schema (requires bucket management permissions or can be created via Supabase dashboard)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports', 'reports', true) 
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage Objects (in storage.objects)
-- Note: These policies configure public read and owner-based upload/delete

-- 6.1. Public Read for Buckets (avatars, reports)
CREATE POLICY "Allow public read access to storage objects"
  ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('avatars', 'reports'));

-- 6.2. Allow authenticated users to upload objects to reports and avatars
CREATE POLICY "Allow authenticated uploads to reports and avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('avatars', 'reports'));

-- 6.3. Allow authenticated users to update/delete their own objects
CREATE POLICY "Allow owners to update or delete their storage objects"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id IN ('avatars', 'reports'));
