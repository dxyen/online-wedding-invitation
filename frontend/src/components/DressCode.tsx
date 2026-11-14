import { useInView } from '../hooks/useInView'
import SectionHeading from './SectionHeading'

const COLORS = [
  { name: 'Xanh lá', hex: '#5B7A5A' },
  { name: 'Be', hex: '#D9C7A7' },
  { name: 'Kem', hex: '#F5EEE3' },
  { name: 'Nâu', hex: '#6B4F3A' }
]

export default function DressCode() {
  const ref = useInView<HTMLDivElement>()
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading eyebrow="Dress Code" title="Trang Phục" subtitle="Để bức ảnh chung thêm hài hòa, bạn có thể chọn trang phục theo các tông màu dưới đây. Không bắt buộc — chỉ là gợi ý yêu thương." />
      <div ref={ref} className="fade-in-section flex flex-wrap justify-center gap-4">
        {COLORS.map((c) => (
          <div key={c.name} className="card flex w-36 flex-col items-center text-center">
            <span className="h-14 w-14 rounded-full border border-brown/20 shadow-inner" style={{ backgroundColor: c.hex }} />
            <p className="mt-3 text-sm font-semibold text-brown-dark">{c.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
