#!/usr/bin/env node
/**
 * Kontent vositasi (public/data):
 *
 *   node scripts/content.mjs check   — index.json va mavzu fayllarini tekshiradi (xato bo'lsa — exit 1)
 *   node scripts/content.mjs check <mavzu-id> ...   — faqat shu mavzular (sanoqlar solishtirilmaydi)
 *   node scripts/content.mjs sync    — tekshiradi va index.json dagi ready / exampleCount / sentenceCount ni fayllardan yozadi
 *   node scripts/content.mjs stats   — hajm: til, kitob va bo'limlar bo'yicha
 *
 * Tuzilma:
 *   public/data/index.json                  tillar → kitoblar → bo'limlar → mavzular (tartib = dars raqami)
 *   public/data/<til>/<kitob>/<mavzu>.json  mavzu kontenti; fayl yo'q bo'lsa mavzu "Tayyorlanmoqda"
 *
 * Mavzu fayli (src/domain/types.ts → TopicContent):
 *   {
 *     "id": "<mavzu id'si, fayl nomi bilan bir xil>",
 *     "blocks": [                                   // nazariya
 *       { "type": "heading", "text": "..." },
 *       { "type": "paragraph", "text": "..." },
 *       { "type": "list", "ordered": false, "items": ["...", "..."] },
 *       { "type": "note", "kind": "info" | "tip" | "warning", "text": "..." },
 *       { "type": "table", "headers": ["...", "..."], "rows": [["...", "..."]] },
 *       { "type": "sentences", "items": [{ "text": "<ruscha>", "translation": "<o'zbekcha>" }] }
 *     ],
 *     "examples": [                                 // misollar
 *       { "id": "ex1", "title": "...", "description": "...", "sentences": [{ "text": "...", "translation": "..." }] }
 *     ]
 *   }
 *
 * Qoidalar:
 *   - misol id'lari ex1..exN (tartib ixtiyoriy, bo'shliqsiz) — "tushunarli" belgilari shu id bilan saqlanadi,
 *     shuning uchun yangi misol oxirgi raqamdan keyingi id oladi, mavjud id boshqa misolga berilmaydi;
 *   - har bir misolda 10 ta gap (boshqacha bo'lsa — ogohlantirish);
 *   - gaplar xilma-xil: bir misolda bir xil ikki so'z bilan boshlanadigan gaplar ko'pi bilan 2 ta, darsda — 6 ta,
 *     bir xil birinchi so'z bilan — ko'pi bilan 3 ta;
 *     o'rtacha uzunlik kamida 5 so'z (1–16-darslar) / 6 so'z (keyingilari, dialoglardan tashqari);
 *     boshqa darsdagi gap aynan takrorlanmaydi (CONTENT_GUIDE.md §5);
 *   - belgilash: **qalin** (gapda — so'z shakli aksent rangda), `-а` (qo'shimcha "chip"); juft bo'lishi shart;
 *   - o'zbekcha tutuq belgisi — oddiy apostrof ('), backtick (`) emas: u belgilash uchun band.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = join(ROOT, 'public', 'data')
const INDEX_PATH = join(DATA_DIR, 'index.json')

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const EXAMPLE_ID_RE = /^ex(\d+)$/
const CYRILLIC_RE = /[Ѐ-ӿ]/g
const LETTER_RE = /[\p{L}]/gu
const BLOCK_TYPES = new Set(['heading', 'paragraph', 'list', 'note', 'table', 'sentences'])
const NOTE_KINDS = new Set(['info', 'tip', 'warning'])
const SENTENCES_PER_EXAMPLE = 10

const errors = []
const warnings = []
const error = (where, message) => errors.push(`${where}: ${message}`)
const warn = (where, message) => warnings.push(`${where}: ${message}`)

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

const isText = (value) => typeof value === 'string' && value.trim().length > 0

/** `**` va backtick juft bo'lishi kerak — aks holda belgilash oddiy matn bo'lib qoladi. */
function checkMarkup(where, text) {
  if ((text.split('**').length - 1) % 2 !== 0) error(where, `yopilmagan ** belgilash: "${text}"`)
  if ((text.split('`').length - 1) % 2 !== 0) error(where, `yopilmagan \` belgilash (tutuq belgisi uchun ' ishlating): "${text}"`)
}

