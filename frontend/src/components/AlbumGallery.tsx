import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import type { AlbumPhoto } from '../lib/types'
import SectionHeading from './SectionHeading'

export default function AlbumGallery({ photos }: { photos: AlbumPhoto[] }) {
  const ref = useInView<HTMLDivElement>()
  const [selected, setSelected] = useState<AlbumPhoto | null>(null)
  return (
    <section id="album" className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading eyebrow="Album Ảnh" title="Khoảnh Khắc Của Chúng Tôi" subtitle="Những bức ảnh ghi lại hành trình yêu thương của Thanh Trúc & Xuân Yên." />
      <div ref={ref} className="fade-in-section grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((p, i) => (
          <button key={p.id ?? i} type="button" onClick={() => setSelected(p)} className="group overflow-hidden rounded-2xl focus:outline-none">
            <img src={p.imageUrl} alt={p.caption || `Ảnh cưới ${i + 1}`} loading="lazy" className="h-48 w-full object-cover transition duration-300 group-hover:scale-105 md:h-64" />
            {p.caption && <span className="block bg-white/80 px-2 py-1.5 text-xs text-brown-dark">{p.caption}</span>}
          </button>
        ))}
        {photos.length === 0 && <p className="col-span-full text-center text-sm text-brown/70">Album đang được cập nhật.</p>}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelected(null)} role="dialog" aria-label="Xem ảnh lớn">
          <div className="max-w-3xl">
            <img src={selected.imageUrl} alt={selected.caption || 'Ảnh cưới'} className="max-h-[80vh] w-full rounded-2xl object-contain" />
            {selected.caption && <p className="mt-3 text-center text-sm text-white">{selected.caption}</p>}
            <p className="mt-2 text-center text-xs text-white/60">Nhấn vào bất kỳ đâu để đóng</p>
          </div>
        </div>
      )}
    </section>
  )
}
