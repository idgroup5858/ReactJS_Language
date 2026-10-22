import type { Book, BookData, ContentIndexData, Language, LanguageData, Section, TopicSummary } from '@/domain/types'

/** Mavzu va uning joylashuvi — kitob ichidagi tartib bo'yicha ro'yxatlar, havolalar va qidiruv uchun. */
export interface TopicEntry {
  language: Language
  book: Book
  section: Section
  topic: TopicSummary
}

/** Kitobdagi mavzularga tartib raqami beriladi: bo'limlar ketma-ket, dars raqami 1 dan oxirigacha uzluksiz. */
function numberBook(book: BookData): Book {
  let number = 0
  return {
    ...book,
    sections: book.sections.map((section) => ({
      ...section,
      topics: section.topics.map((topic) => ({ ...topic, number: ++number })),
    })),
  }
}

function numberLanguage(language: LanguageData): Language {
  return { ...language, books: language.books.map(numberBook) }
}

const key = (...parts: string[]) => parts.join('|')

/** `index.json` ustidagi qulay so'rovlar: til, kitob, bo'lim va mavzuni id bo'yicha topish. */
export class ContentIndex {
  /** katalogdagi barcha tillar ("Tez kunda" bo'lganlari ham) */
  readonly languages: Language[]
  /** kontenti tayyor tillar; birinchisi standart til hisoblanadi */
  readonly availableLanguages: Language[]
  private readonly languagesById: Map<string, Language>
  private readonly topicsByKey = new Map<string, TopicEntry>()
  private readonly topicsByBook = new Map<string, TopicEntry[]>()

  constructor(data: ContentIndexData) {
    this.languages = data.languages.map(numberLanguage)
    this.availableLanguages = this.languages.filter((language) => language.isAvailable)
    this.languagesById = new Map(this.languages.map((language) => [language.id, language]))

    for (const language of this.languages) {
      for (const book of language.books) {
        const entries = book.sections.flatMap((section) => section.topics.map((topic) => ({ language, book, section, topic })))
        this.topicsByBook.set(key(language.id, book.id), entries)
        for (const entry of entries) this.topicsByKey.set(key(language.id, book.id, entry.topic.id), entry)
      }
    }
  }

  language(languageId: string | undefined): Language | undefined {
    return languageId === undefined ? undefined : this.languagesById.get(languageId)
  }

  book(languageId: string | undefined, bookId: string | undefined): Book | undefined {
    return this.language(languageId)?.books.find((book) => book.id === bookId)
  }

  section(languageId: string | undefined, bookId: string | undefined, sectionId: string | undefined): Section | undefined {
    return this.book(languageId, bookId)?.sections.find((section) => section.id === sectionId)
  }

  topic(languageId: string, bookId: string, topicId: string): TopicEntry | undefined {
    return this.topicsByKey.get(key(languageId, bookId, topicId))
  }

  /** Kitobdagi barcha mavzular dars tartibida (bo'limlar chegarasidan qat'i nazar). */
  bookTopics(languageId: string, bookId: string): TopicEntry[] {
    return this.topicsByBook.get(key(languageId, bookId)) ?? []
  }

  /** Tilning barcha kitoblaridagi mavzular. */
  languageTopics(languageId: string): TopicEntry[] {
    return this.language(languageId)?.books.flatMap((book) => this.bookTopics(languageId, book.id)) ?? []
  }
}

export function topicUrl({ language, book, section, topic }: TopicEntry): string {
  return `/${language.id}/${book.id}/${section.id}/${topic.id}`
}

export function sectionUrl(languageId: string, bookId: string, sectionId: string): string {
  return `/${languageId}/${bookId}/${sectionId}`
}
