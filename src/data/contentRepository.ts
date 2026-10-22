import type { ContentIndexData, TopicContent } from '@/domain/types'
import { ContentIndex, type TopicEntry } from './contentIndex'

/**
 * Kontent statik JSON fayllardan olinadi (`public/data`):
 * - `index.json` — tillar, kitoblar, bo'limlar va mavzular ro'yxati (ilova ochilganda bir marta);
 * - `<til>/<kitob>/<mavzu>.json` — mavzuning nazariyasi va misollari, birinchi kerak bo'lganda.
 * Har bir fayl bir marta yuklanadi va xotirada qoladi.
 */

const DATA_URL = `${import.meta.env.BASE_URL}data`

let indexRequest: Promise<ContentIndex> | undefined
const topicRequests = new Map<string, Promise<TopicContent>>()

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${DATA_URL}/${path}`)
  if (!response.ok) throw new Error(`Ma'lumotni yuklab bo'lmadi: ${path} (${response.status})`)
  return (await response.json()) as T
}

/** Muvaffaqiyatsiz so'rov keshda qolmaydi — keyingi urinish faylni qayta so'raydi. */
function remember<T>(request: Promise<T>, forget: () => void): Promise<T> {
  request.catch(forget)
  return request
}

export function loadIndex(): Promise<ContentIndex> {
  indexRequest ??= remember(
    fetchJson<ContentIndexData>('index.json').then((data) => new ContentIndex(data)),
    () => (indexRequest = undefined),
  )
  return indexRequest
}

export function loadTopic(languageId: string, bookId: string, topicId: string): Promise<TopicContent> {
  const path = `${languageId}/${bookId}/${topicId}`
  let request = topicRequests.get(path)
  if (!request) {
    request = remember(fetchJson<TopicContent>(`${path}.json`), () => topicRequests.delete(path))
    topicRequests.set(path, request)
  }
  return request
}

export interface LoadedTopic {
  entry: TopicEntry
  content: TopicContent
}

/** Tilning kontenti tayyor barcha mavzulari (qidiruv uchun). Fayllar parallel yuklanadi. */
export async function loadLanguageTopics(languageId: string): Promise<LoadedTopic[]> {
  const entries = (await loadIndex()).languageTopics(languageId).filter((entry) => entry.topic.ready)
  return Promise.all(
    entries.map(async (entry) => ({ entry, content: await loadTopic(languageId, entry.book.id, entry.topic.id) })),
  )
}
