import { useInView } from '../hooks/useInView'
import SectionHeading from './SectionHeading'

// Lịch tháng 12/2026, đánh dấu ngày 27 (Chủ Nhật).
export default function CalendarMonth() {
  const ref = useInView<HTMLDivElement>()
  const daysInMonth = 31
  // 01/12/2026 là thứ Ba -> offset 1 nếu tuần bắt đầu thứ Hai.
  const offset = 1
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)
  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <SectionHeading eyebrow="Save the Date" title="Tháng 12 / 2026" subtitle="Chủ Nhật, ngày 27 tháng 12 năm 2026 — ngày chúng tôi nên duyên vợ chồng." />
      <div ref={ref} className="fade-in-section card">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-brown/60">
          {weekdays.map((d) => <div key={d} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {cells.map((day, i) =>
            day === null ? (
              <div key={i} className="py-3" />
            ) : day === 27 ? (
              <div key={i} className="relative rounded-full bg-brown py-3 font-display text-lg font-bold text-cream shadow-md">
                {day}
                <span className="absolute -top-1 -right-1 text-gold">♥</span>
              </div>
            ) : (
              <div key={i} className="rounded-full py-3 text-sm text-brown-dark hover:bg-cream-dark">{day}</div>
            )
          )}
        </div>
        <p className="mt-4 text-center font-hand text-2xl text-gold">Save the Date — 27.12.2026</p>
      </div>
    </section>
  )
}
