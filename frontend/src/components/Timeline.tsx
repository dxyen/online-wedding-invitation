import { useInView } from '../hooks/useInView'
import type { TimelineItem } from '../lib/types'
import SectionHeading from './SectionHeading'

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const ref = useInView<HTMLDivElement>()
  return (
    <section id="story" className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading eyebrow="Our Love Story" title="Câu Chuyện Tình Yêu" subtitle="Những cột mốc đã đưa Thanh Trúc & Xuân Yên đến với nhau." />
      <div ref={ref} className="fade-in-section relative ml-4 border-l-2 border-gold/50 pl-6 md:ml-0">
        {items.map((item, i) => (
          <div key={item.id ?? i} className="relative mb-10">
            <span className="absolute -left-[33px] flex h-4 w-4 items-center justify-center rounded-full bg-gold ring-4 ring-cream">♥</span>
            <div className="card">
              <p className="text-xs font-semibold tracking-widest text-gold">{item.date}</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-brown-dark">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brown/80">{item.description}</p>
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" className="mt-4 h-48 w-full rounded-xl object-cover" />}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-brown/70">Câu chuyện tình yêu đang được cập nhật.</p>}
      </div>
    </section>
  )
}
