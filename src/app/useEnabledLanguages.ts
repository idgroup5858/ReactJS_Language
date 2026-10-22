import { useMemo } from 'react'
import type { Language } from '@/domain/types'
import { useSettings } from '@/store/settingsStore'
import { useContentIndex } from './routeData'

/** Sozlamalarda yoqilgan va kontenti tayyor tillar — katalog tartibida. */
export function useEnabledLanguages(): Language[] {
  const index = useContentIndex()
  const { enabledLanguageIds } = useSettings()
  return useMemo(
    () => index.availableLanguages.filter((language) => enabledLanguageIds.includes(language.id)),
    [index, enabledLanguageIds],
  )
}