function checkText(where, value, field) {
  if (!isText(value)) {
    error(where, `"${field}" bo'sh yoki matn emas`)
    return
  }
  checkMarkup(where, value)
}

function cyrillicShare(text) {
  const letters = text.replaceAll('**', '').match(LETTER_RE)?.length ?? 0
  const cyrillic = text.match(CYRILLIC_RE)?.length ?? 0
  return letters === 0 ? 0 : cyrillic / letters
}

function checkSentence(where, sentence) {
  if (!sentence || typeof sentence !== 'object') return error(where, 'gap obyekt emas')
  checkText(where, sentence.text, 'text')
  checkText(where, sentence.translation, 'translation')
  if (isText(sentence.text) && cyrillicShare(sentence.text) < 0.5) warn(where, `gap ruscha emasga o'xshaydi: "${sentence.text}"`)
  if (isText(sentence.translation) && cyrillicShare(sentence.translation) > 0.5) {
    warn(where, `tarjima o'zbekcha emasga o'xshaydi: "${sentence.translation}"`)
  }
}

function checkBlock(where, block) {
  if (!block || !BLOCK_TYPES.has(block.type)) return error(where, `noma'lum blok turi: ${block?.type}`)
  switch (block.type) {
    case 'heading':
    case 'paragraph':
      return checkText(where, block.text, 'text')
    case 'note':
      if (!NOTE_KINDS.has(block.kind)) error(where, `note.kind noto'g'ri: ${block.kind}`)
      return checkText(where, block.text, 'text')
    case 'list':
      if (typeof block.ordered !== 'boolean') error(where, 'list.ordered true/false bo\'lishi kerak')
      if (!Array.isArray(block.items) || block.items.length === 0) return error(where, "list.items bo'sh")
      return block.items.forEach((item, index) => checkText(`${where} item ${index + 1}`, item, 'item'))
    case 'table':
      if (!Array.isArray(block.headers) || block.headers.length === 0) return error(where, "table.headers bo'sh")
      if (!Array.isArray(block.rows) || block.rows.length === 0) return error(where, "table.rows bo'sh")
      block.headers.forEach((header) => checkText(where, header, 'header'))
      return block.rows.forEach((row, index) => {
        if (!Array.isArray(row) || row.length !== block.headers.length) {
          return error(`${where} qator ${index + 1}`, `${block.headers.length} ta katak bo'lishi kerak`)
        }
        row.forEach((cell) => (typeof cell === 'string' ? checkMarkup(`${where} qator ${index + 1}`, cell) : error(where, 'katak matn emas')))
      })
    case 'sentences':
      if (!Array.isArray(block.items) || block.items.length === 0) return error(where, "sentences.items bo'sh")
      return block.items.forEach((sentence, index) => checkSentence(`${where} gap ${index + 1}`, sentence))
  }
}

const WORD_RE = /[\p{L}\d]+/gu
/** bitta misolda bir xil qolip bilan boshlanadigan gaplar soni (ko'pi bilan) */
const MAX_PATTERN_PER_EXAMPLE = 2
/** bitta misolda bir xil birinchi so'z bilan boshlanadigan gaplar soni (ko'pi bilan): "Это ... Это ... Это ..." */
const MAX_FIRST_WORD_PER_EXAMPLE = 3
/** butun darsda bir xil qolip bilan boshlanadigan gaplar soni (ko'pi bilan) */
const MAX_PATTERN_PER_LESSON = 6
/** misoldagi gaplarning o'rtacha so'z soni (kamida): boshlang'ich darslarda (1–16) va keyingilarida */
const MIN_AVERAGE_WORDS = { beginner: 5, regular: 6 }
const BEGINNER_LESSONS = 16

