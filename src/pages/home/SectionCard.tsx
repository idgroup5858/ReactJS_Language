import { ChevronRight, Clock, ListChecks, ListOrdered } from 'lucide-react'
import { Link } from 'react-router'
import Pill from '@/components/ui/Pill'
import ProgressBar from '@/components/ui/ProgressBar'
import { sectionUrl } from '@/data/contentIndex'
import { lessonRange, sectionTotals } from '@/domain/counts'
import type { Progress } from '@/domain/progress'
import type { Section } from '@/domain/types'
import { formatCount } from '@/lib/format'
import type { SectionLayout } from '@/store/settingsStore'
import { getSectionIcon } from './sectionIcons'

type Props = {
  languageId: string
  bookId: string
  section: Section
  /** kitobdagi o'rni (1 dan) */
  position: number
  layout: SectionLayout
  /** bo'lim bo'yicha tushunarli deb belgilangan misollar */
  progress: Progress
}

const PROGRESS_LABEL = "Bo'lim bo'yicha o'zlashtirish"

/**
 * Bo'lim kartochkasi (ReactJS_Recipe dagi CategoryCard): tartib raqami, nom, mavzuga mos rangli ikonka (bo'lsa),
 * qisqa izoh, darslar oralig'i, misollar soni va o'zlashtirish chizig'i. `list` ko'rinishida hammasi bitta qatorda;
 * telefonda sonlar va chiziq izoh ostiga tushadi. Hali kontenti yo'q bo'limda chiziq o'rniga "Tayyorlanmoqda".
 */
export default function SectionCard({ languageId, bookId, section, position, layout, progress }: Props) {
  const totals = sectionTotals(section)
  const lessons = `${lessonRange(section)}-darslar`
  const examples = totals.examples > 0 ? `${formatCount(totals.examples)} ta misol` : null
  const to = sectionUrl(languageId, bookId, section.id)

  const number = (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700 tabular-nums">
      {String(position).padStart(2, '0')}
    </span>
  )
  const title = (
    <span className="min-w-0 truncate text-sm font-semibold text-neutral-900 transition-colors group-hover:text-brand-700">
      {section.title}
    </span>
  )
  const sectionIcon = getSectionIcon(section.id)
  // o'ng chekka: mavzuga mos rangli ikonka va strelka
  const trailing = (
    <span className="flex shrink-0 items-center gap-2">
      {sectionIcon && <sectionIcon.icon size={20} strokeWidth={1.75} aria-hidden className={`shrink-0 ${sectionIcon.className}`} />}
      <ChevronRight size={16} className="shrink-0 text-neutral-300 transition-colors group-hover:text-brand-700" />
    </span>
  )
  const pills = (
    <>
      <Pill icon={ListOrdered}>{lessons}</Pill>
      {examples ? <Pill icon={ListChecks}>{examples}</Pill> : <Pill icon={Clock}>Tayyorlanmoqda</Pill>}
    </>
  )
  const bar = (className: string) =>
    progress.total > 0 ? <ProgressBar progress={progress} label={PROGRESS_LABEL} showPercent className={className} /> : null

  if (layout === 'list') {
    return (
      <Link to={to} className="group flex items-center gap-3 rounded border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-brand-200">
        {number}
        <div className="flex min-w-0 flex-1 flex-col">
          {title}
          <p className="truncate text-xs leading-5 text-neutral-500">{section.description}</p>
          <p className="text-[11px] leading-4 text-neutral-400 tabular-nums md:hidden">
            {lessons}
            {examples && ` · ${examples}`}
          </p>
          {bar('mt-1.5 sm:hidden')}
        </div>
        <div className="hidden shrink-0 gap-1.5 md:flex">{pills}</div>
        {bar('hidden w-32 shrink-0 sm:flex') ?? <span className="hidden w-32 shrink-0 sm:block" />}
        {trailing}
      </Link>
    )
  }

  return (
    <Link to={to} className="group flex flex-col gap-3 rounded border border-neutral-200 bg-white px-4 py-3.5 transition-colors hover:border-brand-200">
      <div className="flex items-center gap-3">
        {number}
        <span className="flex min-w-0 flex-1">{title}</span>
        {trailing}
      </div>
      <p className="line-clamp-2 min-h-10 text-xs leading-5 text-neutral-500">{section.description}</p>
      <div className="flex flex-wrap gap-1.5">{pills}</div>
      {bar('') ?? <div aria-hidden className="h-1.5 rounded-full bg-neutral-100" />}
    </Link>
  )
}
