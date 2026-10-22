import { Card, CardHeader } from '@/components/ui/Card'
import { MAX_SEARCH_RESULTS, type SearchResult } from '@/data/searchIndex'
import SearchResultRow from './SearchResultRow'

function resultKey(result: SearchResult): string {
  const topic = `${result.entry.book.id}/${result.entry.topic.id}`
  return result.kind === 'topic' ? `t/${topic}` : `e/${topic}/${result.example.id}`
}

function ResultGroup({ title, results }: { title: string; results: SearchResult[] }) {
  return (
    <Card>
      <CardHeader title={title} />
      <ul className="divide-y divide-neutral-200">
        {results.map((result) => (
          <li key={resultKey(result)}>
            <SearchResultRow result={result} />
          </li>
        ))}
      </ul>
    </Card>
  )
}

/** Natijalar ikki guruhda: avval mavzular, keyin misollar. */
export default function SearchResults({ results }: { results: SearchResult[] }) {
  const topics = results.filter((result) => result.kind === 'topic')
  const examples = results.filter((result) => result.kind === 'example')
  const isTruncated = results.length >= MAX_SEARCH_RESULTS

  return (
    <div className="space-y-4">
      {topics.length > 0 && <ResultGroup title={`Mavzular (${topics.length})`} results={topics} />}
      {examples.length > 0 && <ResultGroup title={`Misollar (${examples.length})`} results={examples} />}
      {isTruncated && (
        <p className="text-center text-xs text-neutral-500">
          Faqat birinchi {MAX_SEARCH_RESULTS} ta natija ko'rsatildi — so'rovni aniqroq yozing.
        </p>
      )}
    </div>
  )
}