const words = (text) => text.replaceAll('**', '').replaceAll('`', '').toLowerCase().match(WORD_RE) ?? []

/** Gap qolipi — birinchi ikki so'z (tire, belgilash va tinish belgilarisiz): "Это стол. Он большой." → "это стол". */
const sentencePattern = (text) => words(text).slice(0, 2).join(' ')

const isDialogue = (sentences) => sentences.filter((sentence) => /^\s*[—–-]/.test(sentence?.text ?? '')).length > sentences.length / 2

/** Butun kurs bo'yicha gaplar: boshqa darsdagi gap aynan takrorlanmasin. gap → mavzu id'si */
const courseSentences = new Map()

/** Gaplar xilma-xilligi: bir qolip takrorlanmasin, gaplar haddan tashqari qisqa (oson) bo'lmasin. */
function checkVariety(where, examples, topicId, lessonNumber) {
  const lessonPatterns = new Map()
  for (const example of examples) {
    if (!Array.isArray(example?.sentences)) continue
    const texts = example.sentences.map((sentence) => (typeof sentence?.text === 'string' ? sentence.text : ''))
    const exampleWhere = `${where} ${example.id}`

    const patterns = new Map()
    const firstWords = new Map()
    for (const text of texts) {
      const pattern = sentencePattern(text)
      if (!pattern) continue
      patterns.set(pattern, (patterns.get(pattern) ?? 0) + 1)
      lessonPatterns.set(pattern, (lessonPatterns.get(pattern) ?? 0) + 1)
      const first = pattern.split(' ')[0]
      firstWords.set(first, (firstWords.get(first) ?? 0) + 1)
    }
    for (const [first, count] of firstWords) {
      if (count > MAX_FIRST_WORD_PER_EXAMPLE) {
        warn(exampleWhere, `${count} ta gap "${first}" so'zi bilan boshlanadi — gap tuzilishini xilma-xil qiling (ko'pi bilan ${MAX_FIRST_WORD_PER_EXAMPLE} ta)`)
      }
    }
    for (const [pattern, count] of patterns) {
      if (count > MAX_PATTERN_PER_EXAMPLE) {
        warn(exampleWhere, `${count} ta gap "${pattern} ..." bilan boshlanadi — qoliplarni xilma-xil qiling (ko'pi bilan ${MAX_PATTERN_PER_EXAMPLE} ta)`)
      }
    }

    if (!isDialogue(example.sentences)) {
      const average = texts.reduce((sum, text) => sum + words(text).length, 0) / Math.max(texts.length, 1)
      const minimum = lessonNumber <= BEGINNER_LESSONS ? MIN_AVERAGE_WORDS.beginner : MIN_AVERAGE_WORDS.regular
      if (average < minimum) {
        warn(exampleWhere, `gaplar juda qisqa / oson: o'rtacha ${average.toFixed(1)} so'z (kamida ${minimum})`)
      }
    }

    texts.forEach((text, index) => {
      const key = words(text).join(' ')
      if (!key) return
      const other = courseSentences.get(key)
      if (other && other !== topicId) warn(`${exampleWhere} gap ${index + 1}`, `"${other}" darsidagi gap bilan bir xil`)
      else courseSentences.set(key, topicId)
    })
  }
  for (const [pattern, count] of lessonPatterns) {
    if (count > MAX_PATTERN_PER_LESSON) {
      warn(where, `darsda ${count} ta gap "${pattern} ..." bilan boshlanadi — ko'pi bilan ${MAX_PATTERN_PER_LESSON} ta`)
    }
  }
}

