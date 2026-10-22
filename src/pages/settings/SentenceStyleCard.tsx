import { Columns2, Rows2 } from 'lucide-react'
import SentenceList from '@/components/content/SentenceList'
import { Card, CardHeader } from '@/components/ui/Card'
import SegmentedControl, { type SegmentOption } from '@/components/ui/SegmentedControl'
import type { Sentence } from '@/domain/types'
import {
  MAX_SENTENCE_FONT_SIZE,
  MIN_SENTENCE_FONT_SIZE,
  setSentenceFontSize,
  setTranslationLayout,
  type TranslationLayout,
  useSettings,
} from '@/store/settingsStore'

const LAYOUTS: SegmentOption<TranslationLayout>[] = [
  { value: 'side', label: <><Columns2 size={14} /> Yonida</> },
  { value: 'below', label: <><Rows2 size={14} /> Ostida</> },
]

const PREVIEW: Sentence[] = [
  { text: 'Это мой **брат**, а это моя **сестра**.', translation: "Bu mening **akam**, bu esa mening **singlim**." },
  { text: 'Мы живём в **Ташкенте**.', translation: "Biz **Toshkentda** yashaymiz." },
]

/** Gaplar ko'rinishi: shrift o'lchami, tarjima joylashuvi va jonli namuna. */
export default function SentenceStyleCard() {
  const settings = useSettings()
  return (
    <Card>
      <CardHeader title="Gaplar ko'rinishi" hint="Barcha misollar va nazariyadagi gaplarga darhol qo'llanadi" />
      <div className="divide-y divide-neutral-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="sentence-font-size" className="text-sm text-neutral-800">
              Shrift o'lchami
            </label>
            <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-brand-700 tabular-nums">
              {settings.sentenceFontSize} px
            </span>
          </div>
          <input
            id="sentence-font-size"
            type="range"
            min={MIN_SENTENCE_FONT_SIZE}
            max={MAX_SENTENCE_FONT_SIZE}
            step={1}
            value={settings.sentenceFontSize}
            onChange={(event) => setSentenceFontSize(Number(event.target.value))}
            className="mt-3 w-full cursor-pointer"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="min-w-0">
            <span className="block text-sm text-neutral-800">Tarjima joylashuvi</span>
            <span className="block text-xs text-neutral-500">Telefonda tarjima doim gap ostida turadi</span>
          </span>
          <SegmentedControl label="Tarjima joylashuvi" options={LAYOUTS} value={settings.translationLayout} onChange={setTranslationLayout} />
        </div>
        <div className="space-y-2 px-4 py-4">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-neutral-500 uppercase">Ko'rinish namunasi</p>
          <SentenceList sentences={PREVIEW} />
        </div>
      </div>
    </Card>
  )
}
