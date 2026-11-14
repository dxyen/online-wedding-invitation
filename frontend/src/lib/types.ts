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
  time: string
  date?: string
  description?: string
  venueName?: string
  venueAddress?: string
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
  dressCode?: string
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
  qrCodeUrl?: string
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