/** Mavzu faylini tekshiradi; sanoqlarni qaytaradi (fayl yaroqsiz bo'lsa ham — xatolar alohida yig'iladi). */
function checkTopicFile(path, topicId, lessonNumber) {
  const where = path.slice(ROOT.length + 1).replaceAll('\\', '/')
  let content
  try {
    content = readJson(path)
  } catch (cause) {
    error(where, `JSON o'qilmadi: ${cause.message}`)
    return { exampleCount: 0, sentenceCount: 0 }
  }
  if (content.id !== topicId) error(where, `"id" fayl nomi bilan bir xil bo'lishi kerak: ${topicId}`)
  if (!Array.isArray(content.blocks)) error(where, '"blocks" massiv emas')
  if (!Array.isArray(content.examples)) error(where, '"examples" massiv emas')
  const blocks = Array.isArray(content.blocks) ? content.blocks : []
  const examples = Array.isArray(content.examples) ? content.examples : []

  if (blocks.length === 0) warn(where, "nazariya yo'q")
  blocks.forEach((block, index) => checkBlock(`${where} blok ${index + 1}`, block))

  const numbers = new Set()
  const seenSentences = new Map()
  let sentenceCount = 0
  examples.forEach((example, index) => {
    const exampleWhere = `${where} ${example?.id ?? `misol ${index + 1}`}`
    const number = Number(EXAMPLE_ID_RE.exec(example?.id ?? '')?.[1])
    if (!number) error(exampleWhere, 'id "exN" ko\'rinishida bo\'lishi kerak')
    else if (numbers.has(number)) error(exampleWhere, 'id takrorlangan')
    else numbers.add(number)
    checkText(exampleWhere, example?.title, 'title')
    if (example?.description !== undefined) checkText(exampleWhere, example.description, 'description')
    if (!Array.isArray(example?.sentences) || example.sentences.length === 0) return error(exampleWhere, "sentences bo'sh")
    if (example.sentences.length !== SENTENCES_PER_EXAMPLE) {
      warn(exampleWhere, `${example.sentences.length} ta gap (odatda ${SENTENCES_PER_EXAMPLE} ta)`)
    }
    example.sentences.forEach((sentence, sentenceIndex) => {
      const sentenceWhere = `${exampleWhere} gap ${sentenceIndex + 1}`
      checkSentence(sentenceWhere, sentence)
      const key = typeof sentence?.text === 'string' ? sentence.text.replaceAll('**', '').trim().toLowerCase() : ''
      if (key && seenSentences.has(key)) warn(sentenceWhere, `takroriy gap (${seenSentences.get(key)} bilan bir xil)`)
      else if (key) seenSentences.set(key, sentenceWhere.slice(where.length + 1))
    })
    sentenceCount += example.sentences.length
  })
  for (let number = 1; number <= examples.length; number++) {
    if (!numbers.has(number)) error(where, `misol id'lari ex1..ex${examples.length} bo'lishi kerak — ex${number} yo'q`)
  }
  checkVariety(where, examples, topicId, lessonNumber)
  return { exampleCount: examples.length, sentenceCount }
}

