import { Clock } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { useTopicData } from '@/app/routeData'
import BackLink from '@/components/ui/BackLink'
import EmptyState from '@/components/ui/EmptyState'
import SectionTitle from '@/components/ui/SectionTitle'
import { sectionUrl } from '@/data/contentIndex'
import type { Example } from '@/domain/types'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { toggleFavorite, useTopicFavoriteIds } from '@/store/favoritesStore'
import { setTopicLearned, toggleLearned, useTopicLearnedIds } from '@/store/learnedStore'
import ExampleCard from './ExampleCard'
import TheoryCard, { THEORY_SECTION_ID } from './TheoryCard'
import TopicHeader from './TopicHeader'
import TopicOutline from './TopicOutline'
import TopicPager from './TopicPager'
import { useVisibleSection } from './useVisibleSection'

const NO_EXAMPLES: Example[] = []

/**
 * Mavzu (dars) sahifasi: avval nazariya, keyin misollar, oxirida oldingi/keyingi dars.
 * `#ex5` kabi manzil bilan ochilsa (qidiruv, sevimlilar) o'sha misolga o'tiladi — buni ScrollRestoration bajaradi.
 */
export default function TopicPage() {
  const { entry, content } = useTopicData()
  const { language, book, section, topic } = entry
  useDocumentTitle(`${topic.title} · ${language.name}`)

  const favoriteIds = useTopicFavoriteIds(language.id, book.id, topic.id)
  const onToggleFavorite = useCallback(
    (exampleId: string) => toggleFavorite({ languageId: language.id, bookId: book.id, topicId: topic.id, exampleId }),
    [language.id, book.id, topic.id],
  )
  const learnedIds = useTopicLearnedIds(language.id, book.id, topic.id)
  const onToggleLearned = useCallback(
    (exampleId: string) => toggleLearned({ languageId: language.id, bookId: book.id, topicId: topic.id, exampleId }),
    [language.id, book.id, topic.id],
  )

  const examples = content?.examples ?? NO_EXAMPLES
  // kontentda yo'q (eski) id'lar hisobga olinmaydi
  const learnedCount = examples.filter((example) => learnedIds.has(example.id)).length
  const onSetAllLearned = (learned: boolean) =>
    setTopicLearned(
      language.id,
      book.id,
      topic.id,
      examples.map((example) => example.id),
      learned,
    )

  const hasTheory = (content?.blocks.length ?? 0) > 0
  const sectionIds = useMemo(
    () => [...(hasTheory ? [THEORY_SECTION_ID] : []), ...examples.map((example) => example.id)],
    [hasTheory, examples],
  )
  const activeSectionId = useVisibleSection(sectionIds)

  return (
    <div className="mx-auto flex max-w-[1240px] items-start gap-6">
      <article className="min-w-0 flex-1 space-y-5">
        <BackLink to={sectionUrl(language.id, book.id, section.id)} label={section.title} />
        <TopicHeader
          entry={entry}
          content={content}
          favoriteCount={favoriteIds.size}
          learnedCount={learnedCount}
          onSetAllLearned={onSetAllLearned}
        />

        {!content && (
          <EmptyState
            icon={Clock}
            title="Bu dars tayyorlanmoqda"
            message="Nazariya va misollar tez orada qo'shiladi. Hozircha boshqa darslarni o'rganishingiz mumkin."
          />
        )}
        {content && hasTheory && <TheoryCard blocks={content.blocks} />}

        {examples.length > 0 && (
          <section>
            <SectionTitle>Misollar ({examples.length})</SectionTitle>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <ExampleCard
                  key={example.id}
                  number={index + 1}
                  example={example}
                  isFavorite={favoriteIds.has(example.id)}
                  onToggleFavorite={onToggleFavorite}
                  isLearned={learnedIds.has(example.id)}
                  onToggleLearned={onToggleLearned}
                />
              ))}
            </div>
          </section>
        )}

        <TopicPager entry={entry} />
      </article>

      {examples.length > 0 && <TopicOutline examples={examples} hasTheory={hasTheory} activeId={activeSectionId} learnedIds={learnedIds} />}
    </div>
  )
}
