# Kontent yo'riqnomasi — "Rus tili grammatikasi"

Bu fayl har bir dars (mavzu) kontentini yozish uchun yagona standart. Namunalar:
`public/data/rus/grammatika/alfavit-i-rod.json` va `prityazhatelnye-mestoimeniya.json` (format namunasi; yangi darslar
ulardan **chuqurroq** va **ko'proq misolli** bo'lishi kerak — pastdagi talablarga qarang).

O'quvchi — rus tilini o'rganayotgan o'zbek tilida so'zlashuvchi (boshlang'ichdan o'rta darajagacha). Darslar ketma-ket
o'tiladi: har bir dars oldingilariga tayanadi.

## 1. Fayl

- Yo'l: `public/data/rus/grammatika/<mavzu-id>.json`, `<mavzu-id>` — `public/data/index.json` dagi `id`.
- To'liq format — `scripts/content.mjs` boshidagi izoh va `src/domain/types.ts`.
- Yaroqli JSON, UTF-8, izohsiz. Matn ichidagi qo'shtirnoq — `«...»` (ruscha) yoki `\"...\"`.
- `index.json`, kod va boshqa darslarga **tegmang**. `npm run content:sync` ni ishga tushirmang (uni koordinator oxirida
  bir marta ishga tushiradi). Tekshiruv: `node scripts/content.mjs check <mavzu-id>` → **0 xato, 0 ogohlantirish**.

## 2. Til va sarlavhalar

| Joy | Til |
| --- | --- |
| Dars nomi (`index.json` → `title`) | ruscha (o'zgartirmang) |
| Misol nomi (`examples[].title`) | **ruscha**, qisqa (≤ 60 belgi): «Мужской род: `-й` на конце», «Глагол **идти**: настоящее время» |
| Misol izohi (`description`) | o'zbekcha, 1–3 gap: aynan qaysi qoida ko'rsatilayotgani |
| Nazariya (`heading`, `paragraph`, `list`, `note`, jadval sarlavhalari) | o'zbekcha (lotin), ichida ruscha so'z va misollar |
| Gap (`text`) | ruscha |
| Tarjima (`translation`) | o'zbekcha (lotin) |

O'zbekcha imlo: lotin yozuvi, `o'`, `g'`, `sh`, `ch`, `ng`; tutuq belgisi — oddiy apostrof `'` (backtick ``` ` ``` belgilash
uchun band). Urg'u belgilari (´) ishlatilmaydi (faqat fonetika nazariyasida zarur bo'lsa). Transliteratsiya yozilmaydi.

## 3. Nazariya — chuqur va to'liq

Nazariya darsning asosiy qismi. U o'qituvchi tushuntirgandek batafsil bo'lishi kerak: o'quvchi kitob yoki ustozsiz faqat
shu matndan mavzuni to'liq tushunsin. Tuzilmasi (har bir darsga moslab):

1. **Kirish** — bu qanday hodisa, nega kerak, o'zbek tilida qanday ifodalanadi (taqqoslash), qaysi savolga javob beradi.
2. **Har bir qoida alohida** — `heading` → tushuntirish (`paragraph`) → barcha shakllar jadvali (`table`) →
   2–4 gaplik `sentences` bloki. Qoidani "nega shunday" bilan tushuntiring, faqat sanab o'tmang.
3. **Istisnolar** — to'liq ro'yxat, eng ko'p uchraydiganlari misol bilan.
4. **O'zbeklarning tipik xatolari** — `note` (`warning`): xato shakl va to'g'ri shakl, sababi bilan.
5. **Eslab qolish usullari** — `note` (`tip`).
6. **Oldingi darslar bilan bog'lanish** — kerak bo'lsa, qaysi darsda nima o'tilganini eslatib, yangisi bilan farqini ko'rsating.
7. **Xulosa** — oxirida `heading` "Xulosa" va umumlashtiruvchi jadval yoki ro'yxat.

Hajm mo'ljali: **35–70 blok**, kamida **3 ta jadval** (mavzuga mos bo'lsa) va kamida **5 ta `sentences` bloki**.
Paragraflar mazmunli bo'lsin (2–5 gap), "suv" emas.

## 4. Misollar — iloji boricha ko'p

- Har bir darsda **15–20 ta misol** (takrorlash darslarida ~20 ta).
- Har bir misolda **aynan 10 ta gap** (`text` + `translation`).
- Har bir misol bitta aniq kichik qoida / shakl / so'z guruhini ko'rsatadi. Tartib — oddiydan murakkabga; oxirgi 2–3 misol
  aralash (mustahkamlash).
- Misol id'lari `ex1`, `ex2`, ... ketma-ket.
- Suhbat darslari (Знакомство, Разговор...): misol — 10 qatorli dialog, har bir qator `— ` bilan boshlanadi.

## 5. Gaplar sifati

