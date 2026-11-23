import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { getErrorMessage, publicApi } from '../lib/api'
import type { Wish } from '../lib/types'
import SectionHeading from './SectionHeading'

function formatWishDate(raw?: string): string {
  if (!raw) return ''
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : raw
}

export default function WishBook({ slug, wishes, onSent }: { slug: string; wishes: Wish[]; onSent?: () => void }) {
  const ref = useInView<HTMLDivElement>()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!name.trim() || !message.trim()) { setError('Vui lòng nhập tên và lời chúc của bạn.'); return }
    setLoading(true)
    try {
      await publicApi.sendWish(slug, { guestName: name.trim(), message: message.trim() })
      setSuccess('Cảm ơn lời chúc của bạn! Lời chúc sẽ hiển thị sau khi được duyệt.')
      setName(''); setMessage('')
      onSent?.()
    } catch (err) {
      setError(getErrorMessage(err, 'Gửi lời chúc thất bại. Vui lòng thử lại sau.'))
    } finally { setLoading(false) }
  }

  return (
    <section id="wishes" className="inv-section">
      <SectionHeading eyebrow="Sổ Lưu Bút" title="Gửi Lời Chúc" subtitle="Mỗi lời chúc của bạn là một món quà tinh thần dành cho Thanh Trúc & Xuân Yên." />
      <div ref={ref} className="fade-in-section">
        <form onSubmit={submit} className="inv-form">
          <div>
            <label className="inv-label" htmlFor="wish-name">Tên của bạn *</label>
            <input id="wish-name" className="inv-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên của bạn" />
          </div>
          <div>
            <label className="inv-label" htmlFor="wish-msg">Lời chúc *</label>
            <textarea id="wish-msg" className="inv-input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Viết lời chúc hạnh phúc…" />
          </div>
          {error && <p className="inv-error">{error}</p>}
          {success && (
            <div className="inv-done">
              <p className="inv-done-big">Cảm ơn bạn!</p>
              <p>{success}</p>
            </div>
          )}
          <button type="submit" disabled={loading} className="inv-btn inv-btn-block">{loading ? 'Đang gửi…' : 'Gửi Lời Chúc'}</button>
        </form>
        <div className="wishes">
          {wishes.map((w, i) => (
            <article key={w.id ?? i} className="wish">
              <div className="wish-who">
                <b>{w.guestName || w.senderName}</b>
                {w.createdAt && <time>{formatWishDate(w.createdAt)}</time>}
              </div>
              <p>“{w.message}”</p>
            </article>
          ))}
          {wishes.length === 0 && <p className="count-note">Chưa có lời chúc nào được duyệt. Hãy là người đầu tiên gửi lời chúc nhé!</p>}
        </div>
      </div>
    </section>
  )
}
