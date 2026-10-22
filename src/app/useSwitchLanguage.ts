import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { selectLanguage } from '@/store/settingsStore'
import { useCurrentParams } from './routeData'

/**
 * Tilni almashtirish. Har bir tilning kitoblari va bo'limlari o'ziniki, shuning uchun kontent sahifasidan yangi tilning
 * bosh sahifasiga o'tiladi. Boshqa sahifalarda (qidiruv, sozlamalar...) faqat tanlanadi.
 */
export function useSwitchLanguage(): (languageId: string) => void {
  const navigate = useNavigate()
  const { lang } = useCurrentParams()

  return useCallback(
    (languageId: string) => {
      if (lang === undefined) selectLanguage(languageId)
      else navigate(`/${languageId}`)
    },
    [navigate, lang],
  )
}
