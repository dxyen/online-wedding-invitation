import { useEffect, useState } from 'react'
import { adminApi, getErrorMessage } from '../lib/api'
import type { Wish } from '../lib/types'
import DataTable from '../components/admin/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminWishes() {
  const [rows, setRows] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    adminApi.listWishes()
      .then(setRows)
      .catch((err) => setError(getErrorMessage(err, 'Không tải được lời chúc.')))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const act = async (id: number | string | undefined, action: 'approve' | 'reject' | 'delete') => {
    if (id === undefined) return
    setMsg(''); setError('')
    try {
      if (action === 'approve') await adminApi.approveWish(id)
      if (action === 'reject') await adminApi.rejectWish(id)
      if (action === 'delete') await adminApi.deleteWish(id)
      setMsg('Đã cập nhật lời chúc.')
      load()
    } catch (err) {
      setError(getErrorMessage(err, 'Thao tác thất bại.'))
    }
  }

  if (loading) return <LoadingSpinner text="Đang tải lời chúc…" />
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown-dark">Duyệt lời chúc</h1>
      <p className="mt-1 text-sm text-brown/70">{rows.length} lời chúc · Chờ duyệt: {rows.filter((w) => !w.approved && w.status !== 'APPROVED').length}</p>
      {msg && <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{msg}</p>}
      {error && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
      <div className="card mt-6">
        <DataTable<Wish>
          rows={rows}
          columns={[
            { key: 'name', label: 'Tên', render: (r) => r.guestName },
            { key: 'msg', label: 'Lời chúc', render: (r) => r.message },
            { key: 'status', label: 'Trạng thái', render: (r) => (r.approved || r.status === 'APPROVED' ? '✅ Đã duyệt' : '⏳ Chờ duyệt') },
            {
              key: 'actions', label: 'Thao tác',
              render: (r) => (
                <span className="flex gap-2">
                  <button type="button" onClick={() => act(r.id, 'approve')} className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">Duyệt</button>
                  <button type="button" onClick={() => act(r.id, 'reject')} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Từ chối</button>
                  <button type="button" onClick={() => act(r.id, 'delete')} className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Xóa</button>
                </span>
              )
            }
          ]}
        />
      </div>
    </div>
  )
}
