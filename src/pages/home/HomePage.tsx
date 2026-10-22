import { LayoutGrid, List } from 'lucide-react'
import { useContentIndex, useLanguageData } from '@/app/routeData'
import SectionTitle from '@/components/ui/SectionTitle'
import SegmentedControl, { type SegmentOption } from '@/components/ui/SegmentedControl'
import { languageTotals } from '@/domain/counts'
import { languageProgress, sectionProgress, topicProgress } from '@/domain/progress'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { useFavoriteCount } from '@/store/favoritesStore'
import { useLearnedIndex } from '@/store/learnedStore'
import { type SectionLayout, setSectionLayout, useSettings } from '@/store/settingsStore'
import HomeHero from './HomeHero'
import HomeStats from './HomeStats'
import SectionCard from './SectionCard'

const LAYOUTS: SegmentOption<SectionLayout>[] = [
  { value: 'grid', label: <LayoutGrid size={14} />, title: 'Kartochkalar' },
  { value: 'list', label: <List size={14} />, title: "Ro'yxat" },
]

/** Tilning bosh sahifasi: banner, ko'rsatkichlar va har bir kitobning bo'limlari o'rganish tartibida. */
export default function HomePage() {
  const { language } = useLanguageData()
  const index = useContentIndex()
  const favoriteCount = useFavoriteCount()
  const learned = useLearnedIndex()
  const { sectionLayout } = useSettings()
  useDocumentTitle(language.name)

  const totals = languageTotals(language)
  // "Davom ettirish": dars tartibida hali to'liq belgilanmagan birinchi tayyor mavzu
  const next = index
    .languageTopics(language.id)
    .find(({ book, topic }) => {
      if (!topic.ready) return false
      const progress = topicProgress(learned, language.id, book.id, topic)
      return progress.done < progress.total
    })

  return (
    <div className="space-y-6">
      <HomeHero language={language} totals={totals} progress={languageProgress(learned, language)} next={next} />
      <HomeStats totals={totals} favoriteCount={favoriteCount} />

      {language.books.map((book, bookIndex) => (
        <section key={book.id}>
          <SectionTitle
            actions={
              bookIndex === 0 && (
                <SegmentedControl label="Bo'limlar ko'rinishi" options={LAYOUTS} value={sectionLayout} onChange={setSectionLayout} />
              )
            }
          >
            {book.title}
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
      ))}
    </div>
  )
}
