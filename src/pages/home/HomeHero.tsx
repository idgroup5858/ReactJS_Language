import { ArrowRight, Play, Search } from 'lucide-react'
import { Link } from 'react-router'
import LanguageLogo from '@/components/ui/LanguageLogo'
import ProgressBar from '@/components/ui/ProgressBar'
import { topicUrl, type TopicEntry } from '@/data/contentIndex'
import type { Totals } from '@/domain/counts'
import { type Progress, progressPercent } from '@/domain/progress'
import type { Language } from '@/domain/types'
import { formatCount } from '@/lib/format'
import HeroEmblem from './HeroEmblem'

type Props = {
  language: Language
  totals: Totals
  /** butun til bo'yicha tushunarli deb belgilangan misollar */
  progress: Progress
  /** "Davom ettirish" — hali tugatilmagan birinchi tayyor dars */
  next: TopicEntry | undefined
}

const buttonClass =
  'inline-flex h-8 items-center gap-2 rounded border border-(--hero-fg)/70 px-4 text-xs font-semibold transition-colors hover:bg-(--hero-fg)/10'

/**
 * Aksent rangli banner (ReactJS_Recipe dagi HomeHero): kengroq ekranda o'ng tomonda abstrakt emblema (HeroEmblem),
 * telefonda bayroq sarlavha yonida. Ranglari tilning o'z aksentidan (theme/languageAccents.ts) keladi.
 */
export default function HomeHero({ language, totals, progress, next }: Props) {
  const books = language.books.length === 1 ? language.books[0].title : `${language.books.length} ta kitob`
  return (
    <div className="bg-hero relative flex items-center justify-between gap-6 overflow-hidden rounded px-6 py-7 sm:px-8 dark:ring-1 dark:ring-white/10">
      {/* tor ekranda emblema orbitalari matn ostiga kiradi — matn ustida qoladi */}
      <div className="relative z-10 min-w-0">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-(--hero-fg)/60 uppercase">
          {books} · {formatCount(totals.topics)} dars
        </p>
        <div className="mt-6 flex items-center gap-3">
          {/* bg-[#fff]: qorong'i rejimda .bg-white yuza rangiga almashadi, doira esa doim oq bo'lishi kerak */}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff] ring-2 ring-(--hero-fg)/20 sm:hidden">
            <LanguageLogo key={language.id} language={language} size={24} />
          </span>
          <h1 className="text-2xl font-bold">{language.name}</h1>
        </div>
        <p className="mt-1 max-w-xl text-sm text-(--hero-fg)/70">{language.description}</p>
        {progress.total > 0 && (
          <div className="mt-5 max-w-sm">
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="font-semibold">O'zlashtirildi</span>
              <span className="text-(--hero-fg)/70 tabular-nums">
                {formatCount(progress.done)} / {formatCount(progress.total)} misol · {progressPercent(progress)}%
              </span>
            </div>
            <ProgressBar progress={progress} label={`${language.name} bo'yicha o'zlashtirish`} tone="hero" className="mt-1.5" />
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {next && (
            <Link to={topicUrl(next)} title={`${next.topic.number}-dars: ${next.topic.title}`} className={`${buttonClass} bg-(--hero-fg)/10`}>
              <Play size={13} />
              {progress.done > 0 ? 'Davom ettirish' : 'Boshlash'}
              <span className="hidden font-normal text-(--hero-fg)/70 sm:inline">· {next.topic.number}-dars</span>
              <ArrowRight size={14} />
            </Link>
          )}
          <Link to="/search" className={buttonClass}>
            <Search size={13} />
            Qidirish
          </Link>
        </div>
      </div>

      <HeroEmblem language={language} />
    </div>
  )
}
