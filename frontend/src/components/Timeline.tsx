import { useInView } from '../hooks/useInView'
import type { TimelineItem } from '../lib/types'
import SectionHeading from './SectionHeading'

// Câu chuyện tình yêu — dữ liệu giữ nguyên (API/fallback), chỉ đổi
// giao diện theo timeline của bản artifact (cột thời gian, chấm tròn, đường kẻ).
export default function Timeline({ items }: { items: TimelineItem[] }) {
  const ref = useInView<HTMLDivElement>()
  return (
    <section id="story" className="inv-section">
      <SectionHeading eyebrow="Our Love Story" title="Câu Chuyện Tình Yêu" subtitle="Những cột mốc đã đưa Thanh Trúc & Xuân Yên đến với nhau." />
      <div ref={ref} className="fade-in-section tl">
        {items.map((item, i) => (
          <div key={item.id ?? i} className="tl-row">
            <p className="tl-time">{item.date}</p>
            <span className="tl-dot" aria-hidden="true" />
            <div className="tl-body">
              <b>{item.title}</b>
              <span>{item.description}</span>
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" className="tl-img" />}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="count-note">Câu chuyện tình yêu đang được cập nhật.</p>}
      </div>
    </section>
  )
}
