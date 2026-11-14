import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { getErrorMessage, publicApi } from '../lib/api'
import type { Wish } from '../lib/types'
import SectionHeading from './SectionHeading'

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
    <section id="wishes" className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading eyebrow="Sổ Lưu Bút" title="Gửi Lời Chúc" subtitle="Mỗi lời chúc của bạn là một món quà tinh thần dành cho Thanh Trúc & Xuân Yên." />
      <div ref={ref} className="fade-in-section">
        <form onSubmit={submit} className="card space-y-4">
          <div><label className="label" htmlFor="wish-name">Tên của bạn *</label><input id="wish-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên của bạn" /></div>
          <div><label className="label" htmlFor="wish-msg">Lời chúc *</label><textarea id="wish-msg" className="input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Viết lời chúc hạnh phúc…" /></div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {success && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">{loading ? 'Đang gửi…' : 'Gửi lời chúc ♥'}</button>
        </form>
        <div className="mt-8 space-y-4">
          {wishes.map((w, i) => (
            <article key={w.id ?? i} className="card">
              <p className="font-display text-lg font-semibold text-brown-dark">{w.guestName}</p>
              <p className="mt-1 text-sm leading-relaxed text-brown/80">“{w.message}”</p>
              {w.createdAt && <p className="mt-2 text-xs text-brown/50">{w.createdAt}</p>}
            </article>
          ))}
          {wishes.length === 0 && <p className="text-center text-sm text-brown/70">Chưa có lời chúc nào được duyệt. Hãy là người đầu tiên gửi lời chúc nhé!</p>}
        </div>
      </div>
    </section>
  )
}
