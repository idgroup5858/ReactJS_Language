import type { ContentBlock, Example } from '@/domain/types'
import type { TopicEntry } from './contentIndex'
import { loadIndex, loadLanguageTopics } from './contentRepository'

export type SearchResult = { kind: 'topic'; entry: TopicEntry } | { kind: 'example'; entry: TopicEntry; example: Example }

interface Entry {
  result: SearchResult
  text: string
}

export const MAX_SEARCH_RESULTS = 100

/**
 * Kontent matnini qidiruv uchun bir xil ko'rinishga keltiradi: belgilash (**, `) olib tashlanadi, kichik harf,
 * "ё" → "е" (ruscha matnda ko'pincha "е" yoziladi), o'zbekcha tutuq belgisining turli yozilishlari (ʻ ʼ ’ ‘) → "'".
 */
function normalizeForSearch(text: string): string {
  return text
    .replaceAll('**', '')
    .replaceAll('`', '')
    .toLowerCase()
    .replaceAll('ё', 'е')
    .replace(/[ʻʼ’‘]/g, "'")
}

/**
 * Bitta til uchun qidiruv indeksi. Har bir mavzu va misolning tayyorlangan matni bir marta quriladi — keyingi har bir
 * so'rov faqat tayyor satrlar ichidan qidiradi.
 */
export class SearchIndex {
  private readonly topicEntries: Entry[] = []
  private readonly exampleEntries: Entry[] = []

  constructor(topics: { entry: TopicEntry; blocks: ContentBlock[]; examples: Example[] }[]) {
    for (const { entry, blocks, examples } of topics) {
      const topicText = [entry.topic.title, entry.topic.summary, ...blocks.map(blockText)].join(' ')
      this.topicEntries.push({ result: { kind: 'topic', entry }, text: normalizeForSearch(topicText) })
      for (const example of examples) {
        const sentences = example.sentences.flatMap((sentence) => [sentence.text, sentence.translation])
        const text = [example.title, example.description, ...sentences].filter(Boolean).join(' ')
        this.exampleEntries.push({ result: { kind: 'example', entry, example }, text: normalizeForSearch(text) })
      }
    }
  }

  /** Mavzular birinchi chiqadi — foydalanuvchi odatda aynan mavzuni qidiradi. */
  search(terms: string[], limit = MAX_SEARCH_RESULTS): SearchResult[] {
    const results: SearchResult[] = []
    for (const entries of [this.topicEntries, this.exampleEntries]) {
      for (const entry of entries) {
        if (terms.every((term) => entry.text.includes(term))) {
          results.push(entry.result)
          if (results.length === limit) return results
        }
      }
    }
    return results
  }
}

/** So'rovda "`" belgilash emas, tutuq belgisi ("o`zbek"). */
export function searchTerms(query: string): string[] {
  return normalizeForSearch(query.replaceAll('`', "'"))
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 0)
}

function blockText(block: ContentBlock): string {
  switch (block.type) {
    case 'heading':
    case 'paragraph':
    case 'note':
      return block.text
    case 'list':
      return block.items.join(' ')
    case 'table':
      return [...block.headers, ...block.rows.flat()].join(' ')
    case 'sentences':
      return block.items.map((sentence) => `${sentence.text} ${sentence.translation}`).join(' ')
  }
}

const indexRequests = new Map<string, Promise<SearchIndex>>()

/** Indeks til bo'yicha bir marta quriladi. Kontenti hali yo'q mavzular ham nomi va izohi bo'yicha topiladi. */
export function loadSearchIndex(languageId: string): Promise<SearchIndex> {
  let request = indexRequests.get(languageId)
  if (!request) {
    request = Promise.all([loadIndex(), loadLanguageTopics(languageId)]).then(([index, loaded]) => {
      const contentById = new Map(loaded.map(({ entry, content }) => [`${entry.book.id}|${entry.topic.id}`, content]))
      return new SearchIndex(
        index.languageTopics(languageId).map((entry) => {
          const content = contentById.get(`${entry.book.id}|${entry.topic.id}`)
          return { entry, blocks: content?.blocks ?? [], examples: content?.examples ?? [] }
        }),
      )
    })
    request.catch(() => indexRequests.delete(languageId))
    indexRequests.set(languageId, request)
  }
  return request
}
