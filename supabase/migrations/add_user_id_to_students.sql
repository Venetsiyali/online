-- Migration: Add user_id to students table for Supabase Auth integration
-- Run this in your Supabase SQL Editor

-- 1. Add user_id column (nullable — existing rows enrolled without auth)
ALTER TABLE students ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students (user_id);

-- 3. RLS policy: logged-in users can read their own enrollments
CREATE POLICY "Users can read own enrollments"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

-- 4. RLS policy: allow insert from authenticated users (anon key) — user_id must match
CREATE POLICY "Users can insert own enrollment"
  ON students FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
