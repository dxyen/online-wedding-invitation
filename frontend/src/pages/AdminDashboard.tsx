import { useEffect, useState } from 'react'
import { adminApi, getErrorMessage } from '../lib/api'
import type { Stats } from '../lib/types'
import StatCard from '../components/admin/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err, 'Không tải được thống kê. API admin có thể chưa chạy.')))
      .finally(() => setLoading(false))
  }, [])
  if (loading) return <LoadingSpinner text="Đang tải thống kê…" />
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown-dark">Tổng quan</h1>
      <p className="mt-1 text-sm text-brown/70">Thiệp cưới Thanh Trúc &amp; Xuân Yên — 03/01/2026</p>
      {error && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng khách mời" value={stats?.totalGuests ?? 0} />
        <StatCard label="Xác nhận (RSVP)" value={stats?.totalRsvps ?? 0} hint={`Tham dự: ${stats?.attendingCount ?? 0} · Không đến: ${stats?.notAttendingCount ?? 0}`} />
        <StatCard label="Lời chúc" value={stats?.totalWishes ?? 0} hint={`Chờ duyệt: ${stats?.pendingWishes ?? 0}`} />
        <StatCard label="Ảnh album" value={stats?.totalPhotos ?? 0} />
      </div>
      <div className="card mt-6">
        <h2 className="font-display text-xl font-semibold text-brown-dark">Việc cần làm</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-brown/80">
          <li>Duyệt lời chúc mới trong mục “Lời chúc”.</li>
          <li>Kiểm tra danh sách RSVP trước ngày 20/12/2025.</li>
          <li>Cập nhật album và thông tin thiệp trong mục “Thiệp cưới”.</li>
        </ul>
      </div>
    </div>
  )
}
