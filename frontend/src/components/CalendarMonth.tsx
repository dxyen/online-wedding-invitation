import { useInView } from '../hooks/useInView'

// Lịch tháng 12/2026, đánh dấu ngày 27 (Chủ Nhật) bằng trái tim đỏ —
// hiển thị trong mục Lời Mời, ngay trước thẻ sự kiện (như bản artifact).
export default function CalendarMonth() {
  const ref = useInView<HTMLDivElement>()
  const daysInMonth = 31
  // 01/12/2026 là thứ Ba -> offset 1 nếu tuần bắt đầu thứ Hai.
  const offset = 1
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)
  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  return (
    <div ref={ref} className="fade-in-section cal">
      <p className="cal-month">THÁNG 12 · 2026</p>
      <div className="cal-grid">
        {weekdays.map((d) => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <div key={i} className="cal-day cal-day-dim" />
          ) : day === 27 ? (
            <div key={i} className="cal-day cal-wed">
              <span className="cal-heart" aria-hidden="true">♥</span>
              <b>{day}</b>
            </div>
          ) : (
            <div key={i} className="cal-day">{day}</div>
          )
        )}
      </div>
      <p className="cal-note">♥ Chủ Nhật, ngày 27 tháng 12 năm 2026</p>
    </div>
  )
}
