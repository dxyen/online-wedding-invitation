import { useEffect, useState } from 'react'
import { adminApi, getErrorMessage } from '../lib/api'
import type { Rsvp } from '../lib/types'
import DataTable from '../components/admin/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminRsvps() {
  const [rows, setRows] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    adminApi.listRsvps()
      .then((data) => setRows(data as Rsvp[]))
      .catch((err) => setError(getErrorMessage(err, 'Không tải được danh sách RSVP.')))
      .finally(() => setLoading(false))
  }, [])
  if (loading) return <LoadingSpinner text="Đang tải RSVP…" />
  const attending = rows.filter((r) => r.attending).reduce((s, r) => s + (r.guestCount || 1), 0)
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown-dark">Xác nhận tham dự (RSVP)</h1>
      <p className="mt-1 text-sm text-brown/70">{rows.length} xác nhận · Tổng số khách tham dự dự kiến: {attending} người</p>
      {error && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
      <div className="card mt-6">
        <DataTable<Rsvp>
          rows={rows}
          columns={[
            { key: 'name', label: 'Tên', render: (r) => r.guestName },
            { key: 'phone', label: 'Điện thoại', render: (r) => r.phone || '—' },
            { key: 'att', label: 'Tham dự', render: (r) => (r.attending ? '✅ Có' : '❌ Không') },
            { key: 'count', label: 'Số khách', render: (r) => String(r.guestCount) },
            { key: 'msg', label: 'Lời nhắn', render: (r) => r.message || '—' },
            { key: 'at', label: 'Ngày gửi', render: (r) => r.createdAt || '—' }
          ]}
        />
      </div>
    </div>
  )
}
