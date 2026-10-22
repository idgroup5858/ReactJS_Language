import { Link } from 'react-router'
import { bookUrl } from '@/data/contentIndex'
import type { Language } from '@/domain/types'

/**
 * Tilning kitoblari orasida o'tish (kitob ikkita va undan ko'p bo'lsa). Ko'rinishi SegmentedControl dagidek, lekin
 * havolalar: tanlangan kitob manzilda turadi (`/rus/sozlashgich`), uni ulashish va orqaga qaytish mumkin.
 */
export default function BookTabs({ language, activeBookId }: { language: Language; activeBookId: string }) {
  return (
    <nav aria-label="Kitoblar" className="inline-flex h-9 max-w-full items-center gap-1 overflow-x-auto rounded bg-neutral-200/70 p-1">
      {language.books.map((book) => {
        const active = book.id === activeBookId
        return (
          <Link
            key={book.id}
            to={bookUrl(language, book.id)}
            aria-current={active ? 'page' : undefined}
            className={`flex h-7 shrink-0 items-center rounded px-3 text-xs font-semibold whitespace-nowrap transition-colors ${active ? 'bg-white text-brand-700' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            {book.title}
          </Link>
        )
      })}
    </nav>
  )
}
