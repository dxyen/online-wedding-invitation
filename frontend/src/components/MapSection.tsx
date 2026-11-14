import { useInView } from '../hooks/useInView'
import SectionHeading from './SectionHeading'

export default function MapSection({ venueName, venueAddress }: { venueName: string; venueAddress: string }) {
  const ref = useInView<HTMLDivElement>()
  const query = encodeURIComponent(`${venueName} ${venueAddress}`)
  return (
    <section id="map" className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading eyebrow="Địa Điểm" title="Bản Đồ & Chỉ Đường" subtitle={`${venueName} — ${venueAddress}`} />
      <div ref={ref} className="fade-in-section card overflow-hidden p-0">
        <iframe
          title={`Bản đồ ${venueName}`}
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          className="h-[380px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-brown/80">{venueName} — {venueAddress}</p>
          <a className="btn-gold" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer">Mở Google Maps ↗</a>
        </div>
      </div>
    </section>
  )
}