/** index.json ni tekshiradi va har bir mavzu uchun fayldan sanoqlarni hisoblaydi. */
function scan() {
  const index = readJson(INDEX_PATH)
  if (!Array.isArray(index.languages)) {
    error('index.json', '"languages" massiv emas')
    return index
  }
  const languageIds = new Set()
  for (const language of index.languages) {
    const where = `index.json ${language.id}`
    if (!SLUG_RE.test(language.id ?? '') || languageIds.has(language.id)) error(where, "til id'si noto'g'ri yoki takrorlangan")
    languageIds.add(language.id)
    for (const field of ['name', 'shortLabel', 'brandColor', 'description']) checkText(where, language[field], field)
    if (!Array.isArray(language.books)) {
      error(where, '"books" massiv emas')
      continue
    }
    const bookIds = new Set()
    for (const book of language.books) {
      const bookWhere = `${where}/${book.id}`
      if (!SLUG_RE.test(book.id ?? '') || bookIds.has(book.id)) error(bookWhere, "kitob id'si noto'g'ri yoki takrorlangan")
      bookIds.add(book.id)
      checkText(bookWhere, book.title, 'title')
      checkText(bookWhere, book.description, 'description')
      const bookDir = join(DATA_DIR, language.id, book.id)
      const sectionIds = new Set()
      const topicIds = new Set()
      let lessonNumber = 0
      for (const section of book.sections ?? []) {
        const sectionWhere = `${bookWhere}/${section.id}`
        if (!SLUG_RE.test(section.id ?? '') || sectionIds.has(section.id)) error(sectionWhere, "bo'lim id'si noto'g'ri yoki takrorlangan")
        sectionIds.add(section.id)
        checkText(sectionWhere, section.title, 'title')
        checkText(sectionWhere, section.description, 'description')
        if (!Array.isArray(section.topics) || section.topics.length === 0) error(sectionWhere, "bo'limda mavzu yo'q")
        for (const topic of section.topics ?? []) {
          const topicWhere = `${sectionWhere}/${topic.id}`
          // mavzu id'si kitob ichida noyob: "tushunarli" belgilari bo'limsiz saqlanadi
          if (!SLUG_RE.test(topic.id ?? '') || topicIds.has(topic.id)) error(topicWhere, "mavzu id'si noto'g'ri yoki kitobda takrorlangan")
          topicIds.add(topic.id)
          checkText(topicWhere, topic.title, 'title')
          checkText(topicWhere, topic.summary, 'summary')
          const path = join(bookDir, `${topic.id}.json`)
          const ready = existsSync(path)
          lessonNumber++
          const counts = ready ? checkTopicFile(path, topic.id, lessonNumber) : { exampleCount: 0, sentenceCount: 0 }
          topic.__computed = { ready, ...counts }
        }
      }
      if (existsSync(bookDir)) {
        for (const file of readdirSync(bookDir)) {
          if (file.endsWith('.json') && !topicIds.has(file.slice(0, -5))) {
            error(`public/data/${language.id}/${book.id}/${file}`, "index.json da bunday mavzu yo'q")
          }
        }
      }
    }
  }
  return index
}

function topicsOf(index) {
  return index.languages.flatMap((language) =>
    (language.books ?? []).flatMap((book) => (book.sections ?? []).flatMap((section) => section.topics ?? [])),
  )
}

function report() {
  for (const message of warnings) console.log(`  ogohlantirish  ${message}`)
  for (const message of errors) console.log(`  XATO           ${message}`)
  console.log(`\n${errors.length} ta xato, ${warnings.length} ta ogohlantirish`)
}

/**
 * [ids] berilsa — faqat shu mavzular fayllari tekshiriladi (boshqa mavzular xabarlari ko'rsatilmaydi) va index.json
 * sanoqlari solishtirilmaydi: bir nechta dars parallel yozilayotganda index.json ga faqat oxirida `sync` yozadi.
 */
function check(ids) {
  const index = scan()
  if (ids.length > 0) {
    const known = new Set(topicsOf(index).map((topic) => topic.id))
    for (const id of ids) if (!known.has(id)) error(id, "index.json da bunday mavzu yo'q")
    const mine = (message) => ids.some((id) => message.includes(`/${id}.json`) || message.includes(`/${id}:`) || message.startsWith(`${id}:`))
    for (const list of [errors, warnings]) list.splice(0, list.length, ...list.filter(mine))
    for (const id of ids) {
      const topic = topicsOf(index).find((item) => item.id === id)
      if (topic && !topic.__computed?.ready) error(id, 'kontent fayli topilmadi')
      else if (topic) console.log(`  ${id}: ${topic.__computed.exampleCount} ta misol, ${topic.__computed.sentenceCount} ta gap`)
    }
    report()
    process.exitCode = errors.length > 0 ? 1 : 0
    return
  }
  const stale = topicsOf(index).filter(
    (topic) =>
      topic.__computed &&
      (topic.ready !== topic.__computed.ready ||
        topic.exampleCount !== topic.__computed.exampleCount ||
        topic.sentenceCount !== topic.__computed.sentenceCount),
  )
  for (const topic of stale) error(`index.json ${topic.id}`, "sanoqlar fayl bilan mos emas — `npm run content:sync` ni ishga tushiring")
  report()
  process.exitCode = errors.length > 0 ? 1 : 0
}

