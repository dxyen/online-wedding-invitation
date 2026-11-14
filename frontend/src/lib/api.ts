import axios from 'axios'
import type { AuthResponse, GiftAccount, RsvpRequest, Stats, TimelineItem, AlbumPhoto, Wedding, WeddingEvent, Wish, WishRequest } from './types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('token')
      if (window.location.pathname !== '/admin/login') window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export function getErrorMessage(err: unknown, fallback = 'Có lỗi xảy ra, vui lòng thử lại.'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; error?: string } | undefined
    return data?.message || data?.error || err.message || fallback
  }
  if (err instanceof Error) return err.message
  return fallback
}

// Public
export const publicApi = {
  getWedding: (slug: string) => api.get<Wedding>(`/public/weddings/${slug}`).then((r) => r.data),
  getTimeline: (slug: string) => api.get<TimelineItem[]>(`/public/weddings/${slug}/timeline`).then((r) => r.data),
  getAlbum: (slug: string) => api.get<AlbumPhoto[]>(`/public/weddings/${slug}/album`).then((r) => r.data),
  getEvents: (slug: string) => api.get<WeddingEvent[]>(`/public/weddings/${slug}/events`).then((r) => r.data),
  getWishes: (slug: string) => api.get<Wish[]>(`/public/weddings/${slug}/wishes`).then((r) => r.data),
  getGiftAccounts: (slug: string) => api.get<GiftAccount[]>(`/public/weddings/${slug}/gift-accounts`).then((r) => r.data),
  sendRsvp: (slug: string, body: RsvpRequest) => api.post(`/public/weddings/${slug}/rsvp`, body).then((r) => r.data),
  sendWish: (slug: string, body: WishRequest) => api.post(`/public/weddings/${slug}/wishes`, body).then((r) => r.data)
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data)
}

// Admin
export const adminApi = {
  getStats: (weddingId?: number | string) =>
    api.get<Stats>('/admin/dashboard/stats', { params: weddingId ? { weddingId } : {} }).then((r) => r.data),
  listWeddings: () => api.get<Wedding[]>('/admin/weddings').then((r) => r.data),
  getWedding: (id: number | string) => api.get<Wedding>(`/admin/weddings/${id}`).then((r) => r.data),
  updateWedding: (id: number | string, body: Partial<Wedding>) =>
    api.put<Wedding>(`/admin/weddings/${id}`, body).then((r) => r.data),
  createWedding: (body: Partial<Wedding>) => api.post<Wedding>('/admin/weddings', body).then((r) => r.data),
  deleteWedding: (id: number | string) => api.delete(`/admin/weddings/${id}`).then((r) => r.data),
  listTimeline: (id: number | string) => api.get<TimelineItem[]>(`/admin/weddings/${id}/timeline`).then((r) => r.data),
  listAlbum: (id: number | string) => api.get<AlbumPhoto[]>(`/admin/weddings/${id}/album`).then((r) => r.data),
  listEvents: (id: number | string) => api.get<WeddingEvent[]>(`/admin/weddings/${id}/events`).then((r) => r.data),
  listGiftAccounts: (id: number | string) => api.get<GiftAccount[]>(`/admin/weddings/${id}/gift-accounts`).then((r) => r.data),
  listGuests: () => api.get<unknown[]>('/admin/guests').then((r) => r.data),
  listRsvps: () => api.get<unknown[]>('/admin/rsvps').then((r) => r.data),
  listWishes: () => api.get<Wish[]>('/admin/wishes').then((r) => r.data),
  approveWish: (id: number | string) => api.put(`/admin/wishes/${id}/approve`).then((r) => r.data),
  rejectWish: (id: number | string) => api.put(`/admin/wishes/${id}/reject`).then((r) => r.data),
  deleteWish: (id: number | string) => api.delete(`/admin/wishes/${id}`).then((r) => r.data)
}
