import { createBrowserRouter, type RouteObject } from 'react-router'
import AppLayout from '@/components/layout/AppLayout'
import AppLoading from '@/components/layout/AppLoading'
import LanguageScope from '@/components/layout/LanguageScope'
import { sectionUrl } from '@/data/contentIndex'
import NotFoundPage from '@/pages/errors/NotFoundPage'
import RootError from '@/pages/errors/RootError'
import RouteError from '@/pages/errors/RouteError'
import FavoritesPage from '@/pages/favorites/FavoritesPage'
import HomePage from '@/pages/home/HomePage'
import SearchPage from '@/pages/search/SearchPage'
import SectionPage from '@/pages/section/SectionPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import TopicPage from '@/pages/topic/TopicPage'
import {
  bookLoader,
  homeRedirectLoader,
  languageLoader,
  rootLoader,
  sectionLoader,
  topicLoader,
  type BookData,
  type LanguageData,
  type SectionData,
  type TopicData,
} from './loaders'
import { LANGUAGE_ROUTE_ID, ROOT_ROUTE_ID } from './routeData'
import { crumbsHandle } from './routeHandle'

/**
 * Sahifalar:
 *
 *   /                                        → oxirgi tanlangan til
 *   /:lang                                   → birinchi kitob (grammatika) bo'limlari
 *   /:lang/:bookId                           → boshqa kitob bo'limlari (birinchi kitob → /:lang ga)
 *   /:lang/:bookId/:sectionId                → bo'lim mavzulari (darslar)
 *   /:lang/:bookId/:sectionId/:topicId#ex5   → mavzu (ixtiyoriy ravishda aniq misolgacha)
 *   /search?q=  /favorites  /settings?tab=
 *
 * Hammasi vite `base` ichida — loader'lardagi `redirect('/...')` ham shunga moslanadi.
 */
const routes: RouteObject[] = [
  {
    id: ROOT_ROUTE_ID,
    path: '/',
    loader: rootLoader,
    Component: AppLayout,
    HydrateFallback: AppLoading,
    ErrorBoundary: RootError,
    children: [
      // har doim yo'naltiradi — o'zi hech narsa chizmaydi
      { index: true, loader: homeRedirectLoader, element: null },
      { path: 'search', Component: SearchPage, handle: crumbsHandle(() => [{ label: 'Qidiruv' }]) },
      { path: 'favorites', Component: FavoritesPage, handle: crumbsHandle(() => [{ label: 'Sevimlilar' }]) },
      { path: 'settings', Component: SettingsPage, handle: crumbsHandle(() => [{ label: 'Sozlamalar' }]) },
      {
        id: LANGUAGE_ROUTE_ID,
        path: ':lang',
        loader: languageLoader,
        Component: LanguageScope,
        ErrorBoundary: RouteError,
        handle: crumbsHandle<LanguageData>((data) => (data ? [{ label: data.language.name, to: `/${data.language.id}` }] : [])),
        children: [
          { index: true, Component: HomePage },
          {
            path: ':bookId',
            loader: bookLoader,
            Component: HomePage,
            handle: crumbsHandle<BookData>((data) => (data ? [{ label: data.book.title }] : [])),
          },
          {
            path: ':bookId/:sectionId',
            loader: sectionLoader,
            Component: SectionPage,
            handle: crumbsHandle<SectionData>((data) => (data ? [{ label: data.section.title }] : [])),
          },
          {
            path: ':bookId/:sectionId/:topicId',
            loader: topicLoader,
            Component: TopicPage,
            handle: crumbsHandle<TopicData>((data) => {
              if (!data) return []
              const { language, book, section, topic } = data.entry
              return [{ label: section.title, to: sectionUrl(language.id, book.id, section.id) }, { label: topic.title }]
            }),
          },
        ],
      },
      { path: '*', Component: NotFoundPage, handle: crumbsHandle(() => [{ label: 'Sahifa topilmadi' }]) },
    ],
  },
]

export const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/+$/, '') || '/' })
