-- ============================================================
-- OnlineAcademy — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: courses
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- ============================================================
-- TABLE: announcements
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_uz TEXT NOT NULL DEFAULT '',
  title_ru TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  content_uz TEXT NOT NULL DEFAULT '',
  content_ru TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: students
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: pricing_plans
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses (is_published);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses (category);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements (is_published);
CREATE INDEX IF NOT EXISTS idx_students_course_id ON students (course_id);
CREATE INDEX IF NOT EXISTS idx_students_enrolled_at ON students (enrolled_at DESC);
CREATE INDEX IF NOT EXISTS idx_pricing_active ON pricing_plans (is_active);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- COURSES: public can read published courses
CREATE POLICY "Public can read published courses"
  ON courses FOR SELECT
  USING (is_published = true);

-- ANNOUNCEMENTS: public can read published announcements
CREATE POLICY "Public can read published announcements"
  ON announcements FOR SELECT
  USING (is_published = true);

-- PRICING PLANS: public can read active plans
CREATE POLICY "Public can read active pricing plans"
  ON pricing_plans FOR SELECT
  USING (is_active = true);

-- STUDENTS: only service role can insert/select (via API routes)
-- No public policies for students (privacy)

-- ============================================================
-- SEED DATA (Optional — sample content to get started)
-- ============================================================

-- Sample course
INSERT INTO courses (
  title_uz, title_ru, title_en,
  description_uz, description_ru, description_en,
  youtube_url, category, is_free, is_published
) VALUES (
  'Python dasturlash tili asoslari',
  'Основы языка программирования Python',
  'Python Programming Fundamentals',
  'Bu kursda Python dasturlash tilining asoslarini o''rganasiz. Sintaksis, o''zgaruvchilar, funksiyalar va ko''p narsalarni qamrab oladi.',
  'В этом курсе вы изучите основы языка программирования Python. Охватывает синтаксис, переменные, функции и многое другое.',
  'In this course you will learn the fundamentals of Python programming. Covers syntax, variables, functions, and much more.',
  'dQw4w9WgXcQ',
  'Programming',
  true,
  true
);

-- Sample announcement
INSERT INTO announcements (
  title_uz, title_ru, title_en,
  content_uz, content_ru, content_en,
  is_published
) VALUES (
  'Platformaga xush kelibsiz!',
  'Добро пожаловать на платформу!',
  'Welcome to the Platform!',
  'Onlayn ta''lim platformamizga xush kelibsiz. Biz sizga yuqori sifatli kurslar taqdim etishdan mamnunmiz.',
  'Добро пожаловать на нашу платформу онлайн-обучения. Мы рады предложить вам качественные курсы.',
  'Welcome to our online learning platform. We are excited to offer you high-quality courses.',
  true
);

-- Sample pricing plans
INSERT INTO pricing_plans (
  name_uz, name_ru, name_en,
  price, currency,
  features_uz, features_ru, features_en,
  is_popular, is_active
) VALUES
(
  'Bepul',
  'Бесплатно',
  'Free',
  0, 'UZS',
  ARRAY['Barcha bepul kurslarga kirish', '3 tilda qo''llab-quvvatlash', 'Asosiy sertifikat'],
  ARRAY['Доступ ко всем бесплатным курсам', 'Поддержка 3 языков', 'Базовый сертификат'],
  ARRAY['Access to all free courses', '3 language support', 'Basic certificate'],
  false, true
),
(
  'Pro',
  'Про',
  'Pro',
  299000, 'UZS',
  ARRAY['Barcha kurslarga cheksiz kirish', 'Premium sertifikat', 'Ustozlar bilan muloqot', 'Yangi kurslardan erta foydalanish'],
  ARRAY['Неограниченный доступ ко всем курсам', 'Премиум сертификат', 'Общение с преподавателями', 'Ранний доступ к новым курсам'],
  ARRAY['Unlimited access to all courses', 'Premium certificate', 'Direct instructor access', 'Early access to new courses'],
  true, true
),
(
  'Korporativ',
  'Корпоративный',
  'Enterprise',
  999000, 'UZS',
  ARRAY['5 ta foydalanuvchi uchun Pro', 'Maxsus korporativ dashboard', '24/7 qo''llab-quvvatlash', 'Moslashtirilgan kurslar'],
  ARRAY['Pro для 5 пользователей', 'Корпоративный дашборд', 'Поддержка 24/7', 'Индивидуальные курсы'],
  ARRAY['Pro for 5 users', 'Custom corporate dashboard', '24/7 priority support', 'Custom courses'],
  false, true
);
