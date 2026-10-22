import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { useContentIndex } from '@/app/routeData'
import { topicUrl, type TopicEntry } from '@/data/contentIndex'

type PagerLinkProps = {
  entry: TopicEntry
  isNext: boolean
}

function PagerLink({ entry, isNext }: PagerLinkProps) {
  const Icon = isNext ? ChevronRight : ChevronLeft
  return (
    // joriy dars almashtiriladi — tarixda darslar to'planib qolmaydi
    <Link
      to={topicUrl(entry)}
      replace
      className={`group flex min-w-0 items-center gap-3 rounded border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-brand-200 ${isNext ? 'flex-row-reverse text-right sm:col-start-2' : ''}`}
    >
      <Icon size={18} className="shrink-0 text-neutral-400 transition-colors group-hover:text-brand-700" />
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold tracking-[0.14em] text-neutral-500 uppercase">
          {isNext ? 'Keyingi dars' : 'Oldingi dars'} · {entry.topic.number}
        </span>
        <span className="block truncate text-sm font-semibold text-neutral-900 transition-colors group-hover:text-brand-700">
          {entry.topic.title}
        </span>
      </span>
    </Link>
  )
}

/** Kitob ichidagi oldingi / keyingi darsga o'tish — bo'limlar chegarasidan ham o'tadi (darslar ketma-ket). */
export default function TopicPager({ entry }: { entry: TopicEntry }) {
  const topics = useContentIndex().bookTopics(entry.language.id, entry.book.id)
  const index = topics.findIndex((item) => item.topic.id === entry.topic.id)
  const previous = topics[index - 1]
  const next = topics[index + 1]
  if (!previous && !next) return null

  return (
    <nav aria-label="Darslar" className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
      {previous && <PagerLink entry={previous} isNext={false} />}
      {next && <PagerLink entry={next} isNext />}
    </nav>
  )
}
