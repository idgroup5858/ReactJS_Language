import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import InlineText from '@/components/content/InlineText'
import ProgressBar from '@/components/ui/ProgressBar'
import type { Progress } from '@/domain/progress'
import type { TopicSummary } from '@/domain/types'

type Props = {
  to: string
  topic: TopicSummary
  progress: Progress
}

const PROGRESS_LABEL = "Dars bo'yicha o'zlashtirish"

function ComingSoon({ className }: { className: string }) {
  return <span className={`text-[11px] font-semibold tracking-[0.12em] text-neutral-400 uppercase ${className}`}>Tayyorlanmoqda</span>
}

/**
 * Dars qatori: chapda dars raqami, o'rtada nomi (o'rganilayotgan tilda) va o'zbekcha izoh, o'ngda o'zlashtirish
 * chizig'i va strelka. Telefonda chiziq izoh ostiga tushadi. Kontenti hali yo'q dars xira ko'rinadi.
 */
export default function TopicRow({ to, topic, progress }: Props) {
  return (
    <Link to={to} className="group flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-neutral-50">
      <span
        title={`${topic.number}-dars`}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums ${topic.ready ? 'bg-brand-50 text-brand-700' : 'bg-neutral-100 text-neutral-400'}`}
      >
        {topic.number}
      </span>
      <span className={`min-w-0 flex-1 ${topic.ready ? '' : 'opacity-70'}`}>
        <span className="line-clamp-2 text-sm font-semibold text-neutral-900 transition-colors group-hover:text-brand-700">{topic.title}</span>
        <span className="mt-0.5 line-clamp-2 text-xs leading-5 text-neutral-500">
          <InlineText text={topic.summary} />
        </span>
        {topic.ready ? (
          <ProgressBar progress={progress} label={PROGRESS_LABEL} showPercent className="mt-1.5 sm:hidden" />
        ) : (
          <ComingSoon className="mt-1 block sm:hidden" />
        )}
      </span>
      {topic.ready ? (
        <ProgressBar progress={progress} label={PROGRESS_LABEL} showPercent className="hidden w-32 shrink-0 sm:flex" />
      ) : (
        <ComingSoon className="hidden w-32 shrink-0 text-right sm:block" />
      )}
      <ChevronRight size={16} className="shrink-0 text-neutral-300 transition-colors group-hover:text-brand-700" />
    </Link>
  )
}
