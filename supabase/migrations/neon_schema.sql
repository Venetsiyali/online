-- ============================================================
-- OnlineAcademy — Neon PostgreSQL Full Schema
-- Run this in your Neon SQL Editor (console.neon.tech)
-- ============================================================

-- ============================================================
-- TABLE: users (replaces Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ============================================================
-- TABLE: courses
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_uz TEXT NOT NULL DEFAULT '',
  title_ru TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  description_uz TEXT NOT NULL DEFAULT '',
  description_ru TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  youtube_url TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  category TEXT,
  is_free BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_published ON courses (is_published);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses (category);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses (created_at DESC);

-- ============================================================
-- TABLE: announcements
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_uz TEXT NOT NULL DEFAULT '',
  title_ru TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  content_uz TEXT NOT NULL DEFAULT '',
  content_ru TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements (is_published);

-- ============================================================
-- TABLE: students (enrollment)
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_course_id ON students (course_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students (user_id);

-- ============================================================
-- TABLE: pricing_plans
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_uz TEXT NOT NULL DEFAULT '',
  name_ru TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'UZS',
  features_uz TEXT[] NOT NULL DEFAULT '{}',
  features_ru TEXT[] NOT NULL DEFAULT '{}',
  features_en TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ============================================================
-- TABLE: lessons
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons (course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons (course_id, order_index);

-- ============================================================
-- TABLE: quiz_questions
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_quiz_lesson_id ON quiz_questions (lesson_id);

-- ============================================================
-- TABLE: user_lesson_progress
-- ============================================================
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  quiz_score INTEGER,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user_course ON user_lesson_progress (user_id, course_id);

-- ============================================================
-- TABLE: certificates
-- ============================================================
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates (user_id);

-- ============================================================
-- SAMPLE SEED DATA
-- ============================================================

INSERT INTO courses (title_uz, title_ru, title_en, description_uz, description_ru, description_en, youtube_url, category, is_free, is_published)
VALUES (
  'Python dasturlash tili asoslari',
  'Основы языка программирования Python',
  'Python Programming Fundamentals',
  'Bu kursda Python dasturlash tilining asoslarini o''rganasiz.',
  'В этом курсе вы изучите основы языка программирования Python.',
  'In this course you will learn the fundamentals of Python programming.',
  'dQw4w9WgXcQ',
  'Programming',
  true,
  true
) ON CONFLICT DO NOTHING;

INSERT INTO announcements (title_uz, title_ru, title_en, content_uz, content_ru, content_en, is_published)
VALUES (
  'Platformaga xush kelibsiz!',
  'Добро пожаловать на платформу!',
  'Welcome to the Platform!',
  'Onlayn ta''lim platformamizga xush kelibsiz.',
  'Добро пожаловать на нашу платформу.',
  'Welcome to our online learning platform.',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO pricing_plans (name_uz, name_ru, name_en, price, currency, features_uz, features_ru, features_en, is_popular, is_active)
VALUES
('Bepul', 'Бесплатно', 'Free', 0, 'UZS',
 ARRAY['Barcha bepul kurslarga kirish', '3 tilda qo''llab-quvvatlash', 'Sertifikat'],
 ARRAY['Доступ ко всем бесплатным курсам', 'Поддержка 3 языков', 'Сертификат'],
 ARRAY['Access to all free courses', '3 language support', 'Certificate'],
 false, true),
('Pro', 'Про', 'Pro', 299000, 'UZS',
 ARRAY['Barcha kurslarga kirish', 'Premium sertifikat', 'Ustoz bilan aloqa'],
 ARRAY['Доступ ко всем курсам', 'Премиум сертификат', 'Общение с преподавателем'],
 ARRAY['All courses access', 'Premium certificate', 'Instructor access'],
 true, true)
ON CONFLICT DO NOTHING;
