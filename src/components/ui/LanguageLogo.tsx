import { LANGUAGE_LOGOS } from '@/assets/languages/logos'
import type { Language } from '@/domain/types'
import LanguageBadge from './LanguageBadge'

type Props = {
  language: Pick<Language, 'id' | 'shortLabel' | 'brandColor'>
  size?: number
  dimmed?: boolean
}

/** Tilning bayrog'i (`assets/languages/<id>.svg`); fayli bo'lmasa — harfli belgi (LanguageBadge). */
export default function LanguageLogo({ language, size = 20, dimmed = false }: Props) {
  const url = LANGUAGE_LOGOS[language.id]
  if (!url) return <LanguageBadge language={language} size={size} dimmed={dimmed} />

  return (
    <img
      src={url}
      alt=""
      aria-hidden
      width={size}
      height={size}
      draggable={false}
      className={`shrink-0 object-contain select-none ${dimmed ? 'opacity-40 grayscale' : ''}`}
    />
  )
}
