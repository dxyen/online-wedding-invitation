import { Navigate, Route, Routes } from 'react-router-dom'
import InvitationPage from './pages/InvitationPage'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './pages/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminWedding from './pages/AdminWedding'
import AdminGuests from './pages/AdminGuests'
import AdminRsvps from './pages/AdminRsvps'
import AdminWishes from './pages/AdminWishes'
import AdminAlbum from './pages/AdminAlbum'
import type { ReactElement } from 'react'

function RequireAuth({ children }: { children: ReactElement }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="font-hand text-4xl text-brown">Oops!</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-brown-dark">Không tìm thấy trang</h1>
      <p className="mt-2 text-sm text-brown/80">Đường dẫn bạn mở không tồn tại.</p>
      <a href="/w/thanh-truc-xuan-yen" className="btn-gold mt-6">Về thiệp cưới</a>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/w/thanh-truc-xuan-yen" replace />} />
      <Route path="/w/:slug" element={<InvitationPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<AdminDashboard />} />
        <Route path="wedding" element={<AdminWedding />} />
        <Route path="guests" element={<AdminGuests />} />
        <Route path="rsvps" element={<AdminRsvps />} />
        <Route path="wishes" element={<AdminWishes />} />
        <Route path="album" element={<AdminAlbum />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
