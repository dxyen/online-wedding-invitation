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
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div ref={ref} className="fade-in-section card text-center">
        <p className="font-hand text-3xl text-gold">Đếm ngược đến ngày hạnh phúc</p>
        {passed ? (
          <p className="mt-4 font-display text-2xl text-brown-dark">Ngày cưới đã đến — chúc mừng hai bạn!</p>
        ) : (
          <div className="mt-6 grid grid-cols-4 gap-3 md:gap-6">
            {items.map((it) => (
              <div key={it.label} className="rounded-2xl bg-cream-dark px-2 py-4">
                <p className="font-display text-3xl font-semibold text-brown-dark md:text-5xl">{String(it.value).padStart(2, '0')}</p>
                <p className="mt-1 text-xs tracking-widest text-brown/70 md:text-sm">{it.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
