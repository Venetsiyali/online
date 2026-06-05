const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_Z0SdEq6gRThx@ep-autumn-dust-ag4lvh3i-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

// Video ID extraction
const videos = [
  { id: '1-6_9I3vSC4', duration: 36, order: 1 },
  { id: 'RTwRdfAJn-4', duration: 48, order: 2 },
  { id: 'ke8Us13Cw5k', duration: 39, order: 3 },
  { id: 'tUp4FZrf3jM', duration: 37, order: 4 },
  { id: 'VG0nPjIa7ro', duration: 44, order: 5 },
  { id: 'sbo6iRJ8oiQ', duration: 20, order: 6 },
  { id: 'w9uDGCVwYyk', duration: 29, order: 7 },
  { id: '0BpQzCXAm-Y', duration: 35, order: 8 },
  { id: 'bNaqjOi7d4Y', duration: 43, order: 9 },
  { id: 'qe8fj_-cGt4', duration: 32, order: 10 },
];

const lessons = [
  {
    title_uz: "1-dars: I-II Bob — Algebra asoslari",
    title_ru: "Урок 1: I-II глава — Основы алгебры",
    title_en: "Lesson 1: Ch.I-II — Algebra Basics",
    content_uz: `9-sinf matematika I-II bob bo'yicha imtihon savollari yechimi.

O'qituvchi Salomov Furqat (Math F) tayyorlagan:

📌 Asosiy mavzular:
• Algebraik ifodalar va ularni soddalashtirish
• Ko'phadlar: qo'shish, ayirish, ko'paytirish
• Algebraik kasrlar va ularni qisqartirish
• Ayniyatlar va ularni isbotlash

💡 Eslab qoling:
Algebraik ifodani soddalashtirish uchun avval qavslarni oching, keyin o'xshash hadlarni guruhlang.

🎯 Imtihon uchun tayyorgarlik:
Bu bobdan har yili 3-4 ta savol imtihonga kiradi. Ayniqsa ko'phadlarni ko'paytirish va qisqartirish formulalari muhim!`,
    content_ru: `Решение задач по математике 9-класса, I-II главы.

Подготовлено учителем Саломовым Фурқатом (Math F):

📌 Основные темы:
• Алгебраические выражения и их упрощение
• Многочлены: сложение, вычитание, умножение
• Алгебраические дроби и их сокращение
• Тождества и их доказательство

💡 Запомните:
Для упрощения алгебраического выражения сначала раскройте скобки, затем сгруппируйте подобные члены.

🎯 Подготовка к экзамену:
Из этой главы на экзамене обычно встречается 3-4 вопроса.`,
    content_en: `9th grade math exam solutions — Chapters I-II.

Prepared by teacher Salomov Furqat (Math F):

📌 Main topics:
• Algebraic expressions and simplification
• Polynomials: addition, subtraction, multiplication
• Algebraic fractions and reduction
• Identities and their proofs

💡 Remember:
To simplify an algebraic expression, first expand the brackets, then group like terms.`,
    quiz: [
      {
        question_uz: "(a+b)² formulasi qaysi?",
        question_ru: "Какова формула (a+b)²?",
        question_en: "What is the formula for (a+b)²?",
        options_uz: ["a²+b²", "a²+2ab+b²", "a²-2ab+b²"],
        options_ru: ["a²+b²", "a²+2ab+b²", "a²-2ab+b²"],
        options_en: ["a²+b²", "a²+2ab+b²", "a²-2ab+b²"],
        correct_option: 1,
        explanation_uz: "(a+b)² = a²+2ab+b² — to'liq kvadrat formulasi.",
        explanation_ru: "(a+b)² = a²+2ab+b² — формула полного квадрата.",
        explanation_en: "(a+b)² = a²+2ab+b² — perfect square formula.",
      },
      {
        question_uz: "a²-b² ifodasi qanday ko'paytirgichlarga ajratiladi?",
        question_ru: "На какие множители разлагается выражение a²-b²?",
        question_en: "How is a²-b² factored?",
        options_uz: ["(a+b)²", "(a-b)²", "(a+b)(a-b)"],
        options_ru: ["(a+b)²", "(a-b)²", "(a+b)(a-b)"],
        options_en: ["(a+b)²", "(a-b)²", "(a+b)(a-b)"],
        correct_option: 2,
        explanation_uz: "a²-b² = (a+b)(a-b) — kvadratlar ayirmasi formulasi.",
        explanation_ru: "a²-b² = (a+b)(a-b) — формула разности квадратов.",
        explanation_en: "a²-b² = (a+b)(a-b) — difference of squares formula.",
      },
      {
        question_uz: "Ko'phadni ko'phadga bo'lish natijasi nima bo'ladi?",
        question_ru: "Чем является результат деления многочлена на многочлен?",
        question_en: "What is the result of dividing a polynomial by a polynomial?",
        options_uz: ["Har doim butun son", "Ko'phad yoki algebraik kasr", "Har doim 0"],
        options_ru: ["Всегда целое число", "Многочлен или алгебраическая дробь", "Всегда 0"],
        options_en: ["Always a whole number", "A polynomial or algebraic fraction", "Always 0"],
        correct_option: 1,
        explanation_uz: "Ko'phadni ko'phadga bo'lish natijasi ko'phad yoki algebraik kasr bo'ladi.",
        explanation_ru: "Результат деления многочлена на многочлен — многочлен или алгебраическая дробь.",
        explanation_en: "Dividing a polynomial by a polynomial gives a polynomial or algebraic fraction.",
      },
    ],
  },
  {
    title_uz: "2-dars: III-IV Bob — Tengsizliklar",
    title_ru: "Урок 2: III-IV глава — Неравенства",
    title_en: "Lesson 2: Ch.III-IV — Inequalities",
    content_uz: `9-sinf matematika III-IV bob: tenglamalar va tengsizliklar.

📌 Asosiy mavzular:
• Chiziqli tengsizliklar
• Ikkinchi darajali tengsizliklar
• Tengsizliklar sistemasi
• Modulli tengsizliklar: |x| < a va |x| > a

💡 Muhim qoida:
Tengsizlikning ikkala tomonini manfiy songa ko'paytirsak yoki bo'lsak, tengsizlik belgisi TESKARI tomonga o'zgaradi!

📝 Misol: 2x - 4 > 0
→ 2x > 4
→ x > 2

🎯 Imtihon uchun: Tengsizliklar va ularning yechimlari to'plamini son o'qi ustida ko'rsata bilish kerak.`,
    content_ru: `9-класс математика III-IV главы: уравнения и неравенства.

📌 Основные темы:
• Линейные неравенства
• Квадратные неравенства
• Система неравенств
• Неравенства с модулем: |x| < a и |x| > a

💡 Важное правило:
При умножении или делении обеих частей неравенства на отрицательное число знак неравенства МЕНЯЕТСЯ на противоположный!`,
    content_en: `9th grade math Ch.III-IV: equations and inequalities.

📌 Key topics:
• Linear inequalities
• Quadratic inequalities
• Systems of inequalities
• Inequalities with absolute value: |x| < a and |x| > a

💡 Important rule:
When multiplying or dividing both sides by a negative number, the inequality sign REVERSES!`,
    quiz: [
      {
        question_uz: "2x < 6 tengsizligini yeching.",
        question_ru: "Решите неравенство 2x < 6.",
        question_en: "Solve the inequality 2x < 6.",
        options_uz: ["x > 3", "x < 3", "x = 3"],
        options_ru: ["x > 3", "x < 3", "x = 3"],
        options_en: ["x > 3", "x < 3", "x = 3"],
        correct_option: 1,
        explanation_uz: "2x < 6 → x < 3 (ikkala tomonni 2 ga bo'ldik).",
        explanation_ru: "2x < 6 → x < 3 (разделили обе части на 2).",
        explanation_en: "2x < 6 → x < 3 (divided both sides by 2).",
      },
      {
        question_uz: "Tengsizlikning ikkala tomonini -1 ga ko'paytirganda nima bo'ladi?",
        question_ru: "Что происходит при умножении обеих частей неравенства на -1?",
        question_en: "What happens when you multiply both sides of an inequality by -1?",
        options_uz: ["Hech narsa o'zgarmaydi", "Tengsizlik belgisi teskari bo'ladi", "Tengsizlik yo'qoladi"],
        options_ru: ["Ничего не меняется", "Знак неравенства меняется на противоположный", "Неравенство исчезает"],
        options_en: ["Nothing changes", "The inequality sign reverses", "The inequality disappears"],
        correct_option: 1,
        explanation_uz: "Manfiy songa ko'paytirganda tengsizlik belgisi teskari tomonga o'zgaradi: < → >",
        explanation_ru: "При умножении на отрицательное число знак неравенства меняется: < → >",
        explanation_en: "Multiplying by negative reverses the sign: < → >",
      },
      {
        question_uz: "|x| < 3 tengsizligining yechimi qaysi?",
        question_ru: "Каково решение неравенства |x| < 3?",
        question_en: "What is the solution of |x| < 3?",
        options_uz: ["x > 3", "-3 < x < 3", "x < -3 yoki x > 3"],
        options_ru: ["x > 3", "-3 < x < 3", "x < -3 или x > 3"],
        options_en: ["x > 3", "-3 < x < 3", "x < -3 or x > 3"],
        correct_option: 1,
        explanation_uz: "|x| < a bo'lsa, -a < x < a. Demak |x| < 3 → -3 < x < 3.",
        explanation_ru: "Если |x| < a, то -a < x < a. Значит |x| < 3 → -3 < x < 3.",
        explanation_en: "If |x| < a, then -a < x < a. So |x| < 3 → -3 < x < 3.",
      },
    ],
  },
  {
    title_uz: "3-dars: V-VI Bob — Tenglamalar sistemasi",
    title_ru: "Урок 3: V-VI глава — Системы уравнений",
    title_en: "Lesson 3: Ch.V-VI — Systems of Equations",
    content_uz: `9-sinf matematika V-VI bob: tenglamalar va tengsizliklar sistemalari.

📌 Asosiy mavzular:
• Ikki noma'lumli chiziqli tenglamalar sistemasi
• Yechiш usullari: qo'shish, almashtirish, grafik
• Ikkinchi darajali tenglamalar sistemasi
• Amaliy masalalar (so'z masalalari)

💡 Almashtirish usuli:
1. Bir tenglamadan bir noma'lumni topamiz
2. Ikkinchi tenglamaga qo'yamiz
3. Yagona noma'lumli tenglamani yechamiz

📝 Misol: { x + y = 5; x - y = 1 }
→ Qo'shish: 2x = 6 → x = 3
→ y = 5 - 3 = 2`,
    content_ru: `9-класс математика V-VI главы: системы уравнений и неравенств.

📌 Основные темы:
• Системы линейных уравнений с двумя неизвестными
• Методы решения: сложение, подстановка, графический
• Системы квадратных уравнений
• Прикладные задачи (текстовые задачи)

💡 Метод подстановки:
1. Из одного уравнения выражаем одно неизвестное
2. Подставляем во второе уравнение
3. Решаем уравнение с одним неизвестным`,
    content_en: `9th grade math Ch.V-VI: systems of equations and inequalities.

📌 Key topics:
• Systems of linear equations with two unknowns
• Solution methods: addition, substitution, graphical
• Systems of quadratic equations
• Applied problems (word problems)`,
    quiz: [
      {
        question_uz: "{ x+y=10; x-y=4 } sistemasini yeching.",
        question_ru: "Решите систему { x+y=10; x-y=4 }.",
        question_en: "Solve the system { x+y=10; x-y=4 }.",
        options_uz: ["x=6, y=4", "x=7, y=3", "x=8, y=2"],
        options_ru: ["x=6, y=4", "x=7, y=3", "x=8, y=2"],
        options_en: ["x=6, y=4", "x=7, y=3", "x=8, y=2"],
        correct_option: 1,
        explanation_uz: "Qo'shish: 2x=14 → x=7. Ayirish: 2y=6 → y=3.",
        explanation_ru: "Сложение: 2x=14 → x=7. Вычитание: 2y=6 → y=3.",
        explanation_en: "Adding: 2x=14 → x=7. Subtracting: 2y=6 → y=3.",
      },
      {
        question_uz: "Tenglamalar sistemasini yechishning qaysi usuli mavjud?",
        question_ru: "Какие методы решения системы уравнений существуют?",
        question_en: "Which methods exist for solving systems of equations?",
        options_uz: ["Faqat grafik usul", "Qo'shish, almashtirish va grafik usul", "Faqat almashtirish usuli"],
        options_ru: ["Только графический метод", "Сложение, подстановка и графический метод", "Только метод подстановки"],
        options_en: ["Only graphical", "Addition, substitution and graphical", "Only substitution"],
        correct_option: 1,
        explanation_uz: "Sistemani yechishning 3 asosiy usuli: qo'shish, almashtirish va grafik.",
        explanation_ru: "3 основных метода решения: сложение, подстановка и графический.",
        explanation_en: "3 main methods: addition, substitution, and graphical.",
      },
      {
        question_uz: "Ikki noma'lumli chiziqli tenglama geometrik jihatdan neni bildiradi?",
        question_ru: "Что геометрически представляет линейное уравнение с двумя неизвестными?",
        question_en: "What does a linear equation with two unknowns represent geometrically?",
        options_uz: ["Nuqta", "To'g'ri chiziq", "Aylana"],
        options_ru: ["Точка", "Прямая линия", "Окружность"],
        options_en: ["A point", "A straight line", "A circle"],
        correct_option: 1,
        explanation_uz: "ax+by=c kabi chiziqli tenglama koordinatlar tekisligida to'g'ri chiziqni bildiradi.",
        explanation_ru: "Линейное уравнение вида ax+by=c представляет прямую линию на координатной плоскости.",
        explanation_en: "A linear equation ax+by=c represents a straight line in the coordinate plane.",
      },
    ],
  },
  {
    title_uz: "4-dars: VII Bob — Kvadrat funksiyalar",
    title_ru: "Урок 4: VII глава — Квадратичные функции",
    title_en: "Lesson 4: Ch.VII — Quadratic Functions",
    content_uz: `9-sinf matematika VII bob: kvadrat funksiyalar.

📌 Asosiy mavzular:
• f(x) = ax² + bx + c funksiyasi
• Parabolaning uchi, o'qi va yo'nalishi
• Diskriminant: D = b² - 4ac
• Ildizlarning joylashishi (Viyet teoremasi)

💡 Parabolaning uchi:
xₒ = -b/(2a)
yₒ = f(xₒ) = -D/(4a)

📝 Misollar:
• a > 0 → parabola yuqoriga ochiladi (minimum)
• a < 0 → parabola pastga ochiladi (maksimum)
• D > 0 → 2 ta haqiqiy ildiz
• D = 0 → 1 ta ildiz
• D < 0 → haqiqiy ildiz yo'q

🎯 Viyet teoremasi: x₁+x₂ = -b/a; x₁·x₂ = c/a`,
    content_ru: `9-класс математика VII глава: квадратичные функции.

📌 Основные темы:
• Функция f(x) = ax² + bx + c
• Вершина, ось и направление параболы
• Дискриминант: D = b² - 4ac
• Расположение корней (теорема Виета)

💡 Вершина параболы:
xₒ = -b/(2a), yₒ = -D/(4a)

🎯 Теорема Виета: x₁+x₂ = -b/a; x₁·x₂ = c/a`,
    content_en: `9th grade math Ch.VII: quadratic functions.

📌 Key topics:
• Function f(x) = ax² + bx + c
• Vertex, axis, and direction of parabola
• Discriminant: D = b² - 4ac
• Root locations (Vieta's theorem)

💡 Vertex: xₒ = -b/(2a), yₒ = -D/(4a)
🎯 Vieta's: x₁+x₂ = -b/a; x₁·x₂ = c/a`,
    quiz: [
      {
        question_uz: "x²-5x+6=0 tenglamasining diskriminanti qancha?",
        question_ru: "Чему равен дискриминант уравнения x²-5x+6=0?",
        question_en: "What is the discriminant of x²-5x+6=0?",
        options_uz: ["1", "25", "49"],
        options_ru: ["1", "25", "49"],
        options_en: ["1", "25", "49"],
        correct_option: 0,
        explanation_uz: "D = b²-4ac = (-5)²-4·1·6 = 25-24 = 1.",
        explanation_ru: "D = b²-4ac = (-5)²-4·1·6 = 25-24 = 1.",
        explanation_en: "D = b²-4ac = (-5)²-4·1·6 = 25-24 = 1.",
      },
      {
        question_uz: "a > 0 bo'lsa, parabola qaysi tomonga ochiladi?",
        question_ru: "Если a > 0, в какую сторону открывается парабола?",
        question_en: "If a > 0, which direction does the parabola open?",
        options_uz: ["Pastga", "Yuqoriga", "Chapga"],
        options_ru: ["Вниз", "Вверх", "Влево"],
        options_en: ["Downward", "Upward", "To the left"],
        correct_option: 1,
        explanation_uz: "a > 0 bo'lsa, parabola yuqoriga ochiladi (qo'ng'iroqsimon emas, kosaga o'xshash).",
        explanation_ru: "При a > 0 парабола открывается вверх (похожа на чашу).",
        explanation_en: "When a > 0, the parabola opens upward (like a cup).",
      },
      {
        question_uz: "Viyet teoremasi bo'yicha x₁·x₂ nenga teng?",
        question_ru: "По теореме Виета x₁·x₂ равно чему?",
        question_en: "By Vieta's theorem, x₁·x₂ equals?",
        options_uz: ["-b/a", "c/a", "b/a"],
        options_ru: ["-b/a", "c/a", "b/a"],
        options_en: ["-b/a", "c/a", "b/a"],
        correct_option: 1,
        explanation_uz: "Viyet teoremasi: x₁+x₂ = -b/a va x₁·x₂ = c/a.",
        explanation_ru: "Теорема Виета: x₁+x₂ = -b/a и x₁·x₂ = c/a.",
        explanation_en: "Vieta's theorem: x₁+x₂ = -b/a and x₁·x₂ = c/a.",
      },
    ],
  },
  {
    title_uz: "5-dars: VIII-IX Bob — Trigonometrik ayniyatlar",
    title_ru: "Урок 5: VIII-IX глава — Тригонометрические тождества",
    title_en: "Lesson 5: Ch.VIII-IX — Trigonometric Identities",
    content_uz: `9-sinf matematika VIII-IX bob: trigonometrik ayniyatlar.

📌 Asosiy ayniyatlar:
• sin²α + cos²α = 1
• tgα = sinα/cosα
• ctgα = cosα/sinα
• tgα · ctgα = 1

📌 Qo'shish formulalari:
• sin(α+β) = sinα·cosβ + cosα·sinβ
• cos(α+β) = cosα·cosβ - sinα·sinβ

📌 Maxsus burchaklar:
| Burchak | sin | cos | tg |
|---------|-----|-----|-----|
| 0°      |  0  |  1  |  0  |
| 30°     | 1/2 | √3/2| 1/√3|
| 45°     |√2/2 |√2/2 |  1  |
| 60°     |√3/2 | 1/2 | √3  |
| 90°     |  1  |  0  |  ∞  |`,
    content_ru: `9-класс математика VIII-IX главы: тригонометрические тождества.

📌 Основные тождества:
• sin²α + cos²α = 1
• tgα = sinα/cosα
• tgα · ctgα = 1

📌 Формулы сложения:
• sin(α+β) = sinα·cosβ + cosα·sinβ
• cos(α+β) = cosα·cosβ - sinα·sinβ`,
    content_en: `9th grade math Ch.VIII-IX: trigonometric identities.

📌 Main identities:
• sin²α + cos²α = 1
• tgα = sinα/cosα
• tgα · ctgα = 1

📌 Addition formulas:
• sin(α+β) = sinα·cosβ + cosα·sinβ
• cos(α+β) = cosα·cosβ - sinα·sinβ`,
    quiz: [
      {
        question_uz: "sin²α + cos²α = ?",
        question_ru: "sin²α + cos²α = ?",
        question_en: "sin²α + cos²α = ?",
        options_uz: ["0", "1", "2"],
        options_ru: ["0", "1", "2"],
        options_en: ["0", "1", "2"],
        correct_option: 1,
        explanation_uz: "sin²α + cos²α = 1 — trigonometriyaning asosiy ayniyati.",
        explanation_ru: "sin²α + cos²α = 1 — основное тригонометрическое тождество.",
        explanation_en: "sin²α + cos²α = 1 — the fundamental trigonometric identity.",
      },
      {
        question_uz: "sin 30° = ?",
        question_ru: "sin 30° = ?",
        question_en: "sin 30° = ?",
        options_uz: ["√3/2", "1/2", "1"],
        options_ru: ["√3/2", "1/2", "1"],
        options_en: ["√3/2", "1/2", "1"],
        correct_option: 1,
        explanation_uz: "sin 30° = 1/2 — eslab qolish kerak!",
        explanation_ru: "sin 30° = 1/2 — нужно запомнить!",
        explanation_en: "sin 30° = 1/2 — must memorize!",
      },
      {
        question_uz: "tg 45° = ?",
        question_ru: "tg 45° = ?",
        question_en: "tg 45° = ?",
        options_uz: ["0", "1", "√3"],
        options_ru: ["0", "1", "√3"],
        options_en: ["0", "1", "√3"],
        correct_option: 1,
        explanation_uz: "tg 45° = sin45°/cos45° = (√2/2)/(√2/2) = 1.",
        explanation_ru: "tg 45° = sin45°/cos45° = (√2/2)/(√2/2) = 1.",
        explanation_en: "tg 45° = sin45°/cos45° = (√2/2)/(√2/2) = 1.",
      },
    ],
  },
  {
    title_uz: "6-dars: X Bob — Progressiyalar",
    title_ru: "Урок 6: X глава — Прогрессии",
    title_en: "Lesson 6: Ch.X — Progressions",
    content_uz: `9-sinf matematika X bob: arifmetik va geometrik progressiyalar.

📌 Arifmetik progressiya (AP):
• Umumiy had: aₙ = a₁ + (n-1)·d
• Yig'indi: Sₙ = n·(a₁+aₙ)/2 = n·(2a₁+(n-1)·d)/2
• d = aₙ - aₙ₋₁ (farq)

📌 Geometrik progressiya (GP):
• Umumiy had: bₙ = b₁ · qⁿ⁻¹
• Yig'indi: Sₙ = b₁·(qⁿ-1)/(q-1), q≠1
• q = bₙ/bₙ₋₁ (ko'rsatkich)

📝 Misol (AP): 2, 5, 8, 11, ...
• d = 5-2 = 3
• a₁₀ = 2 + 9·3 = 29
• S₅ = 5·(2+14)/2 = 40`,
    content_ru: `9-класс математика X глава: арифметическая и геометрическая прогрессии.

📌 Арифметическая прогрессия (АП):
• Общий член: aₙ = a₁ + (n-1)·d
• Сумма: Sₙ = n·(a₁+aₙ)/2
• d = aₙ - aₙ₋₁ (разность)

📌 Геометрическая прогрессия (ГП):
• Общий член: bₙ = b₁ · qⁿ⁻¹
• Сумма: Sₙ = b₁·(qⁿ-1)/(q-1)
• q = bₙ/bₙ₋₁ (знаменатель)`,
    content_en: `9th grade math Ch.X: arithmetic and geometric progressions.

📌 Arithmetic Progression (AP):
• nth term: aₙ = a₁ + (n-1)·d
• Sum: Sₙ = n·(a₁+aₙ)/2
• d — common difference

📌 Geometric Progression (GP):
• nth term: bₙ = b₁ · qⁿ⁻¹
• Sum: Sₙ = b₁·(qⁿ-1)/(q-1)
• q — common ratio`,
    quiz: [
      {
        question_uz: "2, 5, 8, 11, ... progressiyasida 10-had necha?",
        question_ru: "Чему равен 10-й член прогрессии 2, 5, 8, 11, ...?",
        question_en: "What is the 10th term of 2, 5, 8, 11, ...?",
        options_uz: ["27", "29", "31"],
        options_ru: ["27", "29", "31"],
        options_en: ["27", "29", "31"],
        correct_option: 1,
        explanation_uz: "d=3, a₁₀ = 2+(10-1)·3 = 2+27 = 29.",
        explanation_ru: "d=3, a₁₀ = 2+(10-1)·3 = 2+27 = 29.",
        explanation_en: "d=3, a₁₀ = 2+(10-1)·3 = 2+27 = 29.",
      },
      {
        question_uz: "Geometrik progressiyada asos (q) nima?",
        question_ru: "Что такое знаменатель (q) геометрической прогрессии?",
        question_en: "What is the common ratio (q) in a geometric progression?",
        options_uz: ["Hadlar farqi", "Qo'shni hadlar nisbati", "Hadlar yig'indisi"],
        options_ru: ["Разность членов", "Отношение соседних членов", "Сумма членов"],
        options_en: ["Difference of terms", "Ratio of adjacent terms", "Sum of terms"],
        correct_option: 1,
        explanation_uz: "q = bₙ/bₙ₋₁ — geometrik progressiyaning asosi (ko'rsatkichi).",
        explanation_ru: "q = bₙ/bₙ₋₁ — знаменатель геометрической прогрессии.",
        explanation_en: "q = bₙ/bₙ₋₁ — the common ratio of a geometric progression.",
      },
      {
        question_uz: "1, 3, 9, 27 geometrik progressiyasining asosi necha?",
        question_ru: "Чему равен знаменатель геометрической прогрессии 1, 3, 9, 27?",
        question_en: "What is the common ratio of 1, 3, 9, 27?",
        options_uz: ["2", "3", "9"],
        options_ru: ["2", "3", "9"],
        options_en: ["2", "3", "9"],
        correct_option: 1,
        explanation_uz: "q = 3/1 = 3. Har bir had oldingisidan 3 marta katta.",
        explanation_ru: "q = 3/1 = 3. Каждый член в 3 раза больше предыдущего.",
        explanation_en: "q = 3/1 = 3. Each term is 3 times the previous one.",
      },
    ],
  },
  {
    title_uz: "7-dars: XI-XII Bob — Kombinatorika va Ehtimollik",
    title_ru: "Урок 7: XI-XII глава — Комбинаторика и Вероятность",
    title_en: "Lesson 7: Ch.XI-XII — Combinatorics and Probability",
    content_uz: `9-sinf matematika XI-XII bob: kombinatorika elementlari, ehtimollik va statistika.

📌 Kombinatorika:
• n! = 1·2·3·...·n (faktorial)
• Permutatsiyalar: Pₙ = n!
• Joy tanlash: Cₙᵏ = n! / (k!(n-k)!)
• Tartibli tanlov: Aₙᵏ = n! / (n-k)!

📌 Ehtimollik:
• P(A) = m/n (qulay hollar/barcha hollar)
• 0 ≤ P(A) ≤ 1
• Muqarrar hodisa: P = 1
• Imkonsiz hodisa: P = 0

📝 Misol: 6 ta kartadan 2 ta olish usullari soni:
C₆² = 6!/(2!·4!) = 15`,
    content_ru: `9-класс математика XI-XII главы: элементы комбинаторики, вероятность и статистика.

📌 Комбинаторика:
• n! = 1·2·3·...·n (факториал)
• Перестановки: Pₙ = n!
• Сочетания: Cₙᵏ = n! / (k!(n-k)!)
• Размещения: Aₙᵏ = n! / (n-k)!

📌 Вероятность:
• P(A) = m/n (благоприятные/все случаи)
• 0 ≤ P(A) ≤ 1`,
    content_en: `9th grade math Ch.XI-XII: combinatorics, probability and statistics.

📌 Combinatorics:
• n! = 1·2·3·...·n (factorial)
• Permutations: Pₙ = n!
• Combinations: Cₙᵏ = n! / (k!(n-k)!)

📌 Probability:
• P(A) = m/n
• 0 ≤ P(A) ≤ 1`,
    quiz: [
      {
        question_uz: "5! = ?",
        question_ru: "5! = ?",
        question_en: "5! = ?",
        options_uz: ["24", "120", "60"],
        options_ru: ["24", "120", "60"],
        options_en: ["24", "120", "60"],
        correct_option: 1,
        explanation_uz: "5! = 1·2·3·4·5 = 120.",
        explanation_ru: "5! = 1·2·3·4·5 = 120.",
        explanation_en: "5! = 1·2·3·4·5 = 120.",
      },
      {
        question_uz: "Ehtimollik qiymati qaysi oraliqda bo'ladi?",
        question_ru: "В каком диапазоне находится значение вероятности?",
        question_en: "In what range does a probability value fall?",
        options_uz: ["0 dan 100 gacha", "0 dan 1 gacha", "-1 dan 1 gacha"],
        options_ru: ["От 0 до 100", "От 0 до 1", "От -1 до 1"],
        options_en: ["0 to 100", "0 to 1", "-1 to 1"],
        correct_option: 1,
        explanation_uz: "Har qanday hodisaning ehtimolligi 0 ≤ P(A) ≤ 1 oraliqda bo'ladi.",
        explanation_ru: "Вероятность любого события 0 ≤ P(A) ≤ 1.",
        explanation_en: "Any event's probability is 0 ≤ P(A) ≤ 1.",
      },
      {
        question_uz: "C₄² necha? (4 dan 2 ta tanlash usuli)",
        question_ru: "C₄² = ? (число способов выбрать 2 из 4)",
        question_en: "C₄² = ? (number of ways to choose 2 from 4)",
        options_uz: ["4", "6", "12"],
        options_ru: ["4", "6", "12"],
        options_en: ["4", "6", "12"],
        correct_option: 1,
        explanation_uz: "C₄² = 4!/(2!·2!) = 24/(2·2) = 6.",
        explanation_ru: "C₄² = 4!/(2!·2!) = 24/(2·2) = 6.",
        explanation_en: "C₄² = 4!/(2!·2!) = 24/(2·2) = 6.",
      },
    ],
  },
  {
    title_uz: "8-dars: XIII-XIV Bob — Burchak, Yuza, Perimetr",
    title_ru: "Урок 8: XIII-XIV глава — Угол, Площадь, Периметр",
    title_en: "Lesson 8: Ch.XIII-XIV — Angle, Area, Perimeter",
    content_uz: `9-sinf matematika XIII-XIV bob: burchak, yuza va perimetrni topish.

📌 Uchburchak:
• Perimetr: P = a + b + c
• Yuza: S = ½·a·h (asos·balandlik)
• Yuza: S = ½·ab·sinC

📌 To'rtburchak:
• Kvadrat: P=4a, S=a²
• To'g'ri to'rtburchak: P=2(a+b), S=a·b
• Romb: S = ½·d₁·d₂ (diagonallar)
• Trapeziya: S = ½·(a+b)·h

📌 Aylana:
• Uzunligi: l = 2πr
• Yuza: S = πr²

💡 π ≈ 3.14 yoki 22/7`,
    content_ru: `9-класс математика XIII-XIV главы: нахождение угла, площади и периметра.

📌 Треугольник:
• Периметр: P = a + b + c
• Площадь: S = ½·a·h
• Площадь: S = ½·ab·sinC

📌 Четырёхугольник:
• Квадрат: P=4a, S=a²
• Прямоугольник: P=2(a+b), S=a·b
• Ромб: S = ½·d₁·d₂
• Трапеция: S = ½·(a+b)·h

📌 Круг: l = 2πr, S = πr²`,
    content_en: `9th grade math Ch.XIII-XIV: finding angle, area, perimeter.

📌 Triangle: P = a+b+c, S = ½·a·h
📌 Rectangle: P = 2(a+b), S = a·b
📌 Circle: l = 2πr, S = πr²`,
    quiz: [
      {
        question_uz: "Radiusi 7 sm bo'lgan aylananing yuzi qancha? (π≈22/7)",
        question_ru: "Чему равна площадь круга с радиусом 7 см? (π≈22/7)",
        question_en: "What is the area of a circle with radius 7 cm? (π≈22/7)",
        options_uz: ["44 sm²", "154 sm²", "49 sm²"],
        options_ru: ["44 см²", "154 см²", "49 см²"],
        options_en: ["44 cm²", "154 cm²", "49 cm²"],
        correct_option: 1,
        explanation_uz: "S = πr² = (22/7)·49 = 22·7 = 154 sm².",
        explanation_ru: "S = πr² = (22/7)·49 = 22·7 = 154 см².",
        explanation_en: "S = πr² = (22/7)·49 = 22·7 = 154 cm².",
      },
      {
        question_uz: "To'g'ri burchakli uchburchakda gipotenuz nimaga teng?",
        question_ru: "Чему равна гипотенуза в прямоугольном треугольнике?",
        question_en: "What is the hypotenuse in a right triangle?",
        options_uz: ["a+b", "√(a²+b²)", "a·b/2"],
        options_ru: ["a+b", "√(a²+b²)", "a·b/2"],
        options_en: ["a+b", "√(a²+b²)", "a·b/2"],
        correct_option: 1,
        explanation_uz: "Pifagor teoremasi: c² = a²+b², demak c = √(a²+b²).",
        explanation_ru: "Теорема Пифагора: c² = a²+b², значит c = √(a²+b²).",
        explanation_en: "Pythagorean theorem: c² = a²+b², so c = √(a²+b²).",
      },
      {
        question_uz: "Trapeziyaning yuzini hisoblash formulasi?",
        question_ru: "Формула площади трапеции?",
        question_en: "Formula for trapezoid area?",
        options_uz: ["a·b", "(a+b)·h", "½·(a+b)·h"],
        options_ru: ["a·b", "(a+b)·h", "½·(a+b)·h"],
        options_en: ["a·b", "(a+b)·h", "½·(a+b)·h"],
        correct_option: 2,
        explanation_uz: "Trapeziya yuzi: S = ½·(a+b)·h, bu yerda a, b — asoslar, h — balandlik.",
        explanation_ru: "Площадь трапеции: S = ½·(a+b)·h, где a, b — основания, h — высота.",
        explanation_en: "Trapezoid area: S = ½·(a+b)·h, where a, b are bases and h is height.",
      },
    ],
  },
  {
    title_uz: "9-dars: XV-XVI Bob — Pifagor va Trigonometrik funksiyalar",
    title_ru: "Урок 9: XV-XVI глава — Пифагор и Тригонометрические функции",
    title_en: "Lesson 9: Ch.XV-XVI — Pythagorean and Trig Functions",
    content_uz: `9-sinf matematika XV-XVI bob: Pifagor teoremasi, trigonometrik funksiyalar, uchburchak va to'rtburchak.

📌 Pifagor teoremasi:
c² = a² + b² (to'g'ri burchakli uchburchakda)

📌 Uchburchakda trigonometriya:
• sinA = a/c (qarama-qarshi/gipotenuz)
• cosA = b/c (yonma-yon/gipotenuz)
• tgA = a/b (qarama-qarshi/yonma-yon)

📌 Ko'sinuslar teoremasi:
c² = a² + b² - 2ab·cosC

📌 Sinuslar teoremasi:
a/sinA = b/sinB = c/sinC = 2R

💡 Uchburchak burchaklari yig'indisi = 180°`,
    content_ru: `9-класс математика XV-XVI главы: теорема Пифагора, тригонометрические функции.

📌 Теорема Пифагора: c² = a² + b²

📌 Тригонометрия в треугольнике:
• sinA = a/c, cosA = b/c, tgA = a/b

📌 Теорема косинусов: c² = a²+b²-2ab·cosC
📌 Теорема синусов: a/sinA = b/sinB = c/sinC = 2R`,
    content_en: `9th grade math Ch.XV-XVI: Pythagorean theorem, trig functions.

📌 Pythagorean: c² = a²+b²
📌 sinA = a/c, cosA = b/c, tgA = a/b
📌 Law of cosines: c² = a²+b²-2ab·cosC
📌 Law of sines: a/sinA = b/sinB = c/sinC = 2R`,
    quiz: [
      {
        question_uz: "To'g'ri burchakli uchburchakda katetlar 3 va 4 sm. Gipotenuz necha?",
        question_ru: "В прямоугольном треугольнике катеты 3 и 4 см. Чему равна гипотенуза?",
        question_en: "In a right triangle with legs 3 and 4 cm, find the hypotenuse.",
        options_uz: ["6 sm", "5 sm", "7 sm"],
        options_ru: ["6 см", "5 см", "7 см"],
        options_en: ["6 cm", "5 cm", "7 cm"],
        correct_option: 1,
        explanation_uz: "c = √(3²+4²) = √(9+16) = √25 = 5 sm. (3-4-5 to'g'ri burchakli uchburchak!)",
        explanation_ru: "c = √(3²+4²) = √(9+16) = √25 = 5 см. (Египетский треугольник!)",
        explanation_en: "c = √(3²+4²) = √(9+16) = √25 = 5 cm. (3-4-5 right triangle!)",
      },
      {
        question_uz: "Sinuslar teoremasi formulasi qaysi?",
        question_ru: "Какова формула теоремы синусов?",
        question_en: "What is the law of sines formula?",
        options_uz: ["a/cosA = b/cosB", "a/sinA = b/sinB = c/sinC", "a² = b²+c²-2bc·cosA"],
        options_ru: ["a/cosA = b/cosB", "a/sinA = b/sinB = c/sinC", "a² = b²+c²-2bc·cosA"],
        options_en: ["a/cosA = b/cosB", "a/sinA = b/sinB = c/sinC", "a² = b²+c²-2bc·cosA"],
        correct_option: 1,
        explanation_uz: "Sinuslar teoremasi: a/sinA = b/sinB = c/sinC = 2R.",
        explanation_ru: "Теорема синусов: a/sinA = b/sinB = c/sinC = 2R.",
        explanation_en: "Law of sines: a/sinA = b/sinB = c/sinC = 2R.",
      },
      {
        question_uz: "Har qanday uchburchak burchaklari yig'indisi necha gradus?",
        question_ru: "Сколько градусов составляет сумма углов любого треугольника?",
        question_en: "What is the sum of angles in any triangle?",
        options_uz: ["90°", "180°", "360°"],
        options_ru: ["90°", "180°", "360°"],
        options_en: ["90°", "180°", "360°"],
        correct_option: 1,
        explanation_uz: "Har qanday uchburchakda A+B+C = 180°.",
        explanation_ru: "В любом треугольнике A+B+C = 180°.",
        explanation_en: "In any triangle A+B+C = 180°.",
      },
    ],
  },
  {
    title_uz: "10-dars: Ko'rsatkichli Tenglamalar",
    title_ru: "Урок 10: Показательные уравнения",
    title_en: "Lesson 10: Exponential Equations",
    content_uz: `Ko'rsatkichli tenglamalar — IDC II matematika to'plami.

📌 Ko'rsatkichli tenglama — aˣ = b ko'rinishdagi tenglama.

📌 Yechish usullari:

1️⃣ Asoslarni tenglash usuli:
   aᵐ = aⁿ → m = n (a>0, a≠1)
   
   Misol: 2ˣ = 8 → 2ˣ = 2³ → x = 3

2️⃣ O'rniga qo'yish usuli (t = aˣ):
   Misol: 4ˣ - 2·2ˣ - 8 = 0
   t = 2ˣ deb, t² - 2t - 8 = 0
   (t-4)(t+2) = 0 → t = 4 → 2ˣ = 4 → x = 2

📌 Ko'rsatkichli tengsizlik:
• a > 1 bo'lsa: aˣ > aʸ → x > y
• 0 < a < 1 bo'lsa: aˣ > aʸ → x < y (teskari!)

🎯 Bu kurs yakuni! Sertifikat olishga tayyorsiz!`,
    content_ru: `Показательные уравнения — сборник IDC II.

📌 Методы решения:

1️⃣ Уравнивание оснований:
   aᵐ = aⁿ → m = n (a>0, a≠1)
   Пример: 2ˣ = 8 → x = 3

2️⃣ Метод замены (t = aˣ):
   4ˣ - 2·2ˣ - 8 = 0, t=2ˣ
   t² - 2t - 8 = 0 → t=4 → x=2

📌 Показательное неравенство:
• a > 1: aˣ > aʸ → x > y
• 0<a<1: aˣ > aʸ → x < y (обратное!)

🎯 Это финал курса! Готовьтесь к сертификату!`,
    content_en: `Exponential equations — IDC II math collection.

📌 Solution methods:

1️⃣ Equating bases: aᵐ = aⁿ → m = n
   Example: 2ˣ = 8 → x = 3

2️⃣ Substitution (t = aˣ):
   t² - 2t - 8 = 0 → x = 2

📌 Exponential inequality:
• a > 1: aˣ > aʸ → x > y
• 0<a<1: aˣ > aʸ → x < y (reversed!)

🎯 Course finale! Certificate awaits!`,
    quiz: [
      {
        question_uz: "2ˣ = 32 tenglamasini yeching.",
        question_ru: "Решите уравнение 2ˣ = 32.",
        question_en: "Solve the equation 2ˣ = 32.",
        options_uz: ["x = 4", "x = 5", "x = 6"],
        options_ru: ["x = 4", "x = 5", "x = 6"],
        options_en: ["x = 4", "x = 5", "x = 6"],
        correct_option: 1,
        explanation_uz: "2ˣ = 32 = 2⁵ → x = 5.",
        explanation_ru: "2ˣ = 32 = 2⁵ → x = 5.",
        explanation_en: "2ˣ = 32 = 2⁵ → x = 5.",
      },
      {
        question_uz: "3ˣ > 3⁵ tengsizligining yechimi qaysi?",
        question_ru: "Каково решение неравенства 3ˣ > 3⁵?",
        question_en: "What is the solution of 3ˣ > 3⁵?",
        options_uz: ["x < 5", "x > 5", "x = 5"],
        options_ru: ["x < 5", "x > 5", "x = 5"],
        options_en: ["x < 5", "x > 5", "x = 5"],
        correct_option: 1,
        explanation_uz: "a=3>1 bo'lgani uchun: 3ˣ > 3⁵ → x > 5.",
        explanation_ru: "Так как a=3>1: 3ˣ > 3⁵ → x > 5.",
        explanation_en: "Since a=3>1: 3ˣ > 3⁵ → x > 5.",
      },
      {
        question_uz: "O'rniga qo'yish usulida 4ˣ - 3·2ˣ - 4 = 0 tenglamasi uchun qaysi almashtirish to'g'ri?",
        question_ru: "Какая замена верна для уравнения 4ˣ - 3·2ˣ - 4 = 0 методом подстановки?",
        question_en: "What substitution solves 4ˣ - 3·2ˣ - 4 = 0?",
        options_uz: ["t = 4ˣ", "t = 2ˣ", "t = xˣ"],
        options_ru: ["t = 4ˣ", "t = 2ˣ", "t = xˣ"],
        options_en: ["t = 4ˣ", "t = 2ˣ", "t = xˣ"],
        correct_option: 1,
        explanation_uz: "t = 2ˣ deb olamiz, chunki 4ˣ = (2²)ˣ = (2ˣ)² = t². Natija: t²-3t-4=0.",
        explanation_ru: "Берём t = 2ˣ, так как 4ˣ = (2ˣ)² = t². Получаем: t²-3t-4=0.",
        explanation_en: "Let t = 2ˣ since 4ˣ = (2ˣ)² = t². Result: t²-3t-4=0.",
      },
    ],
  },
];

