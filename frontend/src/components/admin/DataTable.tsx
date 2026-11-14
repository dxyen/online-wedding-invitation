export interface Column<T> { key: string; label: string; render: (row: T) => React.ReactNode }

export default function DataTable<T>({ columns, rows, emptyText = 'Chưa có dữ liệu.' }: { columns: Column<T>[]; rows: T[]; emptyText?: string }) {
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-brown/70">{emptyText}</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-brown/10 text-brown/60">
            {columns.map((c) => <th key={c.key} className="px-3 py-2 font-medium">{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-brown/5 align-top">
              {columns.map((c) => <td key={c.key} className="px-3 py-2.5">{c.render(row)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
