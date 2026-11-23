import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { getErrorMessage, publicApi } from '../lib/api'
import SectionHeading from './SectionHeading'

export default function RsvpForm({ slug }: { slug: string }) {
  const ref = useInView<HTMLDivElement>()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [attending, setAttending] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!name.trim()) { setError('Bạn vui lòng cho chúng mình biết họ tên nhé.'); return }
    if (!attending) { setError('Vui lòng chọn bạn có tham dự hay không.'); return }
    if (guestCount < 1 || guestCount > 10) { setError('Số khách phải từ 1 đến 10 người.'); return }
    setLoading(true)
    try {
      await publicApi.sendRsvp(slug, { guestName: name.trim(), phone: phone.trim() || undefined, attending: attending === 'yes', guestCount, message: message.trim() || undefined })
      setSuccess('Cảm ơn bạn đã xác nhận! Chúng tôi rất mong được đón bạn trong ngày cưới.')
      setName(''); setPhone(''); setAttending(''); setGuestCount(1); setMessage('')
    } catch (err) {
      setError(getErrorMessage(err, 'Gửi xác nhận thất bại. Vui lòng thử lại sau.'))
    } finally { setLoading(false) }
  }

  return (
    <section id="rsvp" className="inv-section">
      <SectionHeading eyebrow="RSVP" title="Xác Nhận Tham Dự" subtitle="Vui lòng xác nhận trước ngày 20/12/2026 để chúng tôi chuẩn bị đón tiếp chu đáo nhất." />
      <div ref={ref} className="fade-in-section">
        {success ? (
          <div className="inv-done">
            <p className="inv-done-big">Cảm ơn bạn!</p>
            <p>{success}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="inv-form">
            <div>
              <label className="inv-label" htmlFor="rsvp-name">Họ và tên *</label>
              <input id="rsvp-name" className="inv-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Nguyễn Văn A" />
            </div>
            <div>
              <label className="inv-label" htmlFor="rsvp-phone">Số điện thoại</label>
              <input id="rsvp-phone" className="inv-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxx" />
            </div>
            <div>
              <span className="inv-label">Bạn có tham dự? *</span>
              <div className="inv-pills">
                <button type="button" aria-pressed={attending === 'yes'} onClick={() => setAttending('yes')} className="inv-pill">✓ Sẽ tham dự</button>
                <button type="button" aria-pressed={attending === 'no'} onClick={() => setAttending('no')} className="inv-pill">Rất tiếc, không thể đến</button>
              </div>
            </div>
            <div>
              <label className="inv-label" htmlFor="rsvp-count">Số khách (1–10)</label>
              <input id="rsvp-count" type="number" min={1} max={10} className="inv-input" value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} />
            </div>
            <div>
              <label className="inv-label" htmlFor="rsvp-msg">Lời nhắn (không bắt buộc)</label>
              <textarea id="rsvp-msg" className="inv-input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ghi chú về món ăn, dị ứng…" />
            </div>
            {error && <p className="inv-error">{error}</p>}
            <button type="submit" disabled={loading} className="inv-btn inv-btn-block">{loading ? 'Đang gửi…' : 'Gửi Xác Nhận'}</button>
          </form>
        )}
      </div>
    </section>
  )
}
