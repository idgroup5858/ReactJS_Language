# Til Darslari — ReactJS_Language

Chet tillarni o'zbek tilida, darsma-dars o'rganish uchun veb-ilova. Hozircha ikki til:

- **Rus tili** — **"Rus tili Grammatikasi"** (13 bo'lim, 108 dars, `/rus`) va **"Ruscha-o'zbekcha So'zlashgich"**
  (12 bo'lim, 58 mavzu, `/rus/sozlashgich`);
- **Ingliz tili** — Raymond Murphy kitoblari tartibida: **"Essential Grammar in Use"** (qizil kitob, 115 unit + 7 ilova,
  `/eng`) va **"English Grammar in Use"** (ko'k kitob, 145 unit + 7 ilova, `/eng/intermediate`). Tushuntirishlar va
  misol gaplar o'zimizniki — kitoblardan ko'chirilmagan.

- **Dars** — avval chuqur nazariya (o'zbekcha), keyin misollar: har bir misolda ~10 ta ruscha gap o'zbekcha tarjimasi bilan;
- **Progress** — har bir misolni "Tushunarli" deb belgilash; dars, bo'lim va til bo'yicha foiz (localStorage);
- **Dizayn** — `ReactJS_Recipe` uslubi (o'sha tokenlar, sidebar + sticky header, kartochkalar, qorong'i rejim), asosiy rang —
  rus bayrog'idagi ko'k `#0039a6`; sozlamalarda 16 xil palitradan boshqasini tanlash mumkin.

Stek: React 19, Vite 8, TypeScript 6, Tailwind CSS 4, react-router 8, lucide-react, SweetAlert2. Backend yo'q.

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5175
npm run build      # dist/ — statik fayllar
npm run preview
npm run lint
```

## Kontent

```
public/data/index.json                  tillar → kitoblar → bo'limlar → mavzular (tartib = dars raqami)
public/data/<til>/<kitob>/<mavzu>.json  mavzu kontenti (nazariya + misollar); fayl yo'q bo'lsa — "Tayyorlanmoqda"
```

```bash
npm run content:check   # format va sifat tekshiruvi (xato bo'lsa exit 1)
node scripts/content.mjs check <mavzu-id> ...   # faqat shu darslar (index.json sanoqlarisiz)
npm run content:sync    # tekshiradi va index.json dagi ready / exampleCount / sentenceCount ni yangilaydi
npm run content:stats   # bo'limlar bo'yicha hajm
```

Dars yozish standarti (nazariya chuqurligi, misollar soni, gaplar sifati, atamalar, ko'p qismli darslar rejasi) —
[CONTENT_GUIDE.md](CONTENT_GUIDE.md). To'liq format — `scripts/content.mjs` boshida va `src/domain/types.ts` da. Qisqacha:

- nazariya bloklari: `heading`, `paragraph`, `list`, `note` (`info` / `tip` / `warning`), `table`, `sentences`;
- misol: `{ "id": "ex1", "title", "description"?, "sentences": [{ "text": "<ruscha>", "translation": "<o'zbekcha>" }] }`;
- belgilash: `**so'z**` — qalin (gapda — so'z shakli aksent rangda), `` `-а` `` — qo'shimcha "chip";
- o'zbekcha tutuq belgisi — oddiy `'` (backtick belgilash uchun band).

### Kengaytirish

| Nima | Qanday |
| --- | --- |
| Darsni yozish | `public/data/<til>/<kitob>/<mavzu id>.json` yaratish → `npm run content:sync` |
| Yangi misol | mavzu faylida `examples` oxiriga keyingi id bilan (`ex12`); mavjud id boshqa misolga berilmaydi |
| Yangi dars | `index.json` da kerakli bo'limga mavzu qo'shish (raqamlar o'zi suriladi) + kontent fayli |
| Yangi kitob | `index.json` → tilning `books` ga kitob; bosh sahifa va sidebar o'zi ko'rsatadi |
| Yangi til | `index.json` ga til, `src/assets/languages/<id>.svg` bayroq, `src/theme/languageAccents.ts` ga rang |

"Tushunarli" belgilari va sevimlilar `til|kitob|mavzu|misol` kaliti bilan saqlanadi — bo'lim kalitda yo'q, shuning uchun
darsni boshqa bo'limga ko'chirish progressni buzmaydi. Mavzu id'si kitob ichida noyob bo'lishi shart.

## Tuzilma

```
src/
  app/          router, loader'lar, route ma'lumotlari
  assets/languages/  tillarning bayroqlari — fayl nomi = til id'si
  components/
    layout/     sidebar, header, tillar paneli (telefonda — ochiladigan menyu)
    content/    nazariya bloklari, gaplar ro'yxati
    ui/         kartochka, sarlavha, pill, tugmalar, switch, qidiruv maydoni
  data/         JSON yuklash va kesh, indeks (dars raqamlari), qidiruv
  domain/       kontent modellari, sanoqlar, progress
  pages/        home, section, topic, search, favorites, settings
  store/        sozlamalar, sevimlilar, "tushunarli" belgilari (localStorage)
  theme/        aksent ranglar, mavzuni qo'llash, birinchi chizishdan oldingi skript
  styles/       global.css — dizayn tokenlari (ReactJS_Recipe dan) + gaplar ko'rinishi
```

## Sahifalar

| Manzil | Sahifa |
| --- | --- |
| `/` | oxirgi tanlangan tilga yo'naltiradi |
| `/:til` | banner ("Davom ettirish"), ko'rsatkichlar, kitoblar va bo'limlar |
| `/:til/:kitob/:bolim` | bo'lim darslari |
| `/:til/:kitob/:bolim/:mavzu#ex5` | dars (ixtiyoriy ravishda aniq misolgacha) |
| `/search?q=` | qidiruv (`Ctrl+K` yoki `/`) — gap va tarjima matni bo'yicha, "ё" = "е" |
| `/favorites` | sevimli misollar |
| `/settings?tab=` | tillar, ko'rinish (mavzu, rang, gaplar shrifti va tarjima joylashuvi), ilova haqida |

Ilova bitta sahifali (SPA): serverda noma'lum manzillar `index.html` ga qaytarilishi kerak (nginx: `try_files $uri /index.html;`).
