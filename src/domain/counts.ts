import type { Book, Language, Section } from './types'

export interface Totals {
  sections: number
  topics: number
  /** kontenti tayyor mavzular */
  readyTopics: number
  examples: number
  sentences: number
}

const EMPTY: Totals = { sections: 0, topics: 0, readyTopics: 0, examples: 0, sentences: 0 }

function add(a: Totals, b: Totals): Totals {
  return {
    sections: a.sections + b.sections,
    topics: a.topics + b.topics,
    readyTopics: a.readyTopics + b.readyTopics,
    examples: a.examples + b.examples,
    sentences: a.sentences + b.sentences,
  }
}

export function sectionTotals(section: Section): Totals {
  return section.topics.reduce<Totals>(
    (totals, topic) =>
      add(totals, {
        sections: 0,
        topics: 1,
        readyTopics: topic.ready ? 1 : 0,
        examples: topic.exampleCount,
        sentences: topic.sentenceCount,
      }),
    { ...EMPTY, sections: 1 },
  )
}

export function bookTotals(book: Book): Totals {
  return book.sections.reduce<Totals>((totals, section) => add(totals, sectionTotals(section)), EMPTY)
}

export function languageTotals(language: Language): Totals {
  return language.books.reduce<Totals>((totals, book) => add(totals, bookTotals(book)), EMPTY)
}

/** Bo'limdagi darslar oralig'i: "1–7". */
export function lessonRange(section: Section): string {
  const first = section.topics[0]?.number
  const last = section.topics[section.topics.length - 1]?.number
  if (first === undefined || last === undefined) return ''
  return first === last ? `${first}` : `${first}–${last}`
}
