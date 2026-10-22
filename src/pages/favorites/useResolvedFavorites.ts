import { useEffect, useState } from 'react'
import { useContentIndex } from '@/app/routeData'
import { topicUrl, type ContentIndex } from '@/data/contentIndex'
import { loadTopic } from '@/data/contentRepository'
import { encodeFavoriteKey, type FavoriteKey } from '@/domain/favoriteKey'
import type { Language } from '@/domain/types'
import { plainText } from '@/lib/inlineMarkup'

export interface FavoriteItem {
  key: FavoriteKey
  language: Language
  exampleTitle: string
  /** "12-dars · Mavzu" */
  path: string
  to: string
}

/** Kontentda endi mavjud bo'lmagan misollar ro'yxatdan tushib qoladi. */
async function resolveFavorites(index: ContentIndex, keys: FavoriteKey[]): Promise<FavoriteItem[]> {
  const items = await Promise.all(
    keys.map(async (key): Promise<FavoriteItem | null> => {
      const entry = index.topic(key.languageId, key.bookId, key.topicId)
      if (!entry?.language.isAvailable || !entry.topic.ready) return null
      try {
        const content = await loadTopic(key.languageId, key.bookId, key.topicId)
        const example = content.examples.find((item) => item.id === key.exampleId)
        if (!example) return null
        return {
          key,
          language: entry.language,
          exampleTitle: plainText(example.title),
          path: `${entry.topic.number}-dars · ${entry.topic.title}`,
          to: `${topicUrl(entry)}#${key.exampleId}`,
        }
      } catch {
        return null
      }
    }),
  )
  return items.filter((item) => item !== null)
}

/**
 * Sevimlilarni ko'rsatish uchun kerakli mavzularni yuklaydi. `null` — birinchi marta yuklanmoqda.
 * Biror misol o'chirilganda ro'yxat qayta yuklanguncha eski natijadan darhol olib tashlanadi.
 */
export function useResolvedFavorites(keys: FavoriteKey[]): FavoriteItem[] | null {
  const index = useContentIndex()
  const [resolved, setResolved] = useState<{ keys: FavoriteKey[]; items: FavoriteItem[] } | null>(null)

  useEffect(() => {
    let cancelled = false
    void resolveFavorites(index, keys).then((items) => {
      if (!cancelled) setResolved({ keys, items })
    })
    return () => {
      cancelled = true
    }
  }, [index, keys])

  if (!resolved) return null
  if (resolved.keys === keys) return resolved.items
  const current = new Set(keys.map(encodeFavoriteKey))
  return resolved.items.filter((item) => current.has(encodeFavoriteKey(item.key)))
}
