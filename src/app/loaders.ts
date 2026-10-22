import { redirect, type LoaderFunctionArgs } from 'react-router'
import { sectionUrl, topicUrl, type ContentIndex } from '@/data/contentIndex'
import { loadIndex, loadTopic } from '@/data/contentRepository'
import { configureLanguages, settingsStore } from '@/store/settingsStore'

/*
 * Route loader'lari: sahifa chizilishidan oldin kerakli kontentni tayyorlaydi. Kitob, bo'lim yoki mavzu topilmasa,
 * tilning bosh sahifasiga qaytariladi. Loader'lar parallel ishlaydi, shuning uchun har biri indeksni o'zi kutadi.
 */

let configuredIndex: ContentIndex | undefined

/** Indeks + til sozlamalarini tekshirish (bir marta). */
async function contentIndex(): Promise<ContentIndex> {
  const index = await loadIndex()
  if (configuredIndex !== index) {
    configuredIndex = index
    configureLanguages(index.availableLanguages.map((language) => language.id))
  }
  return index
}

export async function rootLoader() {
  return { index: await contentIndex() }
}

/** `/` — oxirgi tanlangan til sahifasiga. */
export async function homeRedirectLoader() {
  await contentIndex()
  return redirect(`/${settingsStore.get().selectedLanguageId}`)
}

export async function languageLoader({ params }: LoaderFunctionArgs) {
  const language = (await contentIndex()).language(params.lang)
  if (!language?.isAvailable) throw redirect('/')
  return { language }
}

/** `/:lang/:bookId` — kitoblar tilning bosh sahifasida ko'rsatiladi, alohida sahifasi yo'q. */
export async function bookRedirectLoader({ params }: LoaderFunctionArgs) {
  return redirect(`/${params.lang}`)
}

export async function sectionLoader({ params }: LoaderFunctionArgs) {
  const index = await contentIndex()
  const book = index.book(params.lang, params.bookId)
  const section = index.section(params.lang, params.bookId, params.sectionId)
  if (!book || !section) throw redirect(`/${params.lang}`)
  return { book, section }
}

/**
 * Mavzu: indeksdagi joylashuvi va kontenti. Kontenti hali tayyor bo'lmagan mavzuda `content` — null
 * (sahifa "Tayyorlanmoqda" holatini ko'rsatadi). Mavzu boshqa bo'limga ko'chirilgan bo'lsa, yangi manziliga o'tiladi.
 */
export async function topicLoader({ params }: LoaderFunctionArgs) {
  const { lang = '', bookId = '', sectionId = '', topicId = '' } = params
  const entry = (await contentIndex()).topic(lang, bookId, topicId)
  if (!entry) {
    const index = await contentIndex()
    throw redirect(index.section(lang, bookId, sectionId) ? sectionUrl(lang, bookId, sectionId) : `/${lang}`)
  }
  if (entry.section.id !== sectionId) throw redirect(topicUrl(entry))
  const content = entry.topic.ready ? await loadTopic(lang, bookId, topicId) : null
  return { entry, content }
}

export type RootData = Awaited<ReturnType<typeof rootLoader>>
export type LanguageData = Awaited<ReturnType<typeof languageLoader>>
export type SectionData = Awaited<ReturnType<typeof sectionLoader>>
export type TopicData = Awaited<ReturnType<typeof topicLoader>>
