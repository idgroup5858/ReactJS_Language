import { BookOpen, CircleCheck, ListChecks, ListTodo, MessageSquareText, RotateCcw, Star } from 'lucide-react'
import { Link } from 'react-router'
import InlineText from '@/components/content/InlineText'
import { Card } from '@/components/ui/Card'
import Pill from '@/components/ui/Pill'
import ProgressBar from '@/components/ui/ProgressBar'
import { sectionUrl, type TopicEntry } from '@/data/contentIndex'
import type { TopicContent } from '@/domain/types'
import { formatCount } from '@/lib/format'
import AppSwal from '@/lib/swal'

type Props = {
  entry: TopicEntry
  /** null — mavzu hali tayyorlanmoqda */
  content: TopicContent | null
  favoriteCount: number
  learnedCount: number
  /** mavzudagi barcha misollarni belgilash (true) yoki belgilarni olib tashlash (false) */
  onSetAllLearned: (learned: boolean) => void
}

/**
 * Mavzu boshi: bo'lim nomi (havola) va dars raqami, sarlavha, o'zbekcha qisqa izoh, o'zlashtirish chizig'i va
 * "hammasini belgilash" tugmasi — avvaldan bilgan mavzuni bir bosishda yopish uchun.
 */
export default function TopicHeader({ entry, content, favoriteCount, learnedCount, onSetAllLearned }: Props) {
  const { language, book, section, topic } = entry
  const total = content?.examples.length ?? 0
  const allLearned = total > 0 && learnedCount >= total

  const toggleAll = async () => {
    if (!allLearned) return onSetAllLearned(true)
    // ko'p belgini tasodifan o'chirib yubormaslik uchun so'raymiz
    const result = await AppSwal.fire({
      icon: 'warning',
      title: 'Belgilarni olib tashlash',
      text: `"${topic.title}" mavzusidagi ${formatCount(total)} ta misolning "tushunarli" belgisi olib tashlanadi.`,
      showCancelButton: true,
      confirmButtonText: 'Olib tashlash',
    })
    if (result.isConfirmed) onSetAllLearned(false)
  }

  return (
    <Card className="px-5 py-5 sm:px-6">
      <p className="text-[11px] font-semibold tracking-[0.16em] uppercase">
        <Link to={sectionUrl(language.id, book.id, section.id)} className="text-brand-700 transition-colors hover:text-brand-900">
          {section.title}
        </Link>
        <span className="text-neutral-400"> · {topic.number}-dars</span>
      </p>
      <h1 className="mt-2 text-2xl font-bold text-neutral-900 [overflow-wrap:anywhere]">{topic.title}</h1>
      <p className="mt-1.5 text-sm leading-6 text-neutral-500">
        <InlineText text={topic.summary} />
      </p>
      {content && (
        <div className="mt-4 flex flex-wrap gap-2">
          {content.blocks.length > 0 && <Pill icon={BookOpen}>Nazariya</Pill>}
          <Pill icon={ListChecks}>{formatCount(total)} ta misol</Pill>
          <Pill icon={MessageSquareText}>{formatCount(topic.sentenceCount)} ta gap</Pill>
          {total > 0 && (
            <Pill icon={CircleCheck}>
              {formatCount(learnedCount)} / {formatCount(total)} tushunarli
            </Pill>
          )}
          {favoriteCount > 0 && <Pill icon={Star}>{formatCount(favoriteCount)} ta sevimli</Pill>}
        </div>
      )}
      {total > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2.5">
          <ProgressBar progress={{ done: learnedCount, total }} label="Dars bo'yicha o'zlashtirish" showPercent className="min-w-48 flex-1" />
          <button
            type="button"
            onClick={toggleAll}
            className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded border px-3 text-xs font-semibold transition-colors ${
              allLearned
                ? 'border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-900'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-700'
            }`}
          >
            {allLearned ? <RotateCcw size={14} /> : <ListTodo size={14} />}
            {allLearned ? 'Belgilarni olib tashlash' : 'Hammasini tushunarli deb belgilash'}
          </button>
        </div>
      )}
    </Card>
  )
}
