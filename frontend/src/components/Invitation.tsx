import { useInView } from '../hooks/useInView'
import type { Wedding, WeddingEvent } from '../lib/types'
import SectionHeading from './SectionHeading'
import CalendarMonth from './CalendarMonth'

export const MAP_URL = 'https://maps.app.goo.gl/DGPB7o7WHyMbqfGv9?g_st=ifm'

const VI_WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

function formatEventTime(ev: WeddingEvent): string {
  if (ev.time) return ev.time
  return ev.startTime ? ev.startTime.slice(0, 5) : '08:00'
}

// 'Chủ Nhật ✦ 27 · 12 · 2026' — như thẻ sự kiện trên bản artifact.
function formatEventDateShort(ev: WeddingEvent, wedding: Wedding): string {
  const raw = ev.date || ev.eventDate || wedding.weddingDate
  if (!raw) return 'Chủ Nhật ✦ 27 · 12 · 2026'
  let d: Date | null = null
  let m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  else {
    m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (m) d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]))
  }
  if (!d || Number.isNaN(d.getTime())) return raw
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${VI_WEEKDAYS[d.getDay()]} ✦ ${dd} · ${mm} · ${d.getFullYear()}`
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
  return (
    <section id="invitation" className="inv-section">
      <SectionHeading eyebrow="Trân trọng kính mời" title="Lời Mời" script subtitle={wedding.invitationText} />
      <div ref={ref} className="fade-in-section">
        <div className="inv-couple">
          <div className="inv-couple-card">
            <p className="inv-couple-role">Cô Dâu</p>
            <h3 className="inv-couple-name">{wedding.brideName}</h3>
            <p className="inv-couple-parents">{wedding.couple?.brideParents || 'Con gái của gia đình họ nhà gái'}</p>
            {wedding.couple?.brideBio && <p className="inv-couple-bio">{wedding.couple.brideBio}</p>}
          </div>
          <div className="inv-couple-card">
            <p className="inv-couple-role">Chú Rể</p>
            <h3 className="inv-couple-name">{wedding.groomName}</h3>
            <p className="inv-couple-parents">{wedding.couple?.groomParents || 'Con trai của gia đình họ nhà trai'}</p>
            {wedding.couple?.groomBio && <p className="inv-couple-bio">{wedding.couple.groomBio}</p>}
          </div>
        </div>
        <CalendarMonth />
        {list.map((ev, i) => (
          <div key={ev.id ?? i} className="event-card">
            <p className="event-orn" aria-hidden="true">❦</p>
            <h3>{ev.title}</h3>
            <p className="event-time">{formatEventTime(ev)}</p>
            <p className="event-when">Đón khách từ 07:30</p>
            <p className="event-date">{formatEventDateShort(ev, wedding)}</p>
            <div className="event-divider" aria-hidden="true">
              <span className="event-div-line" /><span>♥</span><span className="event-div-line" />
            </div>
            {ev.description && <p className="event-desc">{ev.description}</p>}
          </div>
        ))}
        <div className="inv-actions">
          <a className="inv-btn inv-btn-small" href={MAP_URL} target="_blank" rel="noreferrer">Xem Bản Đồ</a>
          <button type="button" onClick={() => downloadIcs(wedding)} className="inv-btn inv-btn-small inv-btn-ghost">Thêm Vào Lịch</button>
        </div>
      </div>
    </section>
  )
}
