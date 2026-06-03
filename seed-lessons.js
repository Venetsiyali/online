const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_Z0SdEq6gRThx@ep-autumn-dust-ag4lvh3i-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function seedLessons() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    // Get the python course
    const courseRes = await client.query(`SELECT id FROM courses WHERE title_en = 'Python Programming Fundamentals' LIMIT 1`);
    if (courseRes.rowCount === 0) {
      console.log('Course not found');
      return;
    }
    const courseId = courseRes.rows[0].id;

    // Delete existing lessons to prevent duplicates if ran multiple times
    await client.query(`DELETE FROM lessons WHERE course_id = $1`, [courseId]);

    // Insert Lesson 1
    const l1Res = await client.query(`
      INSERT INTO lessons (course_id, title_uz, title_ru, title_en, content_uz, content_ru, content_en, video_url, duration_minutes, order_index, is_published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
    `, [
      courseId,
      '1. Python ga kirish',
      '1. Введение в Python',
      '1. Introduction to Python',
      "Python juda sodda va kuchli dasturlash tili. Ushbu leksiyada biz o'zgaruvchilar va ma'lumotlar turlarini ko'rib chiqamiz.",
      'Python - очень простой и мощный язык. В этой лекции мы рассмотрим переменные и типы данных.',
      'Python is a very simple and powerful language. In this lecture we will cover variables and data types.',
      'https://www.youtube.com/watch?v=kqtD5dpn9C8',
      15,
      1,
      true
    ]);
    const l1Id = l1Res.rows[0].id;

    // Insert Quiz for Lesson 1
    await client.query(`
      INSERT INTO quiz_questions (lesson_id, question_uz, question_ru, question_en, options_uz, options_ru, options_en, correct_option, explanation_uz, explanation_ru, explanation_en, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      l1Id,
      'Python qanday til?',
      'Какой язык Python?',
      'What kind of language is Python?',
      JSON.stringify(['Qiyin', 'Oson va tushunarli', 'Faqat raqamli']),
      JSON.stringify(['Сложный', 'Простой и понятный', 'Только числовой']),
      JSON.stringify(['Hard', 'Simple and readable', 'Only numeric']),
      1,
      "Python sintaksisi oddiy va inson oqishi uchun qulay qilib ishlangan.",
      'Синтаксис Python прост и удобен для чтения.',
      'Python syntax is simple and designed for readability by humans.',
      1
    ]);

    // Insert Lesson 2
    const l2Res = await client.query(`
      INSERT INTO lessons (course_id, title_uz, title_ru, title_en, content_uz, content_ru, content_en, video_url, duration_minutes, order_index, is_published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
    `, [
      courseId,
      '2. Funksiyalar',
      '2. Функции',
      '2. Functions',
      "Funksiyalar kodni qatiy takrorlamaslik (DRY) uchun kerak. Ular yordamida har xil logikalarni bloklarga ajratamiz.",
      'Функции нужны для избежания повторения кода (DRY). С их помощью мы разделяем логику на блоки.',
      'Functions are needed to not repeat code (DRY). We use them to split logic into blocks.',
      'https://www.youtube.com/watch?v=9Os0o3wzS_I',
      20,
      2,
      true
    ]);
    const l2Id = l2Res.rows[0].id;

    // Insert Quiz for Lesson 2
    await client.query(`
      INSERT INTO quiz_questions (lesson_id, question_uz, question_ru, question_en, options_uz, options_ru, options_en, correct_option, explanation_uz, explanation_ru, explanation_en, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      l2Id,
      'DRY qoidasi nimani anglatadi?',
      'Что означает принцип DRY?',
      'What does DRY mean?',
      JSON.stringify(['Do Repeat Yourself', "Don't Repeat Yourself", 'Do Rely Yourself']),
      JSON.stringify(['Повторяй за собой', 'Не повторяй себя', 'Полагайся на себя']),
      JSON.stringify(['Do Repeat Yourself', "Don't Repeat Yourself", 'Do Rely Yourself']),
      1,
      'DRY - kod takrorlanishini oldini olish tamoyili.',
      'DRY - принцип предотвращения дублирования кода.',
      'DRY is the principle of not letting code to be duplicated.',
      1
    ]);

    console.log('Successfully seeded Lessons and Quizzes!');

  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await client.end();
  }
}

seedLessons();
