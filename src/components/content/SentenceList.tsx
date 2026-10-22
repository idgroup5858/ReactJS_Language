import type { Sentence } from '@/domain/types'
import InlineText from './InlineText'

/**
 * Gaplar ro'yxati: raqam, gap (**so'z shakli** aksent rangda) va o'zbekcha tarjima. Tarjima keng ekranda gap yonida,
 * telefonda yoki sozlamalarda "ostida" tanlansa — gap ostida turadi (global.css → `.sentence-row`).
 */
export default function SentenceList({ sentences }: { sentences: Sentence[] }) {
  return (
    <ol className="divide-y divide-neutral-200 rounded border border-neutral-200">
      {sentences.map((sentence, index) => (
        <li key={index} className="sentence-row px-3 py-2.5 transition-colors hover:bg-neutral-50 sm:px-4">
          <span className="sentence-number text-right text-xs font-semibold text-neutral-400 tabular-nums">{index + 1}</span>
          <p className="sentence-text font-medium text-neutral-900">
            <InlineText text={sentence.text} boldClassName="font-semibold text-brand-700" />
          </p>
          <p className="sentence-translation text-neutral-500">
            <InlineText text={sentence.translation} boldClassName="font-semibold text-neutral-700" />
          </p>
        </li>
      ))}
    </ol>
  )
}
