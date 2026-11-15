-- ==========================================================
-- EduVortexPro — Production Supabase PostgreSQL Schema
-- Project URL: https://ulwxniobhvykxtinbywn.supabase.co
-- Tables: profiles, tracks, modules, lessons, quizzes, questions, enrollments, user_progress, certificates
-- ==========================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT 'Master Developer',
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Certification Tracks Table
CREATE TABLE IF NOT EXISTS public.tracks (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  role_badge TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  estimated_hours INTEGER NOT NULL DEFAULT 40,
  price_inr INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  skills_covered JSONB DEFAULT '[]'::jsonb,
  modules_count INTEGER NOT NULL DEFAULT 7,
  target_audience TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 45,
  content_sections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Lessons / Sub-Chapters Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  code_snippets JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Quizzes Table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  module_id TEXT UNIQUE NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  passing_score_percentage INTEGER NOT NULL DEFAULT 80,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Quiz Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  code_snippet TEXT,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  payment_reference TEXT,
  amount_paid_inr INTEGER NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  completed_module_ids JSONB DEFAULT '[]'::jsonb,
  unlocked_module_ids JSONB DEFAULT '[]'::jsonb,
  quiz_scores JSONB DEFAULT '{}'::jsonb,
  last_active_module_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, track_id)
);

-- 10. Verifiable Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  verification_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  track_title TEXT NOT NULL,
  badge_role TEXT,
  issue_date TEXT NOT NULL,
  score_average INTEGER DEFAULT 92,
  skills_certified JSONB DEFAULT '[]'::jsonb,
  is_free_track BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- PostgreSQL Row Level Security (RLS) Policies
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, user update
CREATE POLICY "Public profiles are readable by all authenticated users"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tracks, Modules, Lessons, Quizzes: Public read access
CREATE POLICY "Public read access for tracks"
  ON public.tracks FOR SELECT USING (true);

CREATE POLICY "Public read access for modules"
  ON public.modules FOR SELECT USING (true);

CREATE POLICY "Public read access for lessons"
  ON public.lessons FOR SELECT USING (true);

CREATE POLICY "Public read access for quizzes"
  ON public.quizzes FOR SELECT USING (true);

CREATE POLICY "Public read access for questions"
  ON public.questions FOR SELECT USING (true);

-- Enrollments: User isolated
CREATE POLICY "Users view own enrollments"
  ON public.enrollments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own enrollments"
  ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own enrollments"
  ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

-- User Progress: User isolated
CREATE POLICY "Users view own progress"
  ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users manage own progress"
  ON public.user_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Certificates: Public read so QR codes verify anywhere in the world!
CREATE POLICY "Certificates public verification read"
  ON public.certificates FOR SELECT USING (true);

CREATE POLICY "Users can create certificates"
  ON public.certificates FOR INSERT WITH CHECK (auth.uid() = user_id);
