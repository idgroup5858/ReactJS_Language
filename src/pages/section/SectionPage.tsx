import { CircleCheck, ListChecks, ListOrdered } from 'lucide-react'
import { useLanguageData, useSectionData } from '@/app/routeData'
import BackLink from '@/components/ui/BackLink'
import { Card } from '@/components/ui/Card'
import PageHeader from '@/components/ui/PageHeader'
import Pill from '@/components/ui/Pill'
import { topicUrl } from '@/data/contentIndex'
import { lessonRange, sectionTotals } from '@/domain/counts'
import { progressPercent, sectionProgress, topicProgress } from '@/domain/progress'
import { formatCount } from '@/lib/format'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { useLearnedIndex } from '@/store/learnedStore'
import TopicRow from './TopicRow'

/** Bo'lim: qisqa izoh va darslar ro'yxati o'zlashtirish chiziqlari bilan (ReactJS_Recipe dagi CategoryPage). */
export default function SectionPage() {
  const { language } = useLanguageData()
  const { book, section } = useSectionData()
  const learned = useLearnedIndex()
  useDocumentTitle(`${section.title} · ${language.name}`)

  const totals = sectionTotals(section)
  const progress = sectionProgress(learned, language.id, book.id, section)

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <BackLink to={`/${language.id}`} label={book.title} />
      <PageHeader
        title={section.title}
        description={section.description}
        actions={
          <>
            <Pill icon={ListOrdered}>{lessonRange(section)}-darslar</Pill>
            {totals.examples > 0 && <Pill icon={ListChecks}>{formatCount(totals.examples)} ta misol</Pill>}
            {progress.total > 0 && (
              <Pill icon={CircleCheck}>
                {formatCount(progress.done)} tushunarli · {progressPercent(progress)}%
              </Pill>
            )}
          </>
        }
      />
      <Card>
        <ul className="divide-y divide-neutral-200">
          {section.topics.map((topic) => (
            <li key={topic.id}>
              <TopicRow
                to={topicUrl({ language, book, section, topic })}
                topic={topic}
                progress={topicProgress(learned, language.id, book.id, topic)}
              />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
