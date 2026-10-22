/**
 * Kontent modellari — `public/data` dagi JSON tuzilmasiga mos (to'liq format va tekshiruv — scripts/content.mjs).
 *
 *   Til (navbar tablari) → Kitob → Bo'lim → Mavzu (dars) → Misollar (har birida ~10 ta gap)
 */

export type NoteKind = 'info' | 'tip' | 'warning'

/** O'rganilayotgan tildagi gap ([text], masalan ruscha) va uning o'zbekcha tarjimasi. */
export interface Sentence {
  text: string
  translation: string
}

/**
 * Mavzuning nazariy qismini tashkil qiluvchi bloklar. Matnli bloklarda yengil belgilash ishlatiladi:
 * `-а` — aksent rangli "chip" (qo'shimcha, so'z shakli), **qalin** — qalin matn (gaplarda — aksent rangda).
 */
export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'note'; kind: NoteKind; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'sentences'; items: Sentence[] }

export interface Example {
  /** "ex1", "ex2", ... — mavzu ichida 1 dan misollar soniga qadar, takrorlanmaydi. "Tushunarli" belgisi va
   *  sevimlilar shu id bilan saqlanadi, shuning uchun yangi misol oxirgi raqamdan keyingi id oladi */
  id: string
  title: string
  description?: string
  sentences: Sentence[]
}

/** Mavzuning to'liq kontenti — `public/data/<til>/<kitob>/<mavzu>.json`. */
export interface TopicContent {
  id: string
  blocks: ContentBlock[]
  examples: Example[]
}

/** Indeksdagi mavzu: nazariya va gaplarsiz, faqat ro'yxatlar uchun. Sanoqlarni `npm run content:sync` yozadi. */
export interface TopicSummaryData {
  id: string
  /** o'rganilayotgan tilda (masalan "Дательный падеж. Существительные") */
  title: string
  /** o'zbekcha qisqa izoh */
  summary: string
  /** kontent fayli bormi — yo'q bo'lsa mavzu "Tayyorlanmoqda" bo'lib ko'rinadi */
  ready: boolean
  exampleCount: number
  sentenceCount: number
}

/** Ilova ichidagi mavzu: [number] — kitobdagi dars raqami (1 dan), JSON da yo'q, tartibdan hisoblanadi. */
export interface TopicSummary extends TopicSummaryData {
  number: number
}

export interface SectionData<Topic = TopicSummaryData> {
  id: string
  title: string
  description: string
  topics: Topic[]
}

export type Section = SectionData<TopicSummary>

export interface BookData<Topic = TopicSummaryData> {
  id: string
  title: string
  description: string
  sections: SectionData<Topic>[]
}

export type Book = BookData<TopicSummary>

/**
 * O'rganiladigan til. `isAvailable = false` bo'lsa, til sozlamalarda "Tez kunda" sifatida ko'rinadi.
 * `brandColor` — logotipi bo'lmasa belgi foni uchun; `heroGlyphs` — banner bezagidagi ikki belgi ("Аа", "Яя").
 */
export interface LanguageData<Topic = TopicSummaryData> {
  id: string
  name: string
  shortLabel: string
  brandColor: string
  description: string
  heroGlyphs?: [string, string]
  isAvailable: boolean
  books: BookData<Topic>[]
}

export type Language = LanguageData<TopicSummary>

/** `public/data/index.json` */
export interface ContentIndexData {
  languages: LanguageData[]
}
