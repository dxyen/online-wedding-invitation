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
    if (!name.trim()) { setError('Vui lòng nhập họ tên của bạn.'); return }
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
    <section id="rsvp" className="mx-auto max-w-2xl px-4 py-12">
      <SectionHeading eyebrow="RSVP" title="Xác Nhận Tham Dự" subtitle="Vui lòng xác nhận trước ngày 20/12/2025 để chúng tôi chuẩn bị đón tiếp chu đáo nhất." />
      <div ref={ref} className="fade-in-section card">
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label" htmlFor="rsvp-name">Họ và tên *</label><input id="rsvp-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Nguyễn Văn A" /></div>
          <div><label className="label" htmlFor="rsvp-phone">Số điện thoại</label><input id="rsvp-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxx" /></div>
          <div>
            <span className="label">Bạn có tham dự? *</span>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-brown/20 px-4 py-3 text-sm"><input type="radio" name="attending" checked={attending === 'yes'} onChange={() => setAttending('yes')} /> Có, tôi sẽ đến 🎉</label>
              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-brown/20 px-4 py-3 text-sm"><input type="radio" name="attending" checked={attending === 'no'} onChange={() => setAttending('no')} /> Tiếc là tôi không đến được</label>
            </div>
          </div>
          <div><label className="label" htmlFor="rsvp-count">Số khách (1–10)</label><input id="rsvp-count" type="number" min={1} max={10} className="input" value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} /></div>
          <div><label className="label" htmlFor="rsvp-msg">Lời nhắn (không bắt buộc)</label><textarea id="rsvp-msg" className="input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ghi chú về món ăn, dị ứng…" /></div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {success && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">{loading ? 'Đang gửi…' : 'Gửi xác nhận'}</button>
        </form>
      </div>
    </section>
  )
}
