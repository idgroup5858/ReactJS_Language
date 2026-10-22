import InlineText from './InlineText'

type Props = {
  headers: string[]
  rows: string[][]
}

/** Jadval (qo'shimchalar, shakllar, taqqoslash) — tor ekranda gorizontal skroll qilinadi. */
export default function TableBlock({ headers, rows }: Props) {
  return (
    <div className="overflow-hidden rounded border border-neutral-200">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="min-w-[120px] px-4 py-2.5 align-bottom text-[11px] font-semibold tracking-[0.12em] text-neutral-500 uppercase"
                >
                  <InlineText text={header} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="align-top transition-colors hover:bg-neutral-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2.5 leading-6 text-neutral-800">
                    <InlineText text={cell} boldClassName="font-semibold text-brand-700" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
