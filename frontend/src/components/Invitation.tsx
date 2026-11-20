import { useInView } from '../hooks/useInView'
import type { Wedding, WeddingEvent } from '../lib/types'
import SectionHeading from './SectionHeading'

export const MAP_URL = 'https://maps.app.goo.gl/DGPB7o7WHyMbqfGv9?g_st=ifm'

const VI_WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

function formatEventTime(ev: WeddingEvent): string {
  if (ev.time) return ev.time
  return ev.startTime ? ev.startTime.slice(0, 5) : '08:00'
}

function formatEventDate(ev: WeddingEvent): string {
  const raw = ev.date || ev.eventDate
  if (!raw) return '27/12/2026'
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    return `${VI_WEEKDAYS[d.getDay()]}, ${m[3]}/${m[2]}/${m[1]}`
  }
  return raw
}

function downloadIcs(wedding: Wedding) {
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thanh Truc Xuan Yen//Wedding//VI',
    'BEGIN:VEVENT',
    'UID:le-thanh-hon@thanh-truc-xuan-yen',
    'DTSTAMP:20251201T000000Z',
    'DTSTART:20261227T080000',
    'DTEND:20261227T103000',
    'SUMMARY:Lễ Thành Hôn & Tiệc Cưới Thanh Trúc & Xuân Yên',
    'LOCATION:Tư gia',
    'DESCRIPTION:Lễ thành hôn và tiệc cưới được tổ chức tại tư gia — nghi lễ truyền thống cùng hai họ\\, nối tiếp là tiệc mừng chung vui cùng gia đình và quan khách. Bản đồ: https://maps.app.goo.gl/DGPB7o7WHyMbqfGv9?g_st=ifm',
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
        <div className={`mt-6 grid gap-4 ${list.length === 1 ? 'mx-auto max-w-xl' : 'md:grid-cols-2'}`}>
          {list.map((ev, i) => (
            <div key={ev.id ?? i} className="card text-center">
              <p className="font-hand text-2xl text-gold">{ev.title}</p>
              <p className="mt-1 font-display text-4xl font-semibold text-brown-dark">{formatEventTime(ev)}</p>
              <p className="mt-1 text-sm text-brown/70">Đón khách từ 07:30 · {formatEventDate(ev)}</p>
              {ev.description && <p className="mt-2 text-sm text-brown/80">{ev.description}</p>}
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a className="btn-gold" href={MAP_URL} target="_blank" rel="noreferrer">Xem Bản Đồ</a>
          <button type="button" onClick={() => downloadIcs(wedding)} className="btn-outline">📅 Thêm vào lịch (.ics)</button>
          <button type="button" onClick={copyLink} className="btn-outline">🔗 Copy link thiệp</button>
          <a className="btn-outline" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">Chia sẻ Facebook</a>
          <a className="btn-outline" href={`https://zalo.me/share?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer">Chia sẻ Zalo</a>
        </div>
        <p className="mt-3 break-all text-center text-xs text-brown/50">{shareUrl}</p>
      </div>
    </section>
  )
}
