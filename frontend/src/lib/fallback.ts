// DỮ LIỆU FALLBACK CHỈ CHO DEV — dùng khi API chưa chạy / fetch lỗi.
// Production path phải dùng API thật. Khi đang dùng fallback, UI hiển thị
// banner "Chế độ xem trước — API chưa kết nối" để người xem biết rõ.
import type { AlbumPhoto, GiftAccount, TimelineItem, Wedding, WeddingEvent, Wish } from './types'

export const FALLBACK_SLUG = 'thanh-truc-xuan-yen'

export const fallbackWedding: Wedding = {
  id: 1,
  slug: FALLBACK_SLUG,
  brideName: 'Thanh Trúc',
  groomName: 'Xuân Yên',
  weddingDate: '2026-01-03',
  venueName: 'White Palace Hoàng Văn Thụ',
  venueAddress: '194 Hoàng Văn Thụ, Phú Nhuận',
  ceremonyTime: '09:00',
  receptionTime: '18:00',
  dressCode: 'Xanh lá · Be · Kem · Nâu',
  invitationText:
    'Trân trọng kính mời Quý khách đến dự Lễ Thành Hôn và Tiệc Cưới của chúng tôi. Sự hiện diện của Quý khách là niềm vinh hạnh và món quà ý nghĩa nhất dành cho hai gia đình.',
  couple: {
    brideName: 'Thanh Trúc',
    groomName: 'Xuân Yên',
    brideParents: 'Ông: … · Bà: …',
    groomParents: 'Ông: … · Bà: …',
    brideBio: 'Cô dâu xinh đẹp, dịu dàng — một nửa yêu thương của Xuân Yên.',
    groomBio: 'Chú rể hiền lành, chân thành — một nửa còn lại của Thanh Trúc.'
  },
  events: [
    { id: 1, title: 'Lễ Thành Hôn', time: '09:00', date: '03/01/2026', description: 'Lễ Thành Hôn tại White Palace Hoàng Văn Thụ.', venueName: 'White Palace Hoàng Văn Thụ', venueAddress: '194 Hoàng Văn Thụ, Phú Nhuận' },
    { id: 2, title: 'Tiệc Cưới', time: '18:00', date: '03/01/2026', description: 'Tiệc Cưới — đón khách từ 17:30.', venueName: 'White Palace Hoàng Văn Thụ', venueAddress: '194 Hoàng Văn Thụ, Phú Nhuận' }
  ]
}

export const fallbackEvents: WeddingEvent[] = fallbackWedding.events || []

export const fallbackTimeline: TimelineItem[] = [
  { id: 1, title: 'Lần đầu gặp nhau', date: '2021', description: 'Một buổi chiều tình cờ, hai người xa lạ bỗng trở nên quen thuộc.', imageUrl: 'https://picsum.photos/seed/love1/800/600' },
  { id: 2, title: 'Lời tỏ tình', date: '2022', description: 'Dưới ánh đèn vàng, Xuân Yên nói lời yêu thương đầu tiên.', imageUrl: 'https://picsum.photos/seed/love2/800/600' },
  { id: 3, title: 'Cùng nhau trưởng thành', date: '2023 — 2025', description: 'Cùng nhau đi qua những ngày bình yên và cả những thử thách.', imageUrl: 'https://picsum.photos/seed/love3/800/600' },
  { id: 4, title: 'Lời cầu hôn', date: '2025', description: '“Em đồng ý làm vợ anh nhé?” — và Thanh Trúc đã mỉm cười gật đầu.', imageUrl: 'https://picsum.photos/seed/love4/800/600' }
]

export const fallbackAlbum: AlbumPhoto[] = [
  { id: 1, imageUrl: 'https://picsum.photos/seed/wed1/900/700', caption: 'Khoảnh khắc ngọt ngào' },
  { id: 2, imageUrl: 'https://picsum.photos/seed/wed2/900/700', caption: 'Cùng nhau dạo phố' },
  { id: 3, imageUrl: 'https://picsum.photos/seed/wed3/900/700', caption: 'Ngày nắng đẹp' },
  { id: 4, imageUrl: 'https://picsum.photos/seed/wed4/900/700', caption: 'Nụ cười hạnh phúc' },
  { id: 5, imageUrl: 'https://picsum.photos/seed/wed5/900/700', caption: 'Tay trong tay' },
  { id: 6, imageUrl: 'https://picsum.photos/seed/wed6/900/700', caption: 'Mãi bên nhau' }
]

export const fallbackWishes: Wish[] = [
  { id: 1, guestName: 'Gia đình hai bên', message: 'Chúc hai con trăm năm hạnh phúc, sớm sinh quý tử!', approved: true, createdAt: '2025-12-01' },
  { id: 2, guestName: 'Bạn thân', message: 'Chúc mừng Thanh Trúc & Xuân Yên! Mãi hạnh phúc nhé!', approved: true, createdAt: '2025-12-02' }
]

// SỐ TÀI KHOẢN MẪU — chỉ để xem trước giao diện, KHÔNG phải số thật.
export const fallbackGiftAccounts: GiftAccount[] = [
  { id: 1, ownerName: 'Xuân Yên', bankName: 'Ngân hàng mẫu (demo)', accountNumber: '0000 0000 0000', accountHolder: 'XUÂN YÊN', role: 'GROOM' },
  { id: 2, ownerName: 'Thanh Trúc', bankName: 'Ngân hàng mẫu (demo)', accountNumber: '1111 1111 1111', accountHolder: 'THANH TRÚC', role: 'BRIDE' }
]
