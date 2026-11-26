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
// Trả về từng phần để dấu ✦ được vẽ nhỏ màu vàng (11px #c2a077) như bản app.
function formatEventDateParts(ev: WeddingEvent, wedding: Wedding): { weekday: string; date: string } {
  const raw = ev.date || ev.eventDate || wedding.weddingDate
  const fallback = { weekday: 'Chủ Nhật', date: '27 · 12 · 2026' }
  if (!raw) return fallback
  let d: Date | null = null
  let m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  else {
    m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (m) d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]))
  }
  if (!d || Number.isNaN(d.getTime())) return fallback
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return { weekday: VI_WEEKDAYS[d.getDay()], date: `${dd} · ${mm} · ${d.getFullYear()}` }
}

function downloadIcs(wedding: Wedding) {
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thanh Truc Xuan Yen//Wedding//VI',
    'BEGIN:VEVENT',
    'UID:le-thanh-hon@thanh-truc-xuan-yen',
    'DTSTAMP:20251201T000000Z',
    'DTSTART:20261227T010000Z',
    'DTEND:20261227T033000Z',
    'SUMMARY:Lễ Thành Hôn & Tiệc Cưới Thanh Trúc & Xuân Yên',
    'LOCATION:Tư gia — Thạnh Hưng, An Giang',
    'DESCRIPTION:Lễ thành hôn và tiệc cưới được tổ chức tại tư gia — nghi lễ truyền thống cùng hai họ\\, nối tiếp là tiệc mừng chung vui cùng gia đình và quan khách. Bản đồ: https://maps.app.goo.gl/DGPB7o7WHyMbqfGv9?g_st=ifm',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'tiec-cuoi-thanh-truc-xuan-yen.ics'
  a.click()
  URL.revokeObjectURL(url)
}

export default function Invitation({ wedding, events }: { wedding: Wedding; events: WeddingEvent[] }) {
  const ref = useInView<HTMLDivElement>()
  const list = events.length > 0 ? events : (wedding.events || [])
  return (
    <section id="invitation" className="inv-section">
      <SectionHeading eyebrow="Trân trọng kính mời" title="Lời Mời" script />
      <div ref={ref} className="fade-in-section">
        <p className="inv-names">
          <span>{wedding.brideName}</span>
          <span className="inv-names-amp">&amp;</span>
          <span>{wedding.groomName}</span>
        </p>
        <CalendarMonth />
        {list.map((ev, i) => {
          const parts = formatEventDateParts(ev, wedding)
          return (
          <div key={ev.id ?? i} className="event-card">
            <p className="event-orn" aria-hidden="true">❦</p>
            <h3>{ev.title}</h3>
            <p className="event-time">{formatEventTime(ev)}</p>
            <p className="event-when">Đón khách từ 07:30</p>
            <p className="event-date">
              <span>{parts.weekday}</span>
              <span className="event-star" aria-hidden="true">✦</span>
              <span>{parts.date}</span>
            </p>
            <div className="event-divider" aria-hidden="true">
              <span className="event-div-line" /><span>♥</span><span className="event-div-line" />
            </div>
            {ev.description && <p className="event-desc">{ev.description}</p>}
          </div>
          )
        })}
        <div className="inv-actions">
          <a className="inv-btn inv-btn-small" href={MAP_URL} target="_blank" rel="noreferrer">Xem Bản Đồ</a>
          <button type="button" onClick={() => downloadIcs(wedding)} className="inv-btn inv-btn-small inv-btn-ghost">Thêm Vào Lịch</button>
        </div>
      </div>
    </section>
  )
}