function sync() {
  const index = scan()
  let changed = 0
  for (const topic of topicsOf(index)) {
    const computed = topic.__computed
    delete topic.__computed
    if (!computed) continue
    if (topic.ready !== computed.ready || topic.exampleCount !== computed.exampleCount || topic.sentenceCount !== computed.sentenceCount) {
      changed++
    }
    topic.ready = computed.ready
    topic.exampleCount = computed.exampleCount
    topic.sentenceCount = computed.sentenceCount
  }
  report()
  if (errors.length > 0) {
    console.log("index.json yangilanmadi — avval xatolarni tuzating")
    process.exitCode = 1
    return
  }
  writeFileSync(INDEX_PATH, formatIndex(index))
  console.log(`index.json yangilandi: ${changed} ta mavzu o'zgardi`)
}

function inline(value) {
  if (Array.isArray(value)) return `[${value.map(inline).join(', ')}]`
  if (value && typeof value === 'object') {
    return `{ ${Object.entries(value).map(([key, item]) => `${JSON.stringify(key)}: ${inline(item)}`).join(', ')} }`
  }
  return JSON.stringify(value)
}

const isTopicSummary = (value) => value && typeof value === 'object' && 'summary' in value && 'exampleCount' in value

/** Mavzular bitta qatorda (index.json o'qishga qulay va diff ixcham bo'lsin), qolgani 2 bo'shliq bilan. */
function format(value, depth = 0, key = '') {
  if (key === 'heroGlyphs' || isTopicSummary(value) || value === null || typeof value !== 'object') return inline(value)
  const pad = '  '.repeat(depth + 1)
  const close = '  '.repeat(depth)
  if (Array.isArray(value)) {
    return value.length === 0 ? '[]' : `[\n${value.map((item) => pad + format(item, depth + 1)).join(',\n')}\n${close}]`
  }
  const entries = Object.entries(value).map(([name, item]) => `${pad}${JSON.stringify(name)}: ${format(item, depth + 1, name)}`)
  return `{\n${entries.join(',\n')}\n${close}}`
}

function formatIndex(index) {
  return `${format(index)}\n`
}

function stats() {
  const index = scan()
  const pad = (value, width) => String(value).padStart(width)
  for (const language of index.languages) {
    for (const book of language.books ?? []) {
      console.log(`\n${language.name} — ${book.title}`)
      console.log(`  ${"Bo'lim".padEnd(36)} ${pad('Darslar', 8)} ${pad('Tayyor', 7)} ${pad('Misollar', 9)} ${pad('Gaplar', 7)}`)
      const total = { topics: 0, ready: 0, examples: 0, sentences: 0 }
      for (const section of book.sections ?? []) {
        const topics = section.topics ?? []
        const row = {
          topics: topics.length,
          ready: topics.filter((topic) => topic.__computed?.ready).length,
          examples: topics.reduce((sum, topic) => sum + (topic.__computed?.exampleCount ?? 0), 0),
          sentences: topics.reduce((sum, topic) => sum + (topic.__computed?.sentenceCount ?? 0), 0),
        }
        for (const key of Object.keys(total)) total[key] += row[key]
        console.log(`  ${section.title.slice(0, 36).padEnd(36)} ${pad(row.topics, 8)} ${pad(row.ready, 7)} ${pad(row.examples, 9)} ${pad(row.sentences, 7)}`)
      }
      console.log(`  ${'Jami'.padEnd(36)} ${pad(total.topics, 8)} ${pad(total.ready, 7)} ${pad(total.examples, 9)} ${pad(total.sentences, 7)}`)
    }
  }
  if (errors.length > 0) report()
}

const command = process.argv[2]
if (command === 'check') check(process.argv.slice(3))
else if (command === 'sync') sync()
else if (command === 'stats') stats()
else {
  console.log('Foydalanish: node scripts/content.mjs <check | sync | stats>')
  process.exitCode = 1
}
