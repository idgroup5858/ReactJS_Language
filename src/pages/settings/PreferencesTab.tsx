import AccentCard from './AccentCard'
import ProgressCard from './ProgressCard'
import SentenceStyleCard from './SentenceStyleCard'
import ThemeCard from './ThemeCard'

/** Ko'rinish sozlamalari va o'zlashtirish progressi. O'zgarishlar darhol qo'llanadi. */
export default function PreferencesTab() {
  return (
    <div className="space-y-4">
      <ThemeCard />
      <AccentCard />
      <SentenceStyleCard />
      <ProgressCard />
    </div>
  )
}
