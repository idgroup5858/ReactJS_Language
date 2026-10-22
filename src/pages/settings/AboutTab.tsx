import { Languages } from 'lucide-react'
import { APP_NAME, APP_VERSION } from '@/app/appInfo'
import { useContentIndex } from '@/app/routeData'
import { Card } from '@/components/ui/Card'
import LanguageLogo from '@/components/ui/LanguageLogo'
import { languageTotals } from '@/domain/counts'
import { formatCount } from '@/lib/format'

/** Ilova haqida + har bir tilning hajmi. */
export default function AboutTab() {
  const { availableLanguages } = useContentIndex()

  return (
    <Card className="px-6 py-8">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <Languages size={32} />
        </span>
        <h2 className="mt-4 text-lg font-bold text-neutral-900">{APP_NAME}</h2>
        <p className="mt-1 text-sm text-neutral-500">Versiya {APP_VERSION}</p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-neutral-700">
          Chet tillarni o'zbek tilida, darsma-dars o'rganish uchun qo'llanma. Har bir darsda avval qoida batafsil
          tushuntiriladi, so'ng mavzuga oid gaplar o'zbekcha tarjimasi bilan beriladi.
        </p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-neutral-700">
          Tushungan misolingizni "Tushunarli" deb belgilang — har bir dars, bo'lim va til bo'yicha o'zlashtirish shu
          belgilardan hisoblanadi.
        </p>
      </div>

      <ul className="mx-auto mt-6 max-w-lg divide-y divide-neutral-200 rounded border border-neutral-200">
        {availableLanguages.map((language) => {
          const totals = languageTotals(language)
          return (
            <li key={language.id} className="flex items-center gap-3 px-4 py-2.5">
              <LanguageLogo language={language} size={26} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900">{language.name}</span>
              <span className="shrink-0 text-xs text-neutral-500 tabular-nums">
                {totals.topics} dars · {formatCount(totals.examples)} misol · {formatCount(totals.sentences)} gap
              </span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
