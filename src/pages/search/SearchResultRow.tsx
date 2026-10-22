import { ChevronRight, Lightbulb, MessageSquareText } from 'lucide-react'
import { Link } from 'react-router'
import { topicUrl } from '@/data/contentIndex'
import type { SearchResult } from '@/data/searchIndex'
import { plainText } from '@/lib/inlineMarkup'

/** Natija manzili: misol bo'lsa `#ex5` bilan — mavzu ochilganda o'sha misolga o'tiladi. */
function resultUrl(result: SearchResult): string {
  const url = topicUrl(result.entry)
  return result.kind === 'example' ? `${url}#${result.example.id}` : url
}

/** Qidiruv natijasi: mavzu — chiroqcha, misol — gaplar belgisi; ostida joylashuvi. */
export default function SearchResultRow({ result }: { result: SearchResult }) {
  const { section, topic } = result.entry
  const isTopic = result.kind === 'topic'
  const title = isTopic ? topic.title : plainText(result.example.title)
  const subtitle = isTopic ? `${topic.number}-dars · ${section.title}` : `${topic.number}-dars · ${topic.title}`

  return (
    <Link to={resultUrl(result)} className="group flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-neutral-50">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isTopic ? 'bg-brand-50 text-brand-700' : 'bg-emerald-50 text-emerald-700'}`}
      >
        {isTopic ? <Lightbulb size={17} /> : <MessageSquareText size={17} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-neutral-900 transition-colors group-hover:text-brand-700">{title}</span>
        <span className="block truncate text-xs text-neutral-500">{subtitle}</span>
      </span>
      <ChevronRight size={16} className="shrink-0 text-neutral-300 transition-colors group-hover:text-brand-700" />
    </Link>
  )
}