- Grammatik jihatdan to'g'ri, tabiiy, zamonaviy ruscha. Shubhali shakl ishlatmang.
- 3–14 so'z. Boshlang'ich darslarda (1–16) qisqa va sodda.
- Hali o'tilmagan grammatikaga tayanmang; o'tilmagan kelishik faqat turg'un iboralarda: дома, на работе, в школе,
  в Ташкенте, у меня есть.
- Leksika xilma-xil va kundalik: oila, uy, o'qish, ish, shahar, ovqat, ob-havo, sayohat, do'kon, sport.
  O'zbek va rus ismlari, shaharlari aralash (Анвар, Малика, Бобур, Нигора; Анна, Иван; Ташкент, Самарканд, Москва).
- Bitta dars ichida takroriy gap bo'lmasin.
- `**qalin**` — ruscha gapda o'rganilayotgan shakl (so'z yoki birikma); tarjimada unga mos keladigan o'zbekcha so'z(lar).
  Har bir gapda kamida bitta qalin joy bo'lsin.
- Tarjima tabiiy o'zbekcha (so'zma-so'z emas), ma'nosi aniq mos.

### 5.1. Xilma-xillik va murakkablik (foydalanuvchining alohida talabi)

Gaplar **bir qolipda takrorlanib, haddan tashqari oson bo'lib ketmasin**. Yomon namuna (shunday qilmang):
«Это стол. Он большой.» / «Это дом. Он новый.» / «Это город. Он красивый.» — bitta qolip, faqat so'z almashgan.

