import { useEffect, useState } from 'react'
import { adminApi, getErrorMessage } from '../lib/api'
import { fallbackAlbum } from '../lib/fallback'
import type { AlbumPhoto } from '../lib/types'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminAlbum() {
  const [photos, setPhotos] = useState<AlbumPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')

  useEffect(() => {
    adminApi.listWeddings()
      .then((list) => (list.length > 0 ? adminApi.listAlbum(list[0].id) : Promise.resolve(fallbackAlbum)))
      .then(setPhotos)
      .catch((err) => { setError(getErrorMessage(err, 'Không tải được album từ API — đang hiển thị ảnh mẫu.')); setPhotos(fallbackAlbum) })
      .finally(() => setLoading(false))
  }, [])

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setPhotos((p) => [...p, { id: Date.now(), imageUrl: url.trim(), caption: caption.trim() || undefined }])
    setUrl(''); setCaption('')
  }
  const remove = (id: number | string | undefined) => setPhotos((p) => p.filter((x) => x.id !== id))

  if (loading) return <LoadingSpinner text="Đang tải album…" />
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown-dark">Album ảnh</h1>
      <p className="mt-1 text-sm text-brown/70">{photos.length} ảnh · Thêm ảnh bằng URL (upload file sẽ do backend cung cấp sau).</p>
      {error && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
      <form onSubmit={add} className="card mt-6 flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1"><label className="label" htmlFor="photo-url">URL ảnh</label><input id="photo-url" className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" /></div>
        <div className="flex-1"><label className="label" htmlFor="photo-cap">Chú thích</label><input id="photo-cap" className="input" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Khoảnh khắc…" /></div>
        <button type="submit" className="btn-gold">Thêm ảnh</button>
      </form>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {photos.map((p, i) => (
          <div key={p.id ?? i} className="overflow-hidden rounded-2xl border border-brown/10 bg-white">
            <img src={p.imageUrl} alt={p.caption || `Ảnh ${i + 1}`} loading="lazy" className="h-40 w-full object-cover" />
            <div className="flex items-center justify-between gap-2 p-2">
              <span className="truncate text-xs text-brown-dark">{p.caption || '—'}</span>
              <button type="button" onClick={() => remove(p.id)} className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