async function addMathCourse() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('Connected to database...');

    // 1. Create the math course (delete old if exists, then insert fresh)
    await client.query(`
      DELETE FROM quiz_questions WHERE lesson_id IN (
        SELECT l.id FROM lessons l
        JOIN courses c ON l.course_id = c.id
        WHERE c.title_uz = '9-sinf Matematika (Salomov Furqat)'
      )
    `);
    await client.query(`
      DELETE FROM lessons WHERE course_id IN (
        SELECT id FROM courses WHERE title_uz = '9-sinf Matematika (Salomov Furqat)'
      )
    `);
    await client.query(`DELETE FROM courses WHERE title_uz = '9-sinf Matematika (Salomov Furqat)'`);

    const courseRes = await client.query(`
      INSERT INTO courses (
        title_uz, title_ru, title_en,
        description_uz, description_ru, description_en,
        is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING id
    `, [
      "9-sinf Matematika (Salomov Furqat)",
      "Математика 9 класс (Саломов Фурқат)",
      "9th Grade Math (Salomov Furqat)",
      "Bu kurs Salomov Furqat (Math F) tomonidan tayyorlangan 9-sinf matematika darslari to'plamidir. Har bir dars imtihon savollarini yechishga qaratilgan. Pifagor teoremasi, trigonometriya, progressiyalar, ehtimollik va boshqa muhim mavzularni o'rganing. Barcha darslarni tugatganingizdan so'ng sertifikat olasiz!",
      "Сборник уроков математики для 9 класса от Саломова Фурқата (Math F). Каждый урок направлен на решение экзаменационных вопросов. Изучите теорему Пифагора, тригонометрию, прогрессии, вероятность и другие важные темы. После завершения всех уроков вы получите сертификат!",
      "A 9th grade math lesson collection by Salomov Furqat (Math F). Each lesson focuses on solving exam questions. Learn Pythagorean theorem, trigonometry, progressions, probability and more. Complete all lessons to earn a certificate!",
    ]);

    const courseId = courseRes.rows[0].id;
    console.log(`Math course created/updated with ID: ${courseId}`);

    // 2. Delete existing lessons for this course
    await client.query(`DELETE FROM quiz_questions WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id = $1)`, [courseId]);
    await client.query(`DELETE FROM lessons WHERE course_id = $1`, [courseId]);
    console.log('Old lessons cleared.');

    // 3. Create lessons with video + content + quiz
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const video = videos[i];

      const lessonRes = await client.query(`
        INSERT INTO lessons (
          course_id, title_uz, title_ru, title_en,
          content_uz, content_ru, content_en,
          video_url, order_index, is_published, duration_minutes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10)
        RETURNING id
      `, [
        courseId,
        lesson.title_uz, lesson.title_ru, lesson.title_en,
        lesson.content_uz, lesson.content_ru, lesson.content_en,
        `https://www.youtube.com/watch?v=${video.id}`,
        i + 1,
        video.duration
      ]);

      const lessonId = lessonRes.rows[0].id;
      console.log(`  Created lesson ${i+1}: ${lesson.title_uz}`);

      // 4. Add quiz questions
      for (let j = 0; j < lesson.quiz.length; j++) {
        const q = lesson.quiz[j];
        await client.query(`
          INSERT INTO quiz_questions (
            lesson_id, question_uz, question_ru, question_en,
            options_uz, options_ru, options_en,
            correct_option,
            explanation_uz, explanation_ru, explanation_en,
            order_index
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        `, [
          lessonId,
          q.question_uz, q.question_ru, q.question_en,
          JSON.stringify(q.options_uz), JSON.stringify(q.options_ru), JSON.stringify(q.options_en),
          q.correct_option,
          q.explanation_uz, q.explanation_ru, q.explanation_en,
          j + 1
        ]);
      }
      console.log(`    -> ${lesson.quiz.length} quiz savol qo'shildi`);
    }

    console.log('\n✅ Matematika kursi muvaffaqiyatli qo\'shildi!');
    console.log(`Course ID: ${courseId}`);
    console.log(`10 ta dars, har birida 3 ta quiz savol — jami 30 ta savol!`);

  } catch (err) {
    console.error('Xato:', err.message);
  } finally {
    await client.end();
  }
}

addMathCourse();
