import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const LINKS = [
  { to: '/admin', label: 'Tổng quan', end: true },
  { to: '/admin/wedding', label: 'Thiệp cưới' },
  { to: '/admin/guests', label: 'Khách mời' },
  { to: '/admin/rsvps', label: 'Xác nhận (RSVP)' },
  { to: '/admin/wishes', label: 'Lời chúc' },
  { to: '/admin/album', label: 'Album' }
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login', { replace: true })
  }
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-brown/10 bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="font-display text-lg font-semibold text-brown-dark">Quản trị thiệp cưới · T ♥ Y</span>
          <button type="button" onClick={logout} className="rounded-full border border-brown/30 px-4 py-1.5 text-sm text-brown hover:bg-cream-dark">Đăng xuất</button>
        </div>
        <nav className="mx-auto flex max-w-6xl flex-wrap gap-1 px-4 pb-3">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium ${isActive ? 'bg-brown text-cream' : 'text-brown hover:bg-cream-dark'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8"><Outlet /></main>
    </div>
  )
}
