import { useInView } from '../hooks/useInView'
import type { Wedding, WeddingEvent } from '../lib/types'
import SectionHeading from './SectionHeading'

function downloadIcs(wedding: Wedding) {
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thanh Truc Xuan Yen//Wedding//VI',
    'BEGIN:VEVENT',
    'UID:le-thanh-hon@thanh-truc-xuan-yen',
    'DTSTAMP:20251201T000000Z',
    'DTSTART:20260103T090000',
    'DTEND:20260103T110000',
    'SUMMARY:Lễ Thành Hôn Thanh Trúc & Xuân Yên',
    `LOCATION:${wedding.venueName}\\, ${wedding.venueAddress}`,
    'DESCRIPTION:Tiệc Cưới lúc 18:00 cùng ngày.',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'le-cuoi-thanh-truc-xuan-yen.ics'
  a.click()
  URL.revokeObjectURL(url)
}

export default function Invitation({ wedding, events }: { wedding: Wedding; events: WeddingEvent[] }) {
  const ref = useInView<HTMLDivElement>()
  const list = events.length > 0 ? events : (wedding.events || [])
  const shareUrl = `${window.location.origin}/w/${wedding.slug}`
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); alert('Đã sao chép link thiệp!') } catch { alert(shareUrl) }
  }
  return (
    <section id="invitation" className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading eyebrow="Trân trọng kính mời" title="Lời Mời" subtitle={wedding.invitationText} />
      <div ref={ref} className="fade-in-section">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card text-center">
            <p className="font-hand text-3xl text-gold">Cô Dâu</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-brown-dark">{wedding.brideName}</h3>
            <p className="mt-2 text-sm text-brown/70">{wedding.couple?.brideParents || 'Con gái của gia đình họ nhà gái'}</p>
            <p className="mt-3 text-sm leading-relaxed text-brown/80">{wedding.couple?.brideBio || ''}</p>
          </div>
          <div className="card text-center">
            <p className="font-hand text-3xl text-gold">Chú Rể</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-brown-dark">{wedding.groomName}</h3>
            <p className="mt-2 text-sm text-brown/70">{wedding.couple?.groomParents || 'Con trai của gia đình họ nhà trai'}</p>
            <p className="mt-3 text-sm leading-relaxed text-brown/80">{wedding.couple?.groomBio || ''}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {list.map((ev, i) => (
            <div key={ev.id ?? i} className="card text-center">
              <p className="font-hand text-2xl text-gold">{ev.title}</p>
              <p className="mt-1 font-display text-4xl font-semibold text-brown-dark">{ev.time}</p>
              <p className="mt-1 text-sm text-brown/70">{ev.date || '03/01/2026'}</p>
              <p className="mt-2 text-sm text-brown/80">{ev.venueName || wedding.venueName}</p>
              <p className="text-sm text-brown/70">{ev.venueAddress || wedding.venueAddress}</p>
              {ev.description && <p className="mt-2 text-sm text-brown/80">{ev.description}</p>}
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => downloadIcs(wedding)} className="btn-gold">📅 Thêm vào lịch (.ics)</button>
          <button type="button" onClick={copyLink} className="btn-outline">🔗 Copy link thiệp</button>
          <a className="btn-outline" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">Chia sẻ Facebook</a>
          <a className="btn-outline" href={`https://zalo.me/share?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">Chia sẻ Zalo</a>
        </div>
        <p className="mt-3 break-all text-center text-xs text-brown/50">{shareUrl}</p>
      </div>
    </section>
  )
}
