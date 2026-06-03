const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_Z0SdEq6gRThx@ep-autumn-dust-ag4lvh3i-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function addNewCourses() {
  const client = new Client({ connectionString });
  
  const coursesData = [
    {
      title: "50 Daqiqa ichida HTML dasturlashni o'rganamiz",
      url: "jCbCYTNU54g",
      category: "Web Development",
      createdAt: "2023-01-06T00:00:00Z"
    },
    {
      title: "50 Daqiqa ichida CSS dasturlashni o'rganamiz",
      url: "By4VqhaeUgM",
      category: "Web Development",
      createdAt: "2023-01-05T00:00:00Z"
    },
    {
      title: "Bootstrapda Web sayt yaratish, boshlang'ichlar uchun. Web dasturlash",
      url: "svJ2GqYuWmE",
      category: "Web Development",
      createdAt: "2023-01-04T00:00:00Z"
    },
    {
      title: "Tailwind css - N1, Eng zo'r css Frameworkni o'rganamiz",
      url: "XfyqcNbx91w",
      category: "Web Development",
      createdAt: "2023-01-03T00:00:00Z"
    },
    {
      title: "Terminal ni to'liq o'rganamiz. Buyruqlar yozish",
      url: "sE2aM_RknQY",
      category: "Development Tools",
      createdAt: "2023-01-02T00:00:00Z"
    },
    {
      title: "Git va Github ni to'liq o'rganish. | Nazariy, Amaliy va Haqiqiy Proyektda",
      url: "Yzc9BSC8rwk",
      category: "Development Tools",
      createdAt: "2023-01-01T00:00:00Z"
    }
  ];

  try {
    await client.connect();
    
    // Check if they already exist
    const { rows: existing } = await client.query('SELECT youtube_url FROM courses');
    const existingUrls = existing.map(c => c.youtube_url);
    
    for (const course of coursesData) {
      if (!existingUrls.includes(course.url)) {
        await client.query(`
          INSERT INTO courses (
            title_uz, title_ru, title_en,
            description_uz, description_ru, description_en,
            youtube_url, category, is_free, is_published, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          course.title,
          course.title, // Ru mock
          course.title, // En mock
          course.title + ' haqida qisqacha ma\\\'lumot. Ushbu kurs orqali siz yangi bilimlarni egallaysiz.',
          'Краткая информация о ' + course.title,
          'Brief info about ' + course.title,
          course.url,
          course.category,
          true,
          true,
          course.createdAt
        ]);
        console.log(`Inserted: ${course.title}`);
      } else {
        console.log(`Already exists: ${course.title}`);
      }
    }

    console.log('Successfully seeded all new courses!');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await client.end();
  }
}

addNewCourses();
