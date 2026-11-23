import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import type { AlbumPhoto } from '../lib/types'
import SectionHeading from './SectionHeading'

// Album 2 cột kiểu artifact: ảnh thứ 1 và thứ 4 cao gấp đôi (.tall),
// lightbox nền nâu đậm với nút Trước / Đóng / Sau.
export default function AlbumGallery({ photos }: { photos: AlbumPhoto[] }) {
  const ref = useInView<HTMLDivElement>()
  const [selected, setSelected] = useState<number | null>(null)
  const close = () => setSelected(null)
  const prev = () => setSelected((s) => (s === null ? s : (s - 1 + photos.length) % photos.length))
  const next = () => setSelected((s) => (s === null ? s : (s + 1) % photos.length))
  const current = selected !== null ? photos[selected] : null
  return (
    <section id="album" className="inv-section">
      <SectionHeading eyebrow="Album Ảnh" title="Khoảnh Khắc Của Chúng Tôi" subtitle="Những bức ảnh ghi lại hành trình yêu thương của Thanh Trúc & Xuân Yên." />
      <div ref={ref} className="fade-in-section album-grid">
        {photos.map((p, i) => (
          <button
            key={p.id ?? i}
            type="button"
            onClick={() => setSelected(i)}
            className={`album-tile${i % 4 === 0 || i % 4 === 3 ? ' album-tall' : ''}`}
            aria-label={`Xem ảnh ${i + 1}`}
          >
            <img src={p.imageUrl} alt={p.caption || `Ảnh cưới ${i + 1}`} loading="lazy" />
          </button>
        ))}
        {photos.length === 0 && <p className="count-note">Album đang được cập nhật.</p>}
      </div>
      {current && selected !== null && (
        <div className="album-lightbox" onClick={close} role="dialog" aria-label="Xem ảnh lớn">
          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img src={current.imageUrl} alt={current.caption || 'Ảnh cưới'} />
            {current.caption && <p className="text-center text-sm text-white">{current.caption}</p>}
            <div className="flex items-center gap-3">
              <button type="button" onClick={prev} className="album-lb-btn" aria-label="Ảnh trước">← Trước</button>
              <button type="button" onClick={close} className="album-lb-btn">Đóng ✕</button>
              <button type="button" onClick={next} className="album-lb-btn" aria-label="Ảnh sau">Sau →</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
