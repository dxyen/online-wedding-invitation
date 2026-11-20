import { useEffect, useState } from 'react'
import { adminApi, getErrorMessage } from '../lib/api'
import { fallbackWedding } from '../lib/fallback'
import type { Wedding } from '../lib/types'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminWedding() {
  const [wedding, setWedding] = useState<Wedding>(fallbackWedding)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi.listWeddings()
      .then((list) => { if (list.length > 0) setWedding(list[0]) })
      .catch(() => setError('Không tải được dữ liệu từ API — đang hiển thị dữ liệu mẫu để chỉnh sửa thử.'))
      .finally(() => setLoading(false))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(''); setError(''); setSaving(true)
    try {
      const saved = await adminApi.updateWedding(wedding.id, wedding)
      setWedding(saved)
      setMsg('Đã lưu thông tin thiệp cưới.')
    } catch (err) {
      setError(getErrorMessage(err, 'Lưu thất bại. Vui lòng thử lại.'))
    } finally { setSaving(false) }
  }
  const set = (patch: Partial<Wedding>) => setWedding((w) => ({ ...w, ...patch }))

  if (loading) return <LoadingSpinner text="Đang tải thông tin thiệp…" />
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown-dark">Thông tin thiệp cưới</h1>
      <form onSubmit={save} className="card mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="bride">Tên cô dâu</label><input id="bride" className="input" value={wedding.brideName} onChange={(e) => set({ brideName: e.target.value })} /></div>
          <div><label className="label" htmlFor="groom">Tên chú rể</label><input id="groom" className="input" value={wedding.groomName} onChange={(e) => set({ groomName: e.target.value })} /></div>
          <div><label className="label" htmlFor="slug">Slug</label><input id="slug" className="input" value={wedding.slug} onChange={(e) => set({ slug: e.target.value })} /></div>
          <div><label className="label" htmlFor="date">Ngày cưới</label><input id="date" type="date" className="input" value={wedding.weddingDate} onChange={(e) => set({ weddingDate: e.target.value })} /></div>
          <div><label className="label" htmlFor="venue">Địa điểm</label><input id="venue" className="input" value={wedding.venueName} onChange={(e) => set({ venueName: e.target.value })} /></div>
          <div><label className="label" htmlFor="addr">Địa chỉ</label><input id="addr" className="input" value={wedding.venueAddress} onChange={(e) => set({ venueAddress: e.target.value })} /></div>
          <div><label className="label" htmlFor="ceremony">Giờ Lễ Thành Hôn</label><input id="ceremony" className="input" value={wedding.ceremonyTime || ''} onChange={(e) => set({ ceremonyTime: e.target.value })} /></div>
          <div><label className="label" htmlFor="reception">Giờ Tiệc Cưới</label><input id="reception" className="input" value={wedding.receptionTime || ''} onChange={(e) => set({ receptionTime: e.target.value })} /></div>
        </div>
        <div><label className="label" htmlFor="invite">Lời mời</label><textarea id="invite" rows={4} className="input" value={wedding.invitationText || ''} onChange={(e) => set({ invitationText: e.target.value })} /></div>
        {msg && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{msg}</p>}
        {error && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-60">{saving ? 'Đang lưu…' : 'Lưu thay đổi'}</button>
      </form>
    </div>
  )
}