- **Har bir gap — o'z qolipi.** Bir misolning 10 ta gapi turli tuzilishda bo'lsin: darak, so'roq, undov, inkor; qisqa javobli
  savol; ikki qismli gap (bog'lovchi bilan: и, а, но, потому что, когда, если...); kichik vaziyat (kim, qayerda, nima uchun).
- Bir misolda bir xil **birinchi so'z** bilan boshlanadigan gaplar ko'pi bilan **3 ta**, bir xil **ikki so'z** bilan —
  ko'pi bilan **2 ta**; butun darsda bir xil ikki so'zli boshlanish — ko'pi bilan **6 ta**.
- **Murakkablik zinapoyasi** (har bir misolda): 2–3 ta sodda gap → 4–5 ta o'rtacha (7–12 so'z) → 2–3 ta murakkabroq
  (qo'shma gap, kontekst, sabab/natija, taqqoslash). O'rtacha uzunlik: 1–16-darslarda kamida **5 so'z**, keyin kamida **6 so'z**.
- Boshlang'ich darslarda ham gaplar real hayotdan bo'lsin: «Мой **брат** работает в банке, а **сестра** учится в университете.»
  — «Это брат.» dan ko'ra foydaliroq.
- Leksika takrorlanmasin: har bir misolda yangi so'zlar va mavzu (oila, ish, o'qish, shahar, sayohat, ovqat, sport, ob-havo,
  do'kon, shifoxona, bayram...). Bir xil so'z (masalan, стол, дом, книга) darsda haddan tashqari ko'p kelmasin.
- Boshqa darslardagi gaplarni aynan takrorlamang (tekshiruv ogohlantiradi).
- Tekshiruv bu qoidalarni avtomatik tekshiradi (`node scripts/content.mjs check <id>`): ogohlantirish bo'lsa — gaplarni
  qayta yozing, faqat so'zni almashtirish yetmaydi.

## 6. Belgilash

- `**...**` — qalin (gapda va jadvalda aksent rangda).
- `` `-ой` `` — qo'shimcha, old qo'shimcha yoki so'z bo'lagi uchun "chip" (nazariya, izoh va jadvallarda).
- `**` va backtick juft bo'lishi shart.

## 7. Atamalar (bir xil ishlatilsin)

| Ruscha | O'zbekcha |
| --- | --- |
| род: мужской / женский / средний | rod: erkak / ayol / o'rta rod |
| число: единственное / множественное | birlik / ko'plik |
| падеж | kelishik |
| именительный | bosh kelishik |
| родительный | qaratqich kelishigi |
| дательный | jo'nalish kelishigi |
| винительный | tushum kelishigi |
| творительный | vosita kelishigi |
| предложный | o'rin-payt kelishigi |
| окончание / основа / приставка / суффикс | qo'shimcha / o'zak / old qo'shimcha / suffiks |
| предлог / союз / частица | predlog / bog'lovchi / yuklama |
| одушевлённый / неодушевлённый | jonli / jonsiz |
| имя прилагательное / числительное / наречие | sifat / son / ravish |
| местоимение: личное / притяжательное | olmosh: kishilik / egalik |
| неопределённое / отрицательное местоимение | gumon / bo'lishsizlik olmoshi |
| глагол, спряжение (I, II) | fe'l, tuslanish (I, II) |
| совершенный вид (СВ) / несовершенный вид (НСВ) | tugallangan tur (СВ) / tugallanmagan tur (НСВ) |
| инфинитив | infinitiv (noaniq shakl) |
| повелительное наклонение | buyruq mayli |
| возвратный глагол | qaytim fe'l |
| глаголы движения: однонаправленные / разнонаправленные | harakat fe'llari: bir yo'nalishli / ko'p yo'nalishli |
| причастие / страдательное причастие / деепричастие | sifatdosh / majhul sifatdosh / ravishdosh |
| прямая / косвенная речь | ko'chirma / o'zlashtirma gap |
| сложное предложение | qo'shma gap |

## 8. Ko'p qismli darslar rejasi

Bir mavzu bir necha darsga bo'lingan joylarda qoidalar shunday taqsimlanadi (bir-birini takrorlamasin):

**Вид глагола (17–21)**
- 17 — tushuncha: СВ/НСВ, juftlarning yasalishi (old qo'shimcha: делать — сделать; suffiks: решать — решить,
  давать — дать; boshqa o'zak: говорить — сказать, брать — взять), zamonlar bilan bog'liqligi.
- 18 — 1-qoida: jarayon / fakt (НСВ) va natija (СВ). 2-qoida: takroriy, odatiy harakat (НСВ: каждый день, всегда, часто,
  обычно) va bir martalik tugallangan harakat (СВ: однажды, вчера вечером, наконец).
- 19 — 3-qoida: davomiylik (НСВ: долго, весь день, два часа) va muddat ichida natija (СВ: за час, за неделю).
  4-qoida: bir vaqtdagi harakatlar (НСВ + НСВ), ketma-ket harakatlar (СВ + СВ), fon + to'satdan harakat (НСВ + СВ).
- 20 — 5-qoida: kelasi zamon — буду + НСВ (jarayon, takror) va СВ kelasi zamoni (natija, bir martalik).
  6-qoida: infinitiv — начинать / продолжать / заканчивать / перестать / привыкнуть / устать / надоесть dan keyin faqat НСВ;
  успеть / удаться / забыть dan keyin СВ.
- 21 — 7-qoida: inkor va buyruq — не надо / не нужно / нельзя (taqiq) + НСВ, нельзя (imkonsiz) + СВ; buyruq maylida НСВ
  (taklif, jarayon) va СВ (bir martalik iltimos); не + НСВ (taqiq) va не + СВ (ogohlantirish: не упади!). Oxirida 7 qoidaning
  umumiy jadvali.

**Возвратные глаголы (23–27)** — `-ся` (undoshdan keyin) / `-сь` (unlidan keyin)
- 23 — 1-qoida: o'zlik ma'nosi — harakat o'ziga qaratiladi (= себя): умываться, одеваться, бриться, причёсываться;
  `-ся` yasalishi va tuslanishi.
- 24 — 2-qoida: birgalik ma'nosi — bir-biriga (= друг друга): встречаться, знакомиться, видеться, обниматься,
  переписываться, мириться.
- 25 — 3-qoida: `-ся` siz ishlatilmaydigan fe'llar va his-tuyg'u fe'llari: смеяться, бояться, надеяться, нравиться,
  улыбаться, стараться; boshqaruvi: радоваться / удивляться + jo'nalish (радоваться подарку),
  интересоваться / заниматься + vosita (заниматься спортом).
- 26 — 4-qoida: majhul ma'no (Здесь продаются билеты; Дом строится) va shaxssiz ma'no (мне не спится, хочется).
- 27 — 5-qoida: o'timli fe'l → o'timsiz (narsa o'zi): начинать — начинаться, открывать — открываться, кончать — кончаться,
  возвращать — возвращаться, учить — учиться. Oxirida 5 qoidaning umumiy jadvali.

**Фонетика (33–34)**
- 33 — unlilar, urg'u, urg'usiz unlilar (аканье: молоко, иканье: язык), `ё` doim urg'uli, qattiq/yumshoq qatorlar.
- 34 — undoshlar: jarangli/jarangsiz juftlar, so'z oxirida jarangsizlanish (хлеб, город), qo'shni undosh ta'siri
  (лодка, вокзал), qattiq/yumshoq, doim qattiq (ж, ш, ц) va doim yumshoq (ч, щ, й), `ь` va `ъ`.

**Takrorlash darslari** (7, 32, 40, 47, 54, 62, 63, 83): o'tilgan barcha qoidalarning to'liq jadvallari, tipik xatolar
ro'yxati va ~20 ta aralash misol.

## 9. Mavjud darsni boyitish

Mavjud misollarning id'lari va mazmuni saqlanadi (o'quvchilarning "Tushunarli" belgilari shu id'larga bog'langan). Matnni
yaxshilash mumkin, lekin `ex3` boshqa qoidaga aylanmasin. Yangi misollar oxiriga keyingi id bilan (`ex12`, `ex13`, ...).
