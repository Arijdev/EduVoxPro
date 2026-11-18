-- ==========================================================
-- EduVoxPro — Production Supabase PostgreSQL Schema & Reset
-- Project URL: https://ulwxniobhvykxtinbywn.supabase.co
-- Tables: profiles, tracks, modules, lessons, quizzes, questions, enrollments, user_progress, certificates
-- ==========================================================

-- STEP 1: CLEAN RESET (Drops all existing tables, triggers, and dependencies)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.quizzes CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.tracks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- STEP 2: ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 3: CREATE TABLES

-- 1. User Profiles Table (Mirrors auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT 'Master Developer',
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger function to auto-create profile on auth.users signup
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for any existing users in auth.users
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), 
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 2. Certification Tracks Table
CREATE TABLE public.tracks (
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

-- 3. Modules Table
CREATE TABLE public.modules (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 45,
  content_sections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lessons Table
CREATE TABLE public.lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  code_snippets JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Quizzes Table
CREATE TABLE public.quizzes (
  id TEXT PRIMARY KEY,
  module_id TEXT UNIQUE NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  passing_score_percentage INTEGER NOT NULL DEFAULT 80,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Quiz Questions Table
CREATE TABLE public.questions (
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

-- 7. Enrollments Table
CREATE TABLE public.enrollments (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  payment_reference TEXT,
  amount_paid_inr INTEGER NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. User Progress Table
CREATE TABLE public.user_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  completed_module_ids JSONB DEFAULT '[]'::jsonb,
  unlocked_module_ids JSONB DEFAULT '[]'::jsonb,
  quiz_scores JSONB DEFAULT '{}'::jsonb,
  last_active_module_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, track_id)
);

-- 9. Verifiable Certificates Table
CREATE TABLE public.certificates (
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

-- STEP 4: ROW LEVEL SECURITY (RLS) POLICIES

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

-- Certificates: Public read so verification links/QR codes work anywhere
CREATE POLICY "Certificates public verification read"
  ON public.certificates FOR SELECT USING (true);

CREATE POLICY "Users can create certificates"
  ON public.certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- STEP 5: SEED ALL 7 CERTIFICATION TRACKS
INSERT INTO public.tracks (
  id, slug, title, role_badge, difficulty, estimated_hours,
  price_inr, is_free, tagline, description, skills_covered,
  modules_count, target_audience
)
VALUES
(
  'track-web-foundations',
  'foundations-of-modern-web-technologies',
  'Foundations of Modern Web Technologies',
  'Junior Web Systems Engineer',
  'Beginner',
  42,
  0,
  TRUE,
  'Master semantic HTML5, modern responsive CSS layouts, Git version control, and browser runtime mechanics.',
  'A comprehensive, 100% free certification track covering foundational internet protocols, the DOM tree, accessible semantic HTML5, Flexbox & CSS Grid, Git branching models, and HTTP caching mechanics.',
  '["Semantic HTML5 & WAI-ARIA Accessibility", "Modern CSS (Flexbox, Grid & Custom Properties)", "Git CLI & Trunk-Based Team Workflows", "Browser Critical Rendering Path & DOM", "HTTP/2 & HTTP/3 Request Lifecycle", "Responsive Layouts & Mobile-First Principles"]'::jsonb,
  8,
  'Aspiring software engineers, self-taught developers, and computer science students building a rock-solid web baseline.'
),
(
  'track-prompt-engineering',
  'ai-prompt-engineering-ethics',
  'AI Prompt Engineering & Ethics Certification',
  'Prompt Systems Specialist',
  'Beginner',
  38,
  0,
  TRUE,
  'Harness LLM token mechanics, chain-of-thought prompting, system guardrails, and ethical AI stewardship.',
  'Learn how large language models tokenize and predict tokens, how to apply few-shot and decomposition patterns, and how to detect bias, hallucination vectors, and security vulnerabilities like jailbreaks.',
  '["Tokenization & Probability Distributions", "Chain-of-Thought (CoT) & Few-Shot Prompting", "System Instructions & Persona Calibration", "Jailbreak Defense & Prompt Injection Defense", "AI Bias Mitigation & Fairness Auditing", "Structured Output Formatting (JSON Schemas)"]'::jsonb,
  7,
  'Developers, product managers, technical writers, and AI operators seeking rigorous prompt engineering skills.'
),
(
  'track-agentic-ai',
  'agentic-ai-developer',
  'Agentic AI Developer Certification',
  'Autonomous Agent Engineer',
  'Advanced',
  54,
  99,
  FALSE,
  'Architect production autonomous agent loops, tool-calling graphs, LangGraph state machines, and multi-agent swarms.',
  'A deep dive into stateful agent orchestration, dynamic tool selection, structured JSON outputs, human-in-the-loop approval gates, episodic memory, vector stores, and automated LLM-as-a-judge trajectory testing.',
  '["ReAct Pattern & Reflection Loops", "Function Calling & Tool JSON Schemas", "Stateful Graphs (LangGraph & AutoGen)", "Long-term Semantic Memory & Vector Stores", "Human-in-the-Loop (HITL) Safety Gates", "Autonomous Multi-Agent Swarms & Supervisors"]'::jsonb,
  10,
  'Senior backend engineers, AI engineers, and system architects building autonomous agent systems.'
),
(
  'track-generative-ai',
  'generative-ai-specialist',
  'Generative AI Solutions Specialist',
  'GenAI Architect',
  'Intermediate',
  48,
  89,
  FALSE,
  'Build enterprise Retrieval-Augmented Generation (RAG) pipelines, fine-tuned embeddings, and semantic vector caches.',
  'Master document chunking strategies, hybrid vector + BM25 keyword retrieval, cross-encoder reranking, semantic caching with Redis, diffusion architectures, and automated evaluation metrics with Ragas.',
  '["Hybrid Vector & Keyword Retrieval (RAG)", "Cross-Encoder Re-ranking & Precision Tuning", "Semantic Caching & Token Cost Optimization", "Embedding Models & Fine-Tuning Principles", "Diffusion Models & Multimodal Pipelines", "Automated CI/CD RAG Evaluation with Ragas"]'::jsonb,
  9,
  'Full-stack developers, ML engineers, and data engineers operationalizing LLM pipelines in production.'
),
(
  'track-fullstack-architect',
  'modern-fullstack-architect',
  'Modern Full-Stack Systems Architect',
  'Principal Systems Architect',
  'Advanced',
  58,
  79,
  FALSE,
  'Design hyper-scalable, edge-first distributed apps with Next.js App Router, Supabase RLS, and Event Microservices.',
  'Master React Server Components, streaming SSR, multi-tenant Supabase PostgreSQL Row Level Security (RLS), edge caching, resilient payment webhooks, database connection pooling, and message broker queues.',
  '["Next.js App Router & Server Actions", "Supabase Row Level Security (RLS) Policies", "Edge Middleware & Multi-Region Caching", "Idempotent Payment Webhooks & UPI Gateways", "Microservices & Event-Driven Message Brokers", "Database Pooling & Connection Multiplexing"]'::jsonb,
  10,
  'Senior software engineers looking to step up into Staff Engineer or Principal Cloud Architect roles.'
),
(
  'track-data-science',
  'data-science-mastery',
  'Data Science Mastery Certification',
  'Data Science Engineer',
  'Intermediate',
  52,
  79,
  FALSE,
  'Master statistical analysis, machine learning, data wrangling with Pandas, and production model deployment.',
  'A comprehensive data science certification covering Python for data analysis, Pandas & NumPy, exploratory data analysis, statistical inference, supervised & unsupervised machine learning with scikit-learn, feature engineering, model evaluation, data visualization with Matplotlib & Seaborn, and deploying ML models as REST APIs.',
  '["Python for Data Analysis (Pandas & NumPy)", "Exploratory Data Analysis & Statistical Inference", "Supervised ML: Regression & Classification", "Unsupervised ML: Clustering & Dimensionality Reduction", "Feature Engineering & Model Evaluation Metrics", "Data Visualization (Matplotlib, Seaborn & Plotly)", "SQL for Data Science & Big Data Querying", "ML Model Deployment as REST APIs with FastAPI"]'::jsonb,
  10,
  'Aspiring data scientists, analysts, and ML engineers who want to build, evaluate, and ship real-world predictive models.'
),
(
  'track-python-developer',
  'python-developer-certification',
  'Python Developer Certification',
  'Professional Python Developer',
  'Beginner',
  56,
  99,
  FALSE,
  'Go from Python basics to building real-world applications, APIs, automation scripts, and databases.',
  'A complete Python developer curriculum from first principles to professional-grade projects. Covers core Python syntax, object-oriented programming, file I/O, exception handling, decorators & generators, working with APIs, database integration with SQLite & PostgreSQL, test-driven development, async programming, and building web APIs with FastAPI.',
  '["Core Python Syntax, Data Types & Control Flow", "Object-Oriented Programming (Classes, Inheritance & Polymorphism)", "File I/O, Exception Handling & Context Managers", "Functional Python: Decorators, Generators & Comprehensions", "Working with APIs: requests, JSON & REST Clients", "Database Integration: SQLite, PostgreSQL & SQLAlchemy ORM", "Testing with pytest & Test-Driven Development (TDD)", "Async Python: asyncio, aiohttp & Concurrent Programming", "Building Web APIs with FastAPI & Pydantic", "Automation, Scripting & Deployment Best Practices"]'::jsonb,
  10,
  'Beginners and junior developers who want a thorough, project-based Python foundation for careers in web development, data science, or automation.'
)
ON CONFLICT (id) DO NOTHING;
