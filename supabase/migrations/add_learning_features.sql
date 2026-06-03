-- ============================================================
-- OnlineAcademy — Learning Features Migration
-- Coursera-like: lessons, quizzes, progress, certificates
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- TABLE: lessons
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title_uz TEXT NOT NULL DEFAULT '',
  title_ru TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  content_uz TEXT NOT NULL DEFAULT '',
  content_ru TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: quiz_questions
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_uz TEXT NOT NULL DEFAULT '',
  question_ru TEXT NOT NULL DEFAULT '',
  question_en TEXT NOT NULL DEFAULT '',
  options_uz JSONB NOT NULL DEFAULT '[]',
  options_ru JSONB NOT NULL DEFAULT '[]',
  options_en JSONB NOT NULL DEFAULT '[]',
  correct_option INTEGER NOT NULL DEFAULT 0,
  explanation_uz TEXT DEFAULT '',
  explanation_ru TEXT DEFAULT '',
  explanation_en TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- TABLE: user_lesson_progress
-- ============================================================
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  quiz_score INTEGER,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ============================================================
-- TABLE: certificates
-- ============================================================
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons (course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons (course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_quiz_lesson_id ON quiz_questions (lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON user_lesson_progress (user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates (certificate_number);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Lessons: anyone can read published lessons
CREATE POLICY "Public can read published lessons"
  ON lessons FOR SELECT
  USING (is_published = true);

-- Quiz questions: anyone can read questions of published lessons
CREATE POLICY "Public can read quiz questions"
  ON quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons l WHERE l.id = lesson_id AND l.is_published = true
    )
  );

-- Progress: users manage their own progress
CREATE POLICY "Users can read own progress"
  ON user_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Certificates: users can read own certificates; anyone can verify by number
CREATE POLICY "Users can read own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can verify certificates"
  ON certificates FOR SELECT
  USING (true);
