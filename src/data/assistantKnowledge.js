/**
 * Knowledge base behind the AI yordamchi.
 *
 * Answers are built from the same GUIDE_DATA the Yo'riqnoma screen shows, so
 * page counts, margins and originality percentages can never drift out of sync
 * with the rest of the app, and they arrive already translated.
 *
 * The chat renders plain text, so no markdown here -- asterisks would show up
 * literally as asterisks.
 */

import { getGuideData } from '../i18n/guideDataI18n';

/** Uzbek Latin is typed with several different apostrophes; treat them as one. */
const APOSTROPHES = /['‘’ʻʼ`´]/g;

export function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(APOSTROPHES, "'")
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Which kind of work the student is asking about. Defaults to BMI. */
const WORK_TYPES = [
  { key: 'dissertatsiya', words: ['dissertatsiya', 'dissertatsiyada', 'magistr', 'magistrlik', 'диссертац', 'магистер', 'магистр', 'dissertation', 'master'] },
  { key: 'kurs', words: ['kurs ishi', 'kurs ishida', 'kurs', 'курсов', 'coursework', 'course work', 'term paper'] },
  { key: 'bm', words: ['bmi', 'bm', 'bitiruv', 'malakaviy', 'вкр', 'выпускн', 'thesis', 'graduation', 'diplom'] },
];

function detectType(q) {
  for (const t of WORK_TYPES) {
    if (t.words.some((w) => q.includes(w))) return { key: t.key, explicit: true };
  }
  return { key: 'bm', explicit: false };
}

/** Pull a single requirement line, e.g. the originality percentage. */
function findRequirement(data, re) {
  return (data.requirements || []).find((r) => re.test(r)) || null;
}

const L = {
  uz: {
    seeGuide: (t) => `\n\n📖 Batafsil: Yo'riqnoma → ${t}`,
    typeNote: "\n\nℹ️ Bu javob BMI uchun. Kurs ishi va dissertatsiya talablari farq qiladi — savolingizda ish turini yozsangiz, aniqroq javob beraman.",
    askSupervisor: "\n\n⚠️ Talablar oliygohlar bo'yicha farq qilishi mumkin — yakuniy qarorda ilmiy rahbaringiz va kafedra talablariga tayaning.",
    noMatch: "🤖 Savolingizni to'liq tushunmadim.\n\nMen quyidagi mavzularda yordam bera olaman:",
    noMatchTail: "\n\nSavolni boshqacharoq yozib ko'ring, yoki yuqoridagi tayyor savollardan birini bosing.",
    sections: 'Tuzilmasi',
    requirements: 'Rasmiylashtirish talablari',
    intro: 'Kirish qismi',
    contents: 'Mundarija',
    tips: 'Maslahatlar',
  },
  ru: {
    seeGuide: (t) => `\n\n📖 Подробнее: Руководство → ${t}`,
    typeNote: '\n\nℹ️ Этот ответ для ВКР. Требования к курсовой и диссертации отличаются — укажите вид работы в вопросе, и я отвечу точнее.',
    askSupervisor: '\n\n⚠️ Требования могут отличаться по вузам — окончательно сверяйтесь с научным руководителем и кафедрой.',
    noMatch: '🤖 Я не совсем понял вопрос.\n\nМогу помочь по этим темам:',
    noMatchTail: '\n\nПопробуйте переформулировать вопрос или нажмите одну из готовых подсказок выше.',
    sections: 'Структура',
    requirements: 'Требования к оформлению',
    intro: 'Введение',
    contents: 'Содержание',
    tips: 'Советы',
  },
  en: {
    seeGuide: (t) => `\n\n📖 More detail: Guide → ${t}`,
    typeNote: '\n\nℹ️ This answer is for the BMI thesis. Coursework and dissertation requirements differ — name the type of work in your question for a more precise answer.',
    askSupervisor: '\n\n⚠️ Requirements vary between universities — confirm the final rules with your supervisor and department.',
    noMatch: "🤖 I didn't quite understand the question.\n\nI can help with these topics:",
    noMatchTail: '\n\nTry rephrasing, or tap one of the suggested questions above.',
    sections: 'Structure',
    requirements: 'Formatting requirements',
    intro: 'Introduction',
    contents: 'Table of contents',
    tips: 'Tips',
  },
};

const bullets = (lines) => lines.map((l) => `• ${l}`).join('\n');
const numbered = (lines) => lines.map((l, i) => `${i + 1}. ${l}`).join('\n');

/**
 * Topics are scored against the question. `keywords` holds every language's
 * terms together -- a student may type Uzbek words while the UI is in Russian.
 */
const TOPICS = [
  {
    id: 'intro',
    label: { uz: 'Kirish qismini yozish', ru: 'Написание введения', en: 'Writing the introduction' },
    keywords: ['kirish', 'kirishni', 'kirish qismi', 'introduction', 'intro', 'введение', 'вступление'],
    build: (d, lang) => {
      const t = L[lang];
      const head = `📝 ${t.intro} — ${d.title}\n`;
      const body = (d.kirish || []).map((k) => `• ${k.label}\n   ${k.text}`).join('\n\n');
      return head + '\n' + body + t.seeGuide(d.title);
    },
  },
  {
    id: 'object_subject',
    label: { uz: "Ob'ekt va predmet farqi", ru: 'Объект и предмет', en: 'Object vs subject' },
    keywords: ["ob'ekt", 'obekt', 'obyekt', 'predmet', 'объект', 'предмет', 'object', 'subject'],
    build: (d, lang) => {
      const t = L[lang];
      const wanted = /ob'?[ye]kt|объект|object|predmet|предмет|subject/i;
      const parts = (d.kirish || []).filter((k) => wanted.test(k.label));
      if (!parts.length) return null;
      return `🎯 ${parts.map((p) => `${p.label}\n   ${p.text}`).join('\n\n')}` + t.seeGuide(d.title);
    },
  },
  {
    id: 'aim_tasks',
    label: { uz: 'Maqsad va vazifalar', ru: 'Цель и задачи', en: 'Aim and objectives' },
    keywords: ['maqsad', 'vazifa', 'vazifalar', 'цель', 'задачи', 'задача', 'aim', 'objective', 'goal'],
    build: (d, lang) => {
      const t = L[lang];
      const wanted = /maqsad|vazifa|цель|задач|aim|objective|goal/i;
      const parts = (d.kirish || []).filter((k) => wanted.test(k.label));
      if (!parts.length) return null;
      return `🎯 ${parts.map((p) => `${p.label}\n   ${p.text}`).join('\n\n')}` + t.seeGuide(d.title);
    },
  },
  {
    id: 'methods',
    label: { uz: 'Tadqiqot metodlari', ru: 'Методы исследования', en: 'Research methods' },
    keywords: ['metod', 'metodlar', 'metodika', 'usul', 'метод', 'методы', 'методика', 'method', 'methodology'],
    build: (d, lang) => {
      const t = L[lang];
      const part = (d.kirish || []).find((k) => /metod|метод|method/i.test(k.label));
      if (!part) return null;
      return `🔬 ${part.label}\n\n${part.text}` + t.seeGuide(d.title);
    },
  },
  {
    id: 'structure',
    label: { uz: 'Ish tuzilmasi', ru: 'Структура работы', en: 'Structure of the work' },
    keywords: ['tuzilma', 'tuzilish', 'struktura', 'bob', 'boblar', 'qism', 'структура', 'главы', 'глава', 'structure', 'chapters', 'chapter', 'sections'],
    build: (d, lang) => {
      const t = L[lang];
      const items = (d.structure || []).map((s) => s.title);
      if (!items.length) return null;
      return `🗂 ${t.sections} — ${d.title}\n\n${numbered(items)}` + t.seeGuide(d.title);
    },
  },
  {
    id: 'contents',
    label: { uz: 'Mundarija namunasi', ru: 'Образец содержания', en: 'Table of contents template' },
    keywords: ['mundarija', 'reja', 'содержание', 'оглавление', 'contents', 'table of contents'],
    build: (d, lang) => {
      const t = L[lang];
      const items = (d.mundarija || []).map((m) => (m.indent ? `    ${m.label}` : m.label));
      if (!items.length) return null;
      return `📑 ${t.contents} — ${d.title}\n\n${items.join('\n')}` + t.seeGuide(d.title);
    },
  },
  {
    id: 'requirements',
    label: { uz: 'Rasmiylashtirish talablari', ru: 'Требования к оформлению', en: 'Formatting requirements' },
    keywords: ['talab', 'talablar', 'rasmiylash', 'shrift', 'interval', 'hajm', 'necha bet', 'nechta bet', 'sahifa', 'chegara', 'format', 'oformlen', 'требован', 'шрифт', 'интервал', 'объем', 'страниц', 'поля', 'formatting', 'font', 'margins', 'pages', 'length', 'spacing'],
    build: (d, lang, explicitType) => {
      const t = L[lang];
      const items = d.requirements || [];
      if (!items.length) return null;
      return `📐 ${t.requirements} — ${d.title}\n\n${bullets(items)}` +
        (explicitType ? '' : t.typeNote) + t.askSupervisor;
    },
  },
  {
    id: 'plagiarism',
    label: { uz: 'Plagiatni kamaytirish', ru: 'Снижение плагиата', en: 'Reducing plagiarism' },
    keywords: ['plagiat', 'plagiarizm', 'original', 'originallik', 'antiplagiat', 'oxirlik', 'плагиат', 'оригинальн', 'антиплагиат', 'plagiarism', 'originality', 'turnitin'],
    build: (d, lang) => {
      const t = L[lang];
      const req = findRequirement(d, /plagiat|плагиат|original/i);
      const how = {
        uz: [
          "Parafrazlash — g'oyani o'z so'zlaringiz bilan, o'z jumla tuzilishingizda qayta yozing.",
          "To'g'ri iqtibos — har bir o'zlashtirilgan fikrga manba ko'rsating (muallif, yil, bet).",
          'Sintez — bitta manbani ko\'chirmang; bir nechta manbani solishtiring va umumlashtiring.',
          "O'z tahlilingiz — har bir iqtibosdan keyin o'z xulosangizni qo'shing.",
          'Antiplagiat.uz — topshirishdan oldin o\'zingiz tekshirib ko\'ring.',
        ],
        ru: [
          'Парафраз — перескажите мысль своими словами и своей структурой предложения.',
          'Корректная цитата — указывайте источник для каждой заимствованной мысли (автор, год, страница).',
          'Синтез — не копируйте один источник; сравнивайте и обобщайте несколько.',
          'Свой анализ — после каждой цитаты добавляйте собственный вывод.',
          'Antiplagiat.uz — проверьте работу сами перед сдачей.',
        ],
        en: [
          'Paraphrase — restate the idea in your own words and your own sentence structure.',
          'Cite properly — give a source for every borrowed idea (author, year, page).',
          'Synthesise — do not copy one source; compare and combine several.',
          'Add your own analysis — follow each quotation with your own conclusion.',
          'Antiplagiat.uz — check the work yourself before submitting.',
        ],
      }[lang];
      const reqLine = req ? `\n\n📊 ${d.title}: ${req}` : '';
      return `🛡 ${TOPICS.find((x) => x.id === 'plagiarism').label[lang]}\n\n${numbered(how)}${reqLine}` + t.askSupervisor;
    },
  },
  {
    id: 'references',
    label: { uz: "Adabiyotlar ro'yxati", ru: 'Список литературы', en: 'Reference list' },
    keywords: ['adabiyot', 'adabiyotlar', 'manba', 'manbalar', "ro'yxat", 'bibliografiya', 'iqtibos', 'literatura', 'литератур', 'источник', 'библиограф', 'ссылк', 'references', 'bibliography', 'citation', 'sources'],
    build: (d, lang) => {
      const t = L[lang];
      const req = findRequirement(d, /manba|источник|source/i);
      const how = {
        uz: [
          'Manbalarni alifbo tartibida joylashtiring.',
          "Har bir manba: muallif, ishning nomi, nashr joyi, nashriyot, yil, sahifa.",
          "Matn ichida havola bering — masalan [12] yoki (Karimov, 2023).",
          "Internet manbalari uchun havola va murojaat sanasini yozing.",
          "Ro'yxatdagi har bir manba matnda kamida bir marta ishlatilgan bo'lishi shart.",
        ],
        ru: [
          'Расположите источники в алфавитном порядке.',
          'Каждый источник: автор, название, место издания, издательство, год, страницы.',
          'Давайте ссылку в тексте — например [12] или (Каримов, 2023).',
          'Для интернет-источников укажите ссылку и дату обращения.',
          'Каждый источник из списка должен хотя бы раз встречаться в тексте.',
        ],
        en: [
          'List sources in alphabetical order.',
          'Each entry: author, title, place of publication, publisher, year, pages.',
          'Cite in the text — for example [12] or (Karimov, 2023).',
          'For web sources give the link and the date you accessed it.',
          'Every source in the list must appear at least once in the text.',
        ],
      }[lang];
      const reqLine = req ? `\n\n📊 ${d.title}: ${req}` : '';
      return `📚 ${TOPICS.find((x) => x.id === 'references').label[lang]}\n\n${numbered(how)}${reqLine}` + t.askSupervisor;
    },
  },
  {
    id: 'topic_choice',
    label: { uz: 'Mavzu tanlash', ru: 'Выбор темы', en: 'Choosing a topic' },
    keywords: ['mavzu', 'mavzuni', 'mavzu tanlash', 'tema', 'тема', 'темы', 'выбор темы', 'topic', 'choose a topic', 'subject area'],
    build: (d, lang) => {
      const t = L[lang];
      const how = {
        uz: [
          "Mutaxassisligingizga mos va sizni qiziqtiradigan sohani tanlang — oylar davomida shu bilan ishlaysiz.",
          "Mavzu juda keng bo'lmasin: 'Ta'lim sifati' emas, 'Boshlang'ich sinfda o'qish savodxonligini oshirish usullari'.",
          "Manba bormi? Google Scholar va e-Library.uz da qidirib ko'ring — 10 ta manba topilmasa, mavzu torroq yoki boshqa bo'lsin.",
          "Ma'lumot yig'a olasizmi? So'rovnoma yoki tajriba o'tkazish imkoni borligiga ishonch hosil qiling.",
          "Ilmiy rahbaringiz bilan kelishib oling — u sohaning dolzarb muammolarini biladi.",
        ],
        ru: [
          'Выберите область по специальности, которая вам интересна — вы проработаете с ней месяцы.',
          "Тема не должна быть слишком широкой: не «Качество образования», а «Способы повышения грамотности чтения в начальной школе».",
          'Есть ли источники? Поищите в Google Scholar и e-Library.uz — если не находится 10 источников, сузьте или смените тему.',
          'Сможете ли собрать данные? Убедитесь, что опрос или эксперимент реально провести.',
          'Согласуйте с научным руководителем — он знает актуальные проблемы области.',
        ],
        en: [
          'Pick an area within your specialism that genuinely interests you — you will live with it for months.',
          'Keep it narrow: not "Quality of education" but "Methods for improving reading literacy in primary school".',
          'Are there sources? Search Google Scholar and e-Library.uz — if you cannot find 10, narrow or change the topic.',
          'Can you gather data? Make sure a survey or experiment is actually feasible.',
          'Agree it with your supervisor — they know the live problems in the field.',
        ],
      }[lang];
      return `💡 ${TOPICS.find((x) => x.id === 'topic_choice').label[lang]}\n\n${numbered(how)}` + t.seeGuide(d.title);
    },
  },
  {
    id: 'style',
    label: { uz: 'Ilmiy uslub', ru: 'Научный стиль', en: 'Academic writing style' },
    keywords: ['uslub', 'ilmiy uslub', 'yozish uslubi', 'til', 'стиль', 'научный стиль', 'язык', 'style', 'academic style', 'tone', 'writing style'],
    build: (d, lang) => {
      const t = L[lang];
      const how = {
        uz: [
          "Birinchi shaxsdan yozmang: 'men o'yladim' emas, 'tahlil natijalari ko'rsatadiki'.",
          "Hissiyotli va baholovchi so'zlardan saqlaning ('juda ajoyib', 'dahshatli').",
          "Har bir da'voni manba yoki o'z ma'lumotingiz bilan asoslang.",
          "Atamalarni birinchi marta ishlatganda izohlang va keyin bir xil ishlating.",
          "Qisqa va aniq gaplar tuzing — bir gapda bitta fikr.",
        ],
        ru: [
          'Не пишите от первого лица: не «я подумал», а «результаты анализа показывают».',
          'Избегайте эмоциональных и оценочных слов («потрясающе», «ужасно»).',
          'Обосновывайте каждое утверждение источником или своими данными.',
          'Поясните термин при первом употреблении и далее используйте одинаково.',
          'Пишите короткими точными предложениями — одна мысль на предложение.',
        ],
        en: [
          'Avoid the first person: not "I thought" but "the analysis shows".',
          'Avoid emotional or evaluative wording ("amazing", "terrible").',
          'Support every claim with a source or with your own data.',
          'Define each term on first use, then use it consistently.',
          'Write short, precise sentences — one idea per sentence.',
        ],
      }[lang];
      return `✍️ ${TOPICS.find((x) => x.id === 'style').label[lang]}\n\n${numbered(how)}`;
    },
  },
  {
    id: 'search',
    label: { uz: 'Manba qidirish', ru: 'Поиск источников', en: 'Finding sources' },
    keywords: ['qidir', 'qidirish', 'topish', 'google scholar', 'scholar', 'scopus', 'kutubxona', 'baza', 'искать', 'поиск', 'найти', 'библиотек', 'search', 'find sources', 'database', 'library'],
    build: (d, lang) => {
      const how = {
        uz: [
          'Google Scholar — eng keng bepul ilmiy qidiruv (scholar.google.com).',
          "e-Library.uz va ZiyoNet — o'zbek tilidagi manbalar.",
          'Scopus va Web of Science — xalqaro indekslangan jurnallar.',
          "Kalit so'zlarni ingliz tilida ham sinab ko'ring — natija bir necha barobar ko'payadi.",
          "Topilgan maqolaning oxiridagi adabiyotlar ro'yxati — yangi manbalarning eng yaxshi manbasi.",
        ],
        ru: [
          'Google Scholar — самый широкий бесплатный научный поиск (scholar.google.com).',
          'e-Library.uz и ZiyoNet — источники на узбекском языке.',
          'Scopus и Web of Science — международные индексируемые журналы.',
          'Пробуйте ключевые слова и на английском — результатов станет в разы больше.',
          'Список литературы в конце найденной статьи — лучший источник новых источников.',
        ],
        en: [
          'Google Scholar — the broadest free academic search (scholar.google.com).',
          'e-Library.uz and ZiyoNet — Uzbek-language sources.',
          'Scopus and Web of Science — internationally indexed journals.',
          'Try your keywords in English too — it multiplies the results.',
          "The reference list at the end of a good paper is the best source of further sources.",
        ],
      }[lang];
      const pointer = { uz: "\n\n🌐 Batafsil: Saytlar bo'limi", ru: '\n\n🌐 Подробнее: раздел «Сайты»', en: '\n\n🌐 More: the Sites section' }[lang];
      return `🔎 ${TOPICS.find((x) => x.id === 'search').label[lang]}\n\n${numbered(how)}${pointer}`;
    },
  },
  {
    id: 'tips',
    label: { uz: 'Umumiy maslahatlar', ru: 'Общие советы', en: 'General tips' },
    keywords: ['maslahat', 'maslahatlar', 'tavsiya', 'yordam ber', 'nima qilay', 'совет', 'советы', 'рекоменд', 'tip', 'tips', 'advice', 'help me'],
    build: (d, lang) => {
      const t = L[lang];
      const items = d.tips || [];
      if (!items.length) return null;
      return `💡 ${t.tips} — ${d.title}\n\n${items.join('\n')}` + t.seeGuide(d.title);
    },
  },
  {
    id: 'defense',
    label: { uz: 'Himoya va prezentatsiya', ru: 'Защита и презентация', en: 'Defence and presentation' },
    keywords: ['himoya', 'himoyaga', 'taqdimot', 'prezentatsiya', 'slayd', 'защит', 'презентац', 'слайд', 'defence', 'defense', 'presentation', 'slides', 'viva'],
    build: (d, lang) => {
      const how = {
        uz: [
          "Taqdimot 15–20 slayd: mavzu, dolzarblik, maqsad, metodlar, natijalar, xulosa.",
          "Chiqish vaqti odatda 7–10 daqiqa — uyda soat bilan mashq qiling.",
          "Har bir slaydda ko'p matn bo'lmasin: sarlavha va 3–5 qisqa punkt yetarli.",
          "Natijalarni jadval va diagramma bilan ko'rsating — matn bilan emas.",
          "Kutilayotgan savollarga oldindan javob tayyorlang (metod tanlovi, tanlanma hajmi, cheklovlar).",
        ],
        ru: [
          'Презентация на 15–20 слайдов: тема, актуальность, цель, методы, результаты, вывод.',
          'Выступление обычно 7–10 минут — репетируйте дома с часами.',
          'Не перегружайте слайд текстом: заголовок и 3–5 коротких пунктов.',
          'Показывайте результаты таблицами и диаграммами, а не текстом.',
          'Заранее подготовьте ответы на ожидаемые вопросы (выбор метода, объём выборки, ограничения).',
        ],
        en: [
          'A 15–20 slide deck: topic, relevance, aim, methods, results, conclusion.',
          'The talk is usually 7–10 minutes — rehearse at home against a clock.',
          'Keep each slide light: a heading and 3–5 short points.',
          'Show results in tables and charts, not paragraphs.',
          'Prepare answers to the likely questions in advance (choice of method, sample size, limitations).',
        ],
      }[lang];
      return `🎤 ${TOPICS.find((x) => x.id === 'defense').label[lang]}\n\n${numbered(how)}`;
    },
  },
  {
    id: 'novelty',
    label: { uz: 'Ilmiy yangilik', ru: 'Научная новизна', en: 'Scientific novelty' },
    keywords: ['yangilik', 'ilmiy yangilik', 'новизна', 'научная новизна', 'novelty', 'contribution', 'original contribution'],
    build: (d, lang) => {
      const t = L[lang];
      const how = {
        uz: [
          "Ilmiy yangilik — sizning ishingiz bilimga qo'shgan aniq yangi narsa.",
          "U yangi usul, yangi ma'lumot, yangi tahlil yoki mavjud usulning yangi sohaga tatbiqi bo'lishi mumkin.",
          "Bir-ikki jumlada aniq yozing: 'Birinchi marta ... aniqlandi' yoki '... usuli ... sharoitiga moslashtirildi'.",
          "Mavjud ishlardan farqini ko'rsating — nima qilingan edi va siz nimani qo'shdingiz.",
        ],
        ru: [
          'Научная новизна — то конкретно новое, что ваша работа добавляет к знанию.',
          'Это может быть новый метод, новые данные, новый анализ или применение известного метода в новой области.',
          'Сформулируйте в одном-двух предложениях: «Впервые выявлено...» или «Метод ... адаптирован к условиям ...».',
          'Покажите отличие от существующих работ — что было сделано и что добавили вы.',
        ],
        en: [
          'Scientific novelty is the specific new thing your work adds to knowledge.',
          'It can be a new method, new data, a new analysis, or applying a known method in a new setting.',
          'State it in one or two sentences: "For the first time it was established that..." or "The ... method was adapted to ...".',
          'Show the difference from existing work — what had been done, and what you added.',
        ],
      }[lang];
      return `🔭 ${TOPICS.find((x) => x.id === 'novelty').label[lang]}\n\n${numbered(how)}` + t.askSupervisor;
    },
  },
];

/** Longer keywords are more specific, so they should outweigh short ones. */
function scoreTopic(topic, q) {
  let score = 0;
  for (const kw of topic.keywords) {
    const k = normalize(kw);
    if (!k) continue;
    // Word-boundary-ish match so "bob" does not fire inside "bobo".
    const re = new RegExp(`(^|\\s)${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'u');
    if (re.test(q)) score += k.split(' ').length + k.length / 20;
  }
  return score;
}

export function getSuggestions(lang) {
  const ids = ['intro', 'structure', 'requirements', 'plagiarism', 'references', 'topic_choice'];
  return ids.map((id) => TOPICS.find((t) => t.id === id).label[lang]);
}

/**
 * Answer a question from the knowledge base.
 * Always returns a string -- when nothing matches it lists what it can do.
 */
export function findAnswer(question, lang = 'uz') {
  const L_ = L[lang] ? lang : 'uz';
  const t = L[L_];
  const q = normalize(question);
  const type = detectType(q);
  const data = getGuideData(L_)[type.key];

  const ranked = TOPICS
    .map((topic) => ({ topic, score: scoreTopic(topic, q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  for (const { topic } of ranked) {
    const answer = topic.build(data, L_, type.explicit);
    if (answer) return answer;
  }

  const menu = TOPICS.map((tp) => `• ${tp.label[L_]}`).join('\n');
  return `${t.noMatch}\n\n${menu}${t.noMatchTail}`;
}
