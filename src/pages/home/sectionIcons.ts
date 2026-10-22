import {
  BriefcaseBusiness,
  BusFront,
  Handshake,
  House,
  IdCard,
  type LucideIcon,
  MessagesSquare,
  ShoppingBag,
  Siren,
  Stethoscope,
  UserRound,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react'

export interface SectionIcon {
  icon: LucideIcon
  /** ikonka chizig'ining rangi; 500 tuslari qorong'i rejimda qayta belgilanmaydi — ikkala mavzuda bir xil */
  className: string
}

/**
 * Bo'lim kartochkasidagi rangli (to'ldirilmagan, faqat chiziqli) ikonka. Kalit — index.json dagi bo'lim id'si;
 * ro'yxatda yo'q bo'limda ikonka chiqmaydi.
 */
export const SECTION_ICONS: Readonly<Record<string, SectionIcon>> = {
  // Ruscha-o'zbekcha So'zlashgich
  'vezhlivoe-obshchenie': { icon: Handshake, className: 'text-amber-500' },
  'o-sebe': { icon: UserRound, className: 'text-sky-500' },
  'gorod-i-transport': { icon: BusFront, className: 'text-indigo-500' },
  zhilyo: { icon: House, className: 'text-lime-600' },
  eda: { icon: UtensilsCrossed, className: 'text-orange-500' },
  pokupki: { icon: ShoppingBag, className: 'text-pink-500' },
  'dengi-i-svyaz': { icon: Wallet, className: 'text-emerald-500' },
  zdorove: { icon: Stethoscope, className: 'text-cyan-500' },
  rabota: { icon: BriefcaseBusiness, className: 'text-violet-500' },
  'dokumenty-i-migratsiya': { icon: IdCard, className: 'text-teal-500' },
  obshchenie: { icon: MessagesSquare, className: 'text-blue-500' },
  'ekstrennye-situatsii': { icon: Siren, className: 'text-red-500' },
}

export function getSectionIcon(sectionId: string): SectionIcon | undefined {
  return Object.hasOwn(SECTION_ICONS, sectionId) ? SECTION_ICONS[sectionId] : undefined
}
