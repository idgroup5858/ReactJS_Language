// themeInit.ts orqali vite.config.ts ham import qiladi (Node muhitida), shuning uchun import kengaytma bilan yozilgan
import type { AccentColors } from './accents.ts'

/**
 * Har bir tilning o'z aksenti: "Tanlangan til rangi" yoqilganda (standart) til almashtirilsa, bosh sahifa banneri va
 * butun brand-* palitrasi shu tilning rangiga o'tadi. Kalit — index.json dagi til id'si. Ro'yxatda yo'q til
 * sozlamalardagi asosiy rangda ko'rinadi.
 */
export const LANGUAGE_ACCENTS: Readonly<Record<string, AccentColors>> = {
  // rus bayrog'idagi ko'k (#0039a6); banner shu ko'kning to'qroq tusidan boshlanadi
  rus: { color: '#0039a6', ink: '#8ab0ff', fillDark: '#2353c2', heroFrom: '#002874', heroTo: '#0039a6' },
  // Britaniya bayrog'idagi qizil (#c8102e) — Murphy'ning "qizil kitobi" ham shu rangda
  eng: { color: '#c8102e', ink: '#ff9aa6', fillDark: '#d9354d', heroFrom: '#8c0a20', heroTo: '#c8102e' },
}

export function getLanguageAccent(languageId: string): AccentColors | undefined {
  return Object.hasOwn(LANGUAGE_ACCENTS, languageId) ? LANGUAGE_ACCENTS[languageId] : undefined
}

/**
 * `/:lang/...` manzilidagi til (ranglari bor bo'lsa); qidiruv, sozlamalar kabi sahifalarda — undefined.
 * [base] — sayt ochiladigan yo'l (`/` yoki boshqa), u manzil boshidan olib tashlanadi.
 */
export function languageIdFromPath(pathname: string, base = '/'): string | undefined {
  const relative = pathname.startsWith(base) ? pathname.slice(base.length - 1) : pathname
  const segment = relative.split('/')[1] ?? ''
  return getLanguageAccent(segment) ? segment : undefined
}
