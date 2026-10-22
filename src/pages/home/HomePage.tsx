import { LayoutGrid, List } from 'lucide-react'
import { useParams } from 'react-router'
import { useContentIndex, useLanguageData } from '@/app/routeData'
import SectionTitle from '@/components/ui/SectionTitle'
import SegmentedControl, { type SegmentOption } from '@/components/ui/SegmentedControl'
import { bookTotals } from '@/domain/counts'
import { bookProgress, sectionProgress, topicProgress } from '@/domain/progress'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { useFavoriteCount } from '@/store/favoritesStore'
import { useLearnedIndex } from '@/store/learnedStore'
import { type SectionLayout, setSectionLayout, useSettings } from '@/store/settingsStore'
import BookTabs from './BookTabs'
import HomeHero from './HomeHero'
import HomeStats from './HomeStats'
import SectionCard from './SectionCard'

const LAYOUTS: SegmentOption<SectionLayout>[] = [
  { value: 'grid', label: <LayoutGrid size={14} />, title: 'Kartochkalar' },
  { value: 'list', label: <List size={14} />, title: "Ro'yxat" },
]

/**
 * Kitobning bosh sahifasi: kitoblar tablari (bir nechta bo'lsa), banner, ko'rsatkichlar va bo'limlar o'rganish tartibida.
 * `/:lang` da — tilning birinchi kitobi, `/:lang/:bookId` da — shu kitob (noma'lum id'ni loader qaytaradi).
 */
export default function HomePage() {
  const { language } = useLanguageData()
  const { bookId } = useParams()
  const book = language.books.find((item) => item.id === bookId) ?? language.books[0]
  const index = useContentIndex()
  const favoriteCount = useFavoriteCount()
  const learned = useLearnedIndex()
  const { sectionLayout } = useSettings()
  useDocumentTitle(book.title)

  const totals = bookTotals(book)
  // "Davom ettirish": shu kitobda dars tartibida hali to'liq belgilanmagan birinchi tayyor mavzu
  const next = index.bookTopics(language.id, book.id).find(({ topic }) => {
    if (!topic.ready) return false
    const progress = topicProgress(learned, language.id, book.id, topic)
    return progress.done < progress.total
  })

  return (
    <div className="space-y-6">
      {language.books.length > 1 && <BookTabs language={language} activeBookId={book.id} />}
      <HomeHero language={language} book={book} totals={totals} progress={bookProgress(learned, language.id, book)} next={next} />
      <HomeStats totals={totals} favoriteCount={favoriteCount} />

      <section>
        <SectionTitle
          actions={<SegmentedControl label="Bo'limlar ko'rinishi" options={LAYOUTS} value={sectionLayout} onChange={setSectionLayout} />}
        >
          Bo'limlar
        </SectionTitle>
        <div className={sectionLayout === 'list' ? 'flex flex-col gap-2' : 'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'}>
          {book.sections.map((section, position) => (
            <SectionCard
              key={section.id}
              languageId={language.id}
              bookId={book.id}
              section={section}
              position={position + 1}
              layout={sectionLayout}
              progress={sectionProgress(learned, language.id, book.id, section)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
