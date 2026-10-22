import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { buildThemeInitScript } from './src/theme/themeInit.ts'

/**
 * Saqlangan mavzu, asosiy rang va matn sozlamalarini birinchi chizishdan oldin <html> ga qo'yadi,
 * shunda sahifa standart ranglarda "lip" etib ko'rinmaydi (ReactJS_Recipe dagi theme-init bilan bir xil yondashuv).
 */
function themeInit(base: string): Plugin {
  return {
    name: 'language-theme-init',
    // index.html dagi belgining o'rniga — <meta charset> dan keyin, CSS va JS dan oldin
    transformIndexHtml: (html) => html.replace('<!--theme-init-->', `<script>${buildThemeInitScript(base)}</script>`),
  }
}

/** Sayt ochiladigan yo'l. Odatda `/`; boshqa joyga (masalan GitHub Pages) qo'yilganda `BASE_PATH` orqali beriladi. */
const base = process.env.BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), themeInit(base)],
  // 5173 — ReactJS_Recipe, 5174 — ReactJS_HR_System
  server: { port: 5175 },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
