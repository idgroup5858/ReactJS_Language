/**
 * Misolning noyob manzili — sevimlilar va "tushunarli" belgilari shu kalit bilan saqlanadi.
 * Bo'lim kalitga kirmaydi: mavzu boshqa bo'limga ko'chirilsa ham belgilar saqlanib qoladi (mavzu id'si kitob ichida noyob).
 * Saqlash uchun bitta satrga aylantiriladi.
 */
export interface FavoriteKey {
  languageId: string
  bookId: string
  topicId: string
  exampleId: string
}

const SEPARATOR = '|'

export function encodeFavoriteKey(key: FavoriteKey): string {
  return [key.languageId, key.bookId, key.topicId, key.exampleId].join(SEPARATOR)
}

export function decodeFavoriteKey(raw: string): FavoriteKey | null {
  const parts = raw.split(SEPARATOR)
  if (parts.length !== 4) return null
  const [languageId, bookId, topicId, exampleId] = parts
  return { languageId, bookId, topicId, exampleId }
}
