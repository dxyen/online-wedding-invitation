import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import type { AlbumPhoto } from '../lib/types'
import { handleImgError } from '../lib/fallback'
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

  // Lightbox: phím ← / → chuyển ảnh, Esc đóng (như bản artifact).
  useEffect(() => {
    if (selected === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, photos.length])

  return (
    <section id="album" className="inv-section">
      <SectionHeading eyebrow="Album Ảnh Cưới" title="Khoảnh Khắc Của Chúng Mình" script />
      <p className="inv-quote">Yêu không phải là nhìn nhau, mà là cùng nhìn về một hướng.</p>
      <div ref={ref} className="fade-in-section album-grid">
        {photos.map((p, i) => (
          <button
            key={p.id ?? i}
            type="button"
            onClick={() => setSelected(i)}
            className={`album-tile${i % 6 === 0 || i % 6 === 3 ? ' album-tall' : ''}`}
            aria-label={`Xem ảnh ${i + 1}`}
          >
            <img src={p.imageUrl} alt={p.caption || `Ảnh cưới ${i + 1}`} loading="lazy" onError={(e) => handleImgError(e, i)} />
          </button>
        ))}
        {photos.length === 0 && <p className="count-note">Album đang được cập nhật.</p>}
      </div>
      <p className="album-note">Chạm vào ảnh để xem lớn</p>
      {current && selected !== null && (
        <div className="album-lightbox" onClick={close} role="dialog" aria-label="Xem ảnh lớn">
          <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img src={current.imageUrl} alt={current.caption || 'Ảnh cưới'} onError={(e) => handleImgError(e, selected)} />
            {current.caption && <p className="album-lb-cap">{current.caption}</p>}
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
