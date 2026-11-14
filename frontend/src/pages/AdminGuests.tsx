import { useEffect, useState } from 'react'
import { adminApi, getErrorMessage } from '../lib/api'
import type { Guest } from '../lib/types'
import DataTable from '../components/admin/DataTable'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminGuests() {
  const [rows, setRows] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    adminApi.listGuests()
      .then((data) => setRows(data as Guest[]))
      .catch((err) => setError(getErrorMessage(err, 'Không tải được danh sách khách mời.')))
      .finally(() => setLoading(false))
  }, [])
  if (loading) return <LoadingSpinner text="Đang tải khách mời…" />
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown-dark">Khách mời</h1>
      <p className="mt-1 text-sm text-brown/70">Tổng: {rows.length} khách</p>
      {error && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
      <div className="card mt-6">
        <DataTable<Guest>
          rows={rows}
          columns={[
            { key: 'name', label: 'Tên', render: (r) => r.name },
            { key: 'phone', label: 'Điện thoại', render: (r) => r.phone || '—' },
            { key: 'group', label: 'Nhóm', render: (r) => r.groupName || '—' },
            { key: 'side', label: 'Bên', render: (r) => r.side || '—' }
          ]}
        />
      </div>
    </div>
  )
}
