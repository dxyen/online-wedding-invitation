import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../lib/api'
import { getErrorMessage } from '../lib/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError('Vui lòng nhập email và mật khẩu.'); return }
    setLoading(true)
    try {
      const res = await authApi.login(email.trim(), password)
      localStorage.setItem('token', res.token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Đăng nhập thất bại. Kiểm tra lại email/mật khẩu.'))
    } finally { setLoading(false) }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="card w-full max-w-md">
        <p className="text-center font-hand text-3xl text-gold">T ♥ Y</p>
        <h1 className="mt-2 text-center font-display text-2xl font-semibold text-brown-dark">Đăng nhập quản trị</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" /></div>
          <div><label className="label" htmlFor="password">Mật khẩu</label><input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">{loading ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
        </form>
        <a href="/w/thanh-truc-xuan-yen" className="mt-4 block text-center text-sm text-brown/70 hover:text-brown">← Về thiệp cưới</a>
      </div>
    </main>
  )
}
