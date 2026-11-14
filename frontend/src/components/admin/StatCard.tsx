export default function StatCard({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="card">
      <p className="text-sm text-brown/70">{label}</p>
      <p className="mt-1 font-display text-4xl font-semibold text-brown-dark">{value}</p>
      {hint && <p className="mt-1 text-xs text-brown/60">{hint}</p>}
    </div>
  )
}
