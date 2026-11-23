import { useCountdown } from '../hooks/useCountdown'
import { useInView } from '../hooks/useInView'

export default function Countdown({ targetDate }: { targetDate: string }) {
  const { days, hours, minutes, seconds, passed } = useCountdown(targetDate)
  const ref = useInView<HTMLDivElement>()
  const items = [
    { value: days, label: 'Ngày' },
    { value: hours, label: 'Giờ' },
    { value: minutes, label: 'Phút' },
    { value: seconds, label: 'Giây' }
  ]
  return (
    <section className="inv-section">
      <div ref={ref} className="fade-in-section">
        {passed ? (
          <p className="count-note">Ngày trọng đại đã diễn ra — cảm ơn bạn đã đến chung vui cùng Trúc &amp; Yên ♥</p>
        ) : (
          <>
            <div className="count">
              {items.map((it) => (
                <div key={it.label} className="count-cell">
                  <p className="count-num">{String(it.value).padStart(2, '0')}</p>
                  <p className="count-lbl">{it.label}</p>
                </div>
              ))}
            </div>
            <p className="count-note">Đếm ngược đến ngày trọng đại</p>
          </>
        )}
      </div>
    </section>
  )
}
