const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_Z0SdEq6gRThx@ep-autumn-dust-ag4lvh3i-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function addCorelCourse() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    // Check if course already exists
    const courseRes = await client.query(`SELECT id FROM courses WHERE title_uz = 'CorelDRAW Darslari' LIMIT 1`);
    let courseId;
    
    if (courseRes.rowCount === 0) {
      // Insert the CorelDRAW course, use current date or future date to make it appear at the top
      const insertRes = await client.query(`
        INSERT INTO courses (
          title_uz, title_ru, title_en,
          description_uz, description_ru, description_en,
          youtube_url, category, is_free, is_published, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) RETURNING id
      `, [
        "CorelDRAW Darslari",
        "Уроки CorelDRAW",
        "CorelDRAW Lessons",
        "Loyihamiz asoschisi tomonidan tayyorlangan CorelDRAW bo'yicha mukammal video darsliklar to'plami.",
        "Отличный сборник видеоуроков по CorelDRAW, подготовленный основателем нашего проекта.",
        "A comprehensive collection of CorelDRAW video lessons prepared by the founder of our project.",
        'dwQbWkDCk40', // 1st lesson as thumbnail
        'Dizayn',
        true,
        true
      ]);
      courseId = insertRes.rows[0].id;
      console.log('Course "CorelDRAW Darslari" added.');
    } else {
      courseId = courseRes.rows[0].id;
      console.log('Course already exists, skipping course insertion.');
      // Delete existing lessons to prevent duplicates if rerunning
      await client.query(`DELETE FROM lessons WHERE course_id = $1`, [courseId]);
    }

    const lessons = [
      {
        title: "1-dars",
        url: "https://www.youtube.com/watch?v=dwQbWkDCk40"
      },
      {
        title: "2-dars",
        url: "https://www.youtube.com/watch?v=iKYYDQpP7QA"
      },
      {
        title: "3-dars",
        url: "https://www.youtube.com/watch?v=-aGZyoG69_g"
      },
      {
        title: "4-dars",
        url: "https://www.youtube.com/watch?v=cBCwj6smRJc"
      }
    ];

    for (let i = 0; i < lessons.length; i++) {
      await client.query(`
        INSERT INTO lessons (
          course_id, title_uz, title_ru, title_en, 
          content_uz, content_ru, content_en, 
          video_url, duration_minutes, order_index, is_published
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        courseId,
        lessons[i].title,
        lessons[i].title,
        lessons[i].title,
        "CorelDRAW bo'yicha video darslik.",
        "Видеоурок по CorelDRAW.",
        "CorelDRAW video lesson.",
        lessons[i].url,
        15, // mock duration
        i + 1,
        true
      ]);
      console.log(`Inserted lesson: ${lessons[i].title}`);
    }

    console.log('Successfully seeded CorelDRAW course and lessons!');

  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await client.end();
  }
}

addCorelCourse();
