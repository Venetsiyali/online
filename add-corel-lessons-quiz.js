const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_Z0SdEq6gRThx@ep-autumn-dust-ag4lvh3i-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function updateCorelCourse() {
  const client = new Client({ connectionString });

  try {
    await client.connect();

    // 1. Update the CorelDRAW course description with instructor info
    await client.query(`
      UPDATE courses SET
        description_uz = $1,
        description_ru = $2,
        description_en = $3
      WHERE title_uz = 'CorelDRAW Darslari'
    `, [
      "Bu kursni Kamolova Fazilat shaxsan o'zlari tayyorlagan. Ushbu platforma ham Kamolova Fazilat tomonidan yaratilgan. CorelDRAW grafik muharririni o'rganib, professional darajada dizayn ishlari bilan shug'ullana olasiz. Har bir darsdan so'ng qisqa test topshiriq mavjud bo'lib, barcha darslarni muvaffaqiyatli yakunlaganingizdan so'ng sertifikat olasiz.",
      "Этот курс лично подготовлен Камоловой Фазилат — она также является создателем этой платформы. Вы научитесь работать в CorelDRAW на профессиональном уровне. После каждого урока вас ждёт мини-тест, а по завершении всех уроков вы получите сертификат.",
      "This course was personally created by Kamolova Fazilat — she is also the founder of this platform. You will learn CorelDRAW at a professional level. Each lesson includes a mini quiz, and upon completing all lessons you will receive a certificate."
    ]);
    console.log("Course description updated with instructor info.");

    // 2. Get the CorelDRAW course ID
    const courseRes = await client.query(`SELECT id FROM courses WHERE title_uz = 'CorelDRAW Darslari' LIMIT 1`);
    if (courseRes.rowCount === 0) {
      console.log('CorelDRAW course not found!');
      return;
    }
    const courseId = courseRes.rows[0].id;

    // 3. Get all lessons for this course
    const lessonsRes = await client.query(`SELECT id, order_index FROM lessons WHERE course_id = $1 ORDER BY order_index ASC`, [courseId]);
    const lessons = lessonsRes.rows;

    if (lessons.length === 0) {
      console.log('No lessons found!');
      return;
    }

    // 4. Lesson content definitions
    const lessonData = [
      {
        title_uz: "1-dars: CorelDRAW ga kirish",
        title_ru: "Урок 1: Введение в CorelDRAW",
        title_en: "Lesson 1: Introduction to CorelDRAW",
        content_uz: `CorelDRAW — bu vektor grafikasini yaratish uchun mo'ljallangan professional dastur. Ushbu darsda dasturning asosiy interfeysi va asboblari bilan tanishamiz.

Kamolova Fazilat o'z tajribasidan: "CorelDRAW men uchun ijodiy erkinlik berdi. Birinchi darsdan boshlang va qo'rqmang!"

Asosiy tushunchalar:
• Vektor grafika nima?
• CorelDRAW interfeysi: asboblar paneli, xususiyatlar paneli
• Yangi hujjat yaratish
• Asosiy shakllar: to'rtburchak, aylana, chiziq`,
        content_ru: `CorelDRAW — профессиональная программа для создания векторной графики. В этом уроке мы познакомимся с основным интерфейсом и инструментами программы.

От Камоловой Фазилат: "CorelDRAW дал мне творческую свободу. Начните с первого урока и не бойтесь!"

Основные понятия:
• Что такое векторная графика?
• Интерфейс CorelDRAW: панель инструментов, панель свойств
• Создание нового документа
• Основные фигуры: прямоугольник, круг, линия`,
        content_en: `CorelDRAW is a professional program for creating vector graphics. In this lesson, we'll get familiar with the main interface and tools.

From Kamolova Fazilat: "CorelDRAW gave me creative freedom. Start with lesson one and don't be afraid!"

Key concepts:
• What is vector graphics?
• CorelDRAW interface: toolbox, properties panel
• Creating a new document
• Basic shapes: rectangle, circle, line`,
        duration: 20
      },
      {
        title_uz: "2-dars: Shakllar va Ranglar bilan ishlash",
        title_ru: "Урок 2: Работа с формами и цветами",
        title_en: "Lesson 2: Working with Shapes and Colors",
        content_uz: `Bu darsda shakllar bilan ishlash va rang qo'llash usullarini o'rganamiz.

Kamolova Fazilat maslahat beradi: "Ranglar asar ruhini belgilaydi. To'g'ri rang tanlash — muvaffaqiyat kalitidir!"

Mavzular:
• Shakllarni tahrirlash: o'lcham, joy, burilish
• Fill (to'ldirish) va Outline (kontur) nima?
• Ranglar paneli bilan ishlash
• Gradient ranglar yaratish
• Qatlamlarni (layers) boshqarish`,
        content_ru: `В этом уроке мы научимся работать с формами и применять цвета.

Совет от Камоловой Фазилат: "Цвета определяют душу работы. Правильный выбор цвета — ключ к успеху!"

Темы:
• Редактирование форм: размер, позиция, поворот
• Что такое Fill (заливка) и Outline (контур)?
• Работа с палитрой цветов
• Создание градиентных цветов
• Управление слоями (layers)`,
        content_en: `In this lesson we learn to work with shapes and apply colors.

Kamolova Fazilat advises: "Colors define the soul of a work. Choosing the right colors is the key to success!"

Topics:
• Editing shapes: size, position, rotation
• What are Fill and Outline?
• Working with the color palette
• Creating gradient colors
• Managing layers`,
        duration: 25
      },
      {
        title_uz: "3-dars: Matn va Tipografiya",
        title_ru: "Урок 3: Текст и Типография",
        title_en: "Lesson 3: Text and Typography",
        content_uz: `Matn va tipografiya dizayndagi muhim elementlar. Bu darsda CorelDRAW'da matn bilan professional ishlashni o'rganamiz.

Kamolova Fazilat aytadi: "Yaxshi tipografiya — yaxshi dizaynning yarmi!"

Mavzular:
• Artistic Text va Paragraph Text farqi
• Shrift (font) tanlash va o'lchamini belgilash
• Matn yo'nalishi va shaklga moslash
• Harflar orasidagi masofa (kerning, leading)
• Matnni vektor shahcaga aylantirish (Convert to Curves)`,
        content_ru: `Текст и типография — важные элементы дизайна. В этом уроке мы научимся профессионально работать с текстом в CorelDRAW.

Камолова Фазилат говорит: "Хорошая типографика — половина хорошего дизайна!"

Темы:
• Разница между Artistic Text и Paragraph Text
• Выбор шрифта и установка размера
• Направление текста и привязка к форме
• Расстояние между буквами (kerning, leading)
• Перевод текста в кривые (Convert to Curves)`,
        content_en: `Text and typography are important elements of design. In this lesson we learn to work with text professionally in CorelDRAW.

Kamolova Fazilat says: "Good typography is half of good design!"

Topics:
• Difference between Artistic Text and Paragraph Text
• Choosing fonts and setting size
• Text direction and wrapping to shapes
• Letter spacing (kerning, leading)
• Converting text to curves`,
        duration: 22
      },
      {
        title_uz: "4-dars: Logo va Loyiha Yaratish",
        title_ru: "Урок 4: Создание Логотипа и Проекта",
        title_en: "Lesson 4: Creating a Logo and Project",
        content_uz: `Oxirgi darsda o'rgangan bilimlarimizni amalda qo'llab, to'liq logo va dizayn loyihasini yaratamiz.

Kamolova Fazilat: "Bu darsni tugatib, siz allaqachon CorelDRAW ustasisiga aylana boshladingiz! Sertifikatingiz tayyor bo'ladi!"

Mavzular:
• Logo yaratish bosqichlari
• Eksport: PNG, PDF, SVG formatlarida saqlash
• Professional loyiha tashkil etish
• Haqiqiy loyihani noldan oxirigacha yaratish
• CorelDRAW'dan keyin: keyingi qadamlar`,
        content_ru: `В последнем уроке мы применим полученные знания на практике и создадим полноценный логотип и дизайн-проект.

Камолова Фазилат: "Закончив этот урок, вы уже становитесь мастером CorelDRAW! Ваш сертификат будет готов!"

Темы:
• Этапы создания логотипа
• Экспорт: сохранение в форматах PNG, PDF, SVG
• Организация профессионального проекта
• Создание реального проекта с нуля до конца
• После CorelDRAW: следующие шаги`,
        content_en: `In the final lesson we apply our knowledge in practice and create a complete logo and design project.

Kamolova Fazilat: "Finishing this lesson, you are already becoming a CorelDRAW master! Your certificate will be ready!"

Topics:
• Steps to create a logo
• Export: saving in PNG, PDF, SVG formats
• Organizing a professional project
• Creating a real project from scratch to finish
• After CorelDRAW: next steps`,
        duration: 30
      }
    ];

    // 5. Quiz questions per lesson
    const quizData = [
      // Lesson 1 quizzes
      [
        {
          question_uz: "CorelDRAW qanday turdagi grafika dasturi?",
          question_ru: "Какой тип графической программы CorelDRAW?",
          question_en: "What type of graphics program is CorelDRAW?",
          options_uz: ["Raster grafika", "Vektor grafika", "3D modellashtirish"],
          options_ru: ["Растровая графика", "Векторная графика", "3D моделирование"],
          options_en: ["Raster graphics", "Vector graphics", "3D modeling"],
          correct_option: 1,
          explanation_uz: "CorelDRAW vektor grafika dasturi bo'lib, shakllar matematik formulalar asosida saqlanadi.",
          explanation_ru: "CorelDRAW — программа векторной графики, где формы хранятся на основе математических формул.",
          explanation_en: "CorelDRAW is a vector graphics program where shapes are stored based on mathematical formulas."
        },
        {
          question_uz: "CorelDRAW da yangi hujjat yaratish uchun qaysi tugmalar ishlatiladi?",
          question_ru: "Какие клавиши используются для создания нового документа в CorelDRAW?",
          question_en: "Which shortcut is used to create a new document in CorelDRAW?",
          options_uz: ["Ctrl+N", "Ctrl+O", "Ctrl+S"],
          options_ru: ["Ctrl+N", "Ctrl+O", "Ctrl+S"],
          options_en: ["Ctrl+N", "Ctrl+O", "Ctrl+S"],
          correct_option: 0,
          explanation_uz: "Ctrl+N — yangi hujjat ochish uchun standart tugmalar kombinatsiyasi.",
          explanation_ru: "Ctrl+N — стандартное сочетание клавиш для открытия нового документа.",
          explanation_en: "Ctrl+N is the standard shortcut to open a new document."
        },
        {
          question_uz: "Bu platformani va CorelDRAW kursini kim yaratgan?",
          question_ru: "Кто создал эту платформу и курс CorelDRAW?",
          question_en: "Who created this platform and the CorelDRAW course?",
          options_uz: ["Abdullayev Bobur", "Kamolova Fazilat", "Rashidova Malika"],
          options_ru: ["Абдуллаев Бобур", "Камолова Фазилат", "Рашидова Малика"],
          options_en: ["Abdullayev Bobur", "Kamolova Fazilat", "Rashidova Malika"],
          correct_option: 1,
          explanation_uz: "Bu platformani va CorelDRAW kursini Kamolova Fazilat shaxsan o'zlari yaratgan.",
          explanation_ru: "Эту платформу и курс CorelDRAW лично создала Камолова Фазилат.",
          explanation_en: "This platform and the CorelDRAW course were personally created by Kamolova Fazilat."
        }
      ],
      // Lesson 2 quizzes
      [
        {
          question_uz: "CorelDRAW da shaklni to'ldirish uchun qaysi xususiyat ishlatiladi?",
          question_ru: "Какое свойство используется для заливки фигуры в CorelDRAW?",
          question_en: "Which property is used to fill a shape in CorelDRAW?",
          options_uz: ["Outline", "Fill", "Shadow"],
          options_ru: ["Outline", "Fill", "Shadow"],
          options_en: ["Outline", "Fill", "Shadow"],
          correct_option: 1,
          explanation_uz: "Fill (to'ldirish) xususiyati shakl ichini rang bilan to'ldiradi.",
          explanation_ru: "Свойство Fill (заливка) заполняет внутренность фигуры цветом.",
          explanation_en: "The Fill property fills the inside of a shape with color."
        },
        {
          question_uz: "Gradient nima?",
          question_ru: "Что такое градиент?",
          question_en: "What is a gradient?",
          options_uz: ["Bir xil rang", "Bir rangdan ikkinchi rangga o'tish", "Shaffof rang"],
          options_ru: ["Однотонный цвет", "Переход от одного цвета к другому", "Прозрачный цвет"],
          options_en: ["A solid color", "A transition from one color to another", "A transparent color"],
          correct_option: 1,
          explanation_uz: "Gradient — bir rangdan boshqa rangga silliq o'tishdir.",
          explanation_ru: "Градиент — плавный переход от одного цвета к другому.",
          explanation_en: "A gradient is a smooth transition from one color to another."
        },
        {
          question_uz: "Qatlamlar (Layers) nimaga kerak?",
          question_ru: "Зачем нужны слои (Layers)?",
          question_en: "What are layers used for?",
          options_uz: ["Faqat rang saqlash uchun", "Ob'ektlarni tartibli boshqarish uchun", "Matn yozish uchun"],
          options_ru: ["Только для хранения цветов", "Для упорядоченного управления объектами", "Для написания текста"],
          options_en: ["Only for storing colors", "For organized management of objects", "For writing text"],
          correct_option: 1,
          explanation_uz: "Qatlamlar ob'ektlarni tartibli va oson boshqarish imkonini beradi.",
          explanation_ru: "Слои позволяют упорядоченно и легко управлять объектами.",
          explanation_en: "Layers allow for organized and easy management of objects."
        }
      ],
      // Lesson 3 quizzes
      [
        {
          question_uz: "Artistic Text va Paragraph Text orasidagi farq nima?",
          question_ru: "В чём разница между Artistic Text и Paragraph Text?",
          question_en: "What is the difference between Artistic Text and Paragraph Text?",
          options_uz: ["Artistic Text katta matnlar uchun", "Artistic Text qisqa sarlavhalar, Paragraph Text uzun matnlar uchun", "Hech qanday farq yo'q"],
          options_ru: ["Artistic Text для длинных текстов", "Artistic Text для коротких заголовков, Paragraph Text для длинных текстов", "Нет никакой разницы"],
          options_en: ["Artistic Text is for long texts", "Artistic Text for short headings, Paragraph Text for long texts", "There is no difference"],
          correct_option: 1,
          explanation_uz: "Artistic Text qisqa sarlavhalar, Paragraph Text esa uzun matnlar uchun mo'ljallangan.",
          explanation_ru: "Artistic Text предназначен для коротких заголовков, а Paragraph Text — для длинных текстов.",
          explanation_en: "Artistic Text is designed for short headings, while Paragraph Text is for long texts."
        },
        {
          question_uz: "Matnni vektorda saqlash uchun qaysi amal bajariladi?",
          question_ru: "Какое действие выполняется для сохранения текста в векторе?",
          question_en: "What action is performed to save text as a vector?",
          options_uz: ["Convert to Bitmap", "Convert to Curves", "Convert to PDF"],
          options_ru: ["Convert to Bitmap", "Convert to Curves", "Convert to PDF"],
          options_en: ["Convert to Bitmap", "Convert to Curves", "Convert to PDF"],
          correct_option: 1,
          explanation_uz: "Convert to Curves matnni vektor ko'rinishiga o'tkazib, shrift kerak bo'lmaydigan qiladi.",
          explanation_ru: "Convert to Curves переводит текст в векторный вид, устраняя необходимость в шрифте.",
          explanation_en: "Convert to Curves converts text to vector form, eliminating the need for the font."
        },
        {
          question_uz: "Kerning nima?",
          question_ru: "Что такое Kerning?",
          question_en: "What is Kerning?",
          options_uz: ["Matn rangi", "Harflar orasidagi masofa", "Shrift o'lchami"],
          options_ru: ["Цвет текста", "Расстояние между буквами", "Размер шрифта"],
          options_en: ["Text color", "Space between letters", "Font size"],
          correct_option: 1,
          explanation_uz: "Kerning — ikki harf orasidagi masofani sozlash.",
          explanation_ru: "Kerning — настройка расстояния между двумя буквами.",
          explanation_en: "Kerning is the adjustment of space between two letters."
        }
      ],
      // Lesson 4 quizzes
      [
        {
          question_uz: "CorelDRAW da logo qaysi formatda eksport qilinadi?",
          question_ru: "В каком формате экспортируется логотип из CorelDRAW?",
          question_en: "In what format is a logo exported from CorelDRAW?",
          options_uz: ["Faqat JPG", "PNG, SVG yoki PDF", "Faqat BMP"],
          options_ru: ["Только JPG", "PNG, SVG или PDF", "Только BMP"],
          options_en: ["Only JPG", "PNG, SVG or PDF", "Only BMP"],
          correct_option: 1,
          explanation_uz: "Logo uchun PNG (shaffof fon), SVG (vektor) yoki PDF formatlaridan foydalaniladi.",
          explanation_ru: "Для логотипа используются форматы PNG (прозрачный фон), SVG (вектор) или PDF.",
          explanation_en: "For logos, PNG (transparent background), SVG (vector) or PDF formats are used."
        },
        {
          question_uz: "Ushbu kursni tugatganingizdan so'ng nima olasiz?",
          question_ru: "Что вы получите после завершения этого курса?",
          question_en: "What will you receive after completing this course?",
          options_uz: ["Hech narsa", "Sertifikat", "Pul mukofoti"],
          options_ru: ["Ничего", "Сертификат", "Денежный приз"],
          options_en: ["Nothing", "A Certificate", "A cash prize"],
          correct_option: 1,
          explanation_uz: "Barcha darslarni muvaffaqiyatli yakunlaganingizdan so'ng sertifikat olasiz!",
          explanation_ru: "После успешного завершения всех уроков вы получите сертификат!",
          explanation_en: "After successfully completing all lessons, you will receive a certificate!"
        },
        {
          question_uz: "CorelDRAW o'rganish uchun eng yaxshi usul qaysi?",
          question_ru: "Какой лучший способ изучить CorelDRAW?",
          question_en: "What is the best way to learn CorelDRAW?",
          options_uz: ["Faqat o'qish", "Amaliy mashq qilish va loyihalar bajarish", "Faqat video ko'rish"],
          options_ru: ["Только читать", "Практиковаться и выполнять проекты", "Только смотреть видео"],
          options_en: ["Only reading", "Practicing and completing projects", "Only watching videos"],
          correct_option: 1,
          explanation_uz: "Amaliy mashq — eng samarali o'rganish usuli. Har bir darsdan keyin o'zingiz mashq qiling!",
          explanation_ru: "Практика — самый эффективный способ обучения. Практикуйтесь после каждого урока!",
          explanation_en: "Practice is the most effective learning method. Practice after each lesson!"
        }
      ]
    ];

    // 6. Update each lesson content and add quizzes
    for (let i = 0; i < lessons.length && i < lessonData.length; i++) {
      const lessonId = lessons[i].id;
      const ld = lessonData[i];

      // Update lesson content
      await client.query(`
        UPDATE lessons SET
          title_uz = $1, title_ru = $2, title_en = $3,
          content_uz = $4, content_ru = $5, content_en = $6,
          duration_minutes = $7
        WHERE id = $8
      `, [
        ld.title_uz, ld.title_ru, ld.title_en,
        ld.content_uz, ld.content_ru, ld.content_en,
        ld.duration, lessonId
      ]);
      console.log(`Updated lesson ${i + 1}: ${ld.title_uz}`);

      // Delete old quizzes for this lesson
      await client.query(`DELETE FROM quiz_questions WHERE lesson_id = $1`, [lessonId]);

      // Insert new quiz questions
      const quizList = quizData[i];
      for (let j = 0; j < quizList.length; j++) {
        const q = quizList[j];
        await client.query(`
          INSERT INTO quiz_questions (
            lesson_id, question_uz, question_ru, question_en,
            options_uz, options_ru, options_en,
            correct_option,
            explanation_uz, explanation_ru, explanation_en,
            order_index
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          lessonId,
          q.question_uz, q.question_ru, q.question_en,
          JSON.stringify(q.options_uz), JSON.stringify(q.options_ru), JSON.stringify(q.options_en),
          q.correct_option,
          q.explanation_uz, q.explanation_ru, q.explanation_en,
          j + 1
        ]);
      }
      console.log(`  -> Added ${quizList.length} quiz questions for lesson ${i + 1}`);
    }

    console.log('\n✅ All done! CorelDRAW course fully updated with content, quizzes, and instructor info.');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

updateCorelCourse();
