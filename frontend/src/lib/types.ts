export interface Couple {
  brideName: string
  groomName: string
  brideParents?: string
  groomParents?: string
  brideBio?: string
  groomBio?: string
  bridePhoto?: string
  groomPhoto?: string
}

export interface WeddingEvent {
  id?: number | string
  title: string
  time?: string
  date?: string
  description?: string
  venueName?: string
  venueAddress?: string
  // API shape (WeddingEventResponse): startTime/eventDate/location/address
  startTime?: string
  endTime?: string
  eventDate?: string
  eventType?: string
  location?: string
  address?: string
}

export interface Wedding {
  id: number | string
  slug: string
  title?: string
  brideName: string
  groomName: string
  weddingDate: string
  venueName: string
  venueAddress: string
  ceremonyTime?: string
  receptionTime?: string
  invitationText?: string
  couple?: Couple
  events?: WeddingEvent[]
  coverPhoto?: string
  musicEnabled?: boolean
}

export interface TimelineItem {
  id?: number | string
  title: string
  date: string
  description: string
  imageUrl?: string
}

export interface AlbumPhoto {
  id?: number | string
  imageUrl: string
  caption?: string
  sortOrder?: number
}

export interface Wish {
  id?: number | string
  guestName: string
  // API shape (WishResponse) dùng senderName thay cho guestName
  senderName?: string
  message: string
  approved?: boolean
  status?: string
  createdAt?: string
}

export interface GiftAccount {
  id?: number | string
  ownerName: string
  bankName: string
  accountNumber: string
  accountHolder: string
  role: 'GROOM' | 'BRIDE' | string
  // API shape (GiftAccountResponse) dùng side thay cho role
  side?: string
  qrCodeUrl?: string
  // Chuỗi payload VietQR (EMVCo) — frontend vẽ mã QR từ chuỗi này,
  // không cần file ảnh nhị phân.
  qrPayload?: string
}

export interface RsvpRequest {
  guestName: string
  phone?: string
  attending: boolean | string
  guestCount: number
  event?: string
  message?: string
}

export interface WishRequest {
  guestName: string
  message: string
}

export interface Stats {
  totalGuests?: number
  totalRsvps?: number
  attendingCount?: number
  notAttendingCount?: number
  totalWishes?: number
  pendingWishes?: number
  totalPhotos?: number
  [key: string]: number | undefined
}

export interface AuthResponse {
  token: string
  email?: string
  name?: string
}

export interface Guest {
  id?: number | string
  name: string
  phone?: string
  email?: string
  groupName?: string
  side?: string
}

export interface Rsvp {
  id?: number | string
  guestName: string
  phone?: string
  attending: boolean
  guestCount: number
  message?: string
  createdAt?: string
}
