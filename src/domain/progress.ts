import type { Book, Language, Section, TopicSummary } from './types'

/** "Tushunarli" deb belgilangan misollar: `til|kitob|mavzu` → misol id'lari. */
export type LearnedIndex = ReadonlyMap<string, ReadonlySet<string>>

/** O'zlashtirish holati: nechta misol tushunarli deb belgilangan ([done]) va jami nechta ([total]). */
export interface Progress {
  done: number
  total: number
}

const EMPTY: Progress = { done: 0, total: 0 }

export function topicPath(languageId: string, bookId: string, topicId: string): string {
  return [languageId, bookId, topicId].join('|')
}

const EXAMPLE_ID_RE = /^ex(\d+)$/

/** Kontent yangilanib misollar kamaygan bo'lsa, endi mavjud bo'lmagan id'lar hisobga olinmaydi. */
export function topicProgress(index: LearnedIndex, languageId: string, bookId: string, topic: TopicSummary): Progress {
  let done = 0
  for (const id of index.get(topicPath(languageId, bookId, topic.id)) ?? []) {
    const number = Number(EXAMPLE_ID_RE.exec(id)?.[1])
    if (number >= 1 && number <= topic.exampleCount) done++
  }
  return { done, total: topic.exampleCount }
}

function sum(a: Progress, b: Progress): Progress {
  return { done: a.done + b.done, total: a.total + b.total }
}

export function sectionProgress(index: LearnedIndex, languageId: string, bookId: string, section: Section): Progress {
  return section.topics.reduce((total, topic) => sum(total, topicProgress(index, languageId, bookId, topic)), EMPTY)
}

export function bookProgress(index: LearnedIndex, languageId: string, book: Book): Progress {
  return book.sections.reduce((total, section) => sum(total, sectionProgress(index, languageId, book.id, section)), EMPTY)
}

export function languageProgress(index: LearnedIndex, language: Language): Progress {
  return language.books.reduce((total, book) => sum(total, bookProgress(index, language.id, book)), EMPTY)
}

/** Butun foiz pastga yaxlitlanadi: hammasi belgilanmaguncha 100% ko'rinmaydi. */
export function progressPercent({ done, total }: Progress): number {
  return total === 0 ? 0 : Math.floor((done * 100) / total)
}
