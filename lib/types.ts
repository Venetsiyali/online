export type Locale = 'uz' | 'ru' | 'en';

export interface Course {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  youtube_url: string;
  thumbnail_url: string;
  category: string;
  is_free: boolean;
  is_published: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  is_published: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  course_id: string;
  enrolled_at: string;
  courses?: {
    title_uz: string;
    title_ru: string;
    title_en: string;
  };
}

export interface PricingPlan {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  price: number;
  currency: string;
  features_uz: string[];
  features_ru: string[];
  features_en: string[];
  is_popular: boolean;
  is_active: boolean;
}

// ============================================================
// Learning Features
// ============================================================

export interface Lesson {
  id: string;
  course_id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  video_url: string | null;
  duration_minutes: number;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  lesson_id: string;
  question_uz: string;
  question_ru: string;
  question_en: string;
  options_uz: string[];
  options_ru: string[];
  options_en: string[];
  correct_option: number;
  explanation_uz: string;
  explanation_ru: string;
  explanation_en: string;
  order_index: number;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  quiz_score: number | null;
  completed_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  full_name: string;
  issued_at: string;
}

export interface LocalizedLesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  video_url: string | null;
  duration_minutes: number;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export interface LocalizedQuizQuestion {
  id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_option: number;
  explanation: string;
  order_index: number;
}

// ============================================================
// Localized types
// ============================================================

export interface LocalizedCourse {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  category: string;
  is_free: boolean;
  is_published: boolean;
  created_at: string;
}

export interface LocalizedAnnouncement {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

export interface LocalizedPricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

export function localizeCourse(course: Course, locale: Locale): LocalizedCourse {
  return {
    id: course.id,
    title: course[`title_${locale}`] || course.title_en,
    description: course[`description_${locale}`] || course.description_en,
    youtube_url: course.youtube_url,
    thumbnail_url: course.thumbnail_url,
    category: course.category,
    is_free: course.is_free,
    is_published: course.is_published,
    created_at: course.created_at,
  };
}

export function localizeAnnouncement(ann: Announcement, locale: Locale): LocalizedAnnouncement {
  return {
    id: ann.id,
    title: ann[`title_${locale}`] || ann.title_en,
    content: ann[`content_${locale}`] || ann.content_en,
    is_published: ann.is_published,
    created_at: ann.created_at,
  };
}

export function localizePricingPlan(plan: PricingPlan, locale: Locale): LocalizedPricingPlan {
  return {
    id: plan.id,
    name: plan[`name_${locale}`] || plan.name_en,
    price: plan.price,
    currency: plan.currency,
    features: plan[`features_${locale}`] || plan.features_en,
    is_popular: plan.is_popular,
    is_active: plan.is_active,
  };
}

export function localizeLesson(lesson: Lesson, locale: Locale): LocalizedLesson {
  return {
    id: lesson.id,
    course_id: lesson.course_id,
    title: lesson[`title_${locale}`] || lesson.title_en,
    content: lesson[`content_${locale}`] || lesson.content_en,
    video_url: lesson.video_url,
    duration_minutes: lesson.duration_minutes,
    order_index: lesson.order_index,
    is_published: lesson.is_published,
    created_at: lesson.created_at,
  };
}

export function localizeQuizQuestion(q: QuizQuestion, locale: Locale): LocalizedQuizQuestion {
  return {
    id: q.id,
    lesson_id: q.lesson_id,
    question: q[`question_${locale}`] || q.question_en,
    options: (q[`options_${locale}`] as string[]) || (q.options_en as string[]),
    correct_option: q.correct_option,
    explanation: q[`explanation_${locale}`] || q.explanation_en,
    order_index: q.order_index,
  };
}
