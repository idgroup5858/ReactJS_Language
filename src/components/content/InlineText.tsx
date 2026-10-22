import { Fragment, useMemo } from 'react'
import { parseInlineMarkup, type MarkupSegment } from '@/lib/inlineMarkup'

const CHIP_CLASS = 'rounded bg-brand-50 px-1 py-px font-semibold tracking-normal text-brand-700 normal-case'
const DEFAULT_BOLD_CLASS = 'font-semibold text-neutral-900'

function renderSegment(segment: MarkupSegment, index: number, boldClassName: string) {
  switch (segment.kind) {
    case 'chip':
      return (
        <span key={index} className={CHIP_CLASS}>
          {segment.text}
        </span>
      )
    case 'bold':
      return (
        <strong key={index} className={boldClassName}>
          {(segment.children ?? [{ kind: 'text' as const, text: segment.text }]).map((child, childIndex) =>
            renderSegment(child, childIndex, boldClassName),
          )}
        </strong>
      )
    case 'text':
      return <Fragment key={index}>{segment.text}</Fragment>
  }
}

type Props = {
  text: string
  /** qalin matn klassi — gaplarda so'z shakli aksent rangda ajratiladi */
  boldClassName?: string
}

/** Kontent matni: `-а` — aksent rangli "chip" (qo'shimcha, so'z shakli), **matn** — qalin (ichida chip bo'lishi mumkin). */
export default function InlineText({ text, boldClassName = DEFAULT_BOLD_CLASS }: Props) {
  const segments = useMemo(() => parseInlineMarkup(text), [text])
  return segments.map((segment, index) => renderSegment(segment, index, boldClassName))
}
