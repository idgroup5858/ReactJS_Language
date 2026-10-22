/**
 * Tillarning bayroqlari. Fayl nomi index.json dagi til id'si bilan bir xil, shuning uchun yangi til bayrog'i shu
 * papkaga `<id>.svg` qilib qo'shilsa, o'zi ulanadi.
 */
const files = import.meta.glob<string>('./*.svg', { eager: true, query: '?url', import: 'default' })

export const LANGUAGE_LOGOS: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.replace(/^\.\/|\.svg$/g, ''), url]),
)
