import type { Example, Sentence } from '@/domain/types'
import { plainText } from '@/lib/inlineMarkup'

/** Nusxalash uchun: "1. Это мой дом. — Bu mening uyim." */
export function sentencesText(sentences: Sentence[]): string {
  return sentences.map((sentence, index) => `${index + 1}. ${plainText(sentence.text)} — ${plainText(sentence.translation)}`).join('\n')
}

/** Ulashiladigan matn: misol nomi, izohi va gaplar tarjimasi bilan. */
export function exampleShareText(example: Example): string {
  const parts = [plainText(example.title)]
  if (example.description) parts.push(plainText(example.description))
  parts.push(sentencesText(example.sentences))
  return parts.join('\n\n')
}
