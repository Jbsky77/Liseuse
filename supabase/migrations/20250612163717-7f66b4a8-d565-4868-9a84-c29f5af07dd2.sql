
-- Create enum for book status
CREATE TYPE book_status AS ENUM ('reading', 'completed', 'to_read');

-- Create enum for supported languages
CREATE TYPE book_language AS ENUM ('fr', 'en', 'es', 'de', 'it', 'other');

-- Create table for books
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  series TEXT,
  series_number INTEGER,
  language book_language DEFAULT 'fr',
  page_count INTEGER,
  file_path TEXT NOT NULL, -- Path to PDF in Supabase Storage
  cover_url TEXT, -- URL to cover image
  file_size BIGINT, -- File size in bytes
  status book_status DEFAULT 'to_read',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for bookmarks (reading progress)
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  current_page INTEGER NOT NULL DEFAULT 1,
  total_pages INTEGER,
  reading_progress DECIMAL(5,2) DEFAULT 0.00, -- Percentage (0.00 to 100.00)
  last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Create table for user reading preferences
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT DEFAULT 'light', -- 'light' or 'dark'
  default_zoom DECIMAL(3,2) DEFAULT 1.00,
  auto_translate BOOLEAN DEFAULT false,
  preferred_translation_service TEXT DEFAULT 'deepl', -- 'deepl' or 'google'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for books table
CREATE POLICY "Users can view their own books" 
  ON public.books FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books" 
  ON public.books FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books" 
  ON public.books FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books" 
  ON public.books FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for bookmarks table
CREATE POLICY "Users can view their own bookmarks" 
  ON public.bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" 
  ON public.bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" 
  ON public.bookmarks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences table
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
  ON public.user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create storage bucket for PDF files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('books', 'books', false);

-- Storage policy to allow authenticated users to upload their books
CREATE POLICY "Users can upload their own books" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'books' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own books" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'books' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own books" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'books' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own books" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'books' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_books_updated_at 
  BEFORE UPDATE ON public.books 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_user_preferences_updated_at 
  BEFORE UPDATE ON public.user_preferences 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
