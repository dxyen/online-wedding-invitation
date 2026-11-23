// DỮ LIỆU FALLBACK CHỈ CHO DEV — dùng khi API chưa chạy / fetch lỗi.
// Production path phải dùng API thật. Khi đang dùng fallback, UI hiển thị
// banner "Chế độ xem trước — API chưa kết nối" để người xem biết rõ.
import type { AlbumPhoto, GiftAccount, TimelineItem, Wedding, WeddingEvent, Wish } from './types'
import type { SyntheticEvent } from 'react'

export const FALLBACK_SLUG = 'thanh-truc-xuan-yen'

// Ảnh cưới mẫu (cô dâu & chú rể thật, đã kiểm chứng tải được) dùng khi ảnh album
// từ API tải lỗi — vd: seed cũ trong DB trỏ tới /images/album/*.jpg vốn không
// tồn tại trên frontend nên khung ảnh trống. Ảnh thật up qua Admin sẽ thay thế.
export const PLACEHOLDER_PHOTOS = [
  'https://www.aylesburyvale.biz/wp-content/uploads/2021/05/couple-wed.png',
  'https://cdn.prod.website-files.com/664d394ae6b5833c6ed82777/69717dbe6e831ed276d4c20b_thumb.jpg'
]

export function handleImgError(e: SyntheticEvent<HTMLImageElement>, index = 0): void {
  const img = e.currentTarget
  if (img.dataset.fallbackApplied) return
  img.dataset.fallbackApplied = '1'
  img.src = PLACEHOLDER_PHOTOS[index % PLACEHOLDER_PHOTOS.length]
}

export const fallbackWedding: Wedding = {
  id: 1,
  slug: FALLBACK_SLUG,
  brideName: 'Thanh Trúc',
  groomName: 'Xuân Yên',
  weddingDate: '2026-12-27',
  venueName: 'Tư gia',
  venueAddress: 'Thạnh Hưng, An Giang',
  ceremonyTime: '08:00',
  receptionTime: '08:00',
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
    { id: 1, title: 'Lễ Thành Hôn & Tiệc Cưới', time: '08:00', date: '27/12/2026', description: 'Lễ thành hôn và tiệc cưới được tổ chức tại tư gia — nghi lễ truyền thống cùng hai họ, nối tiếp là tiệc mừng chung vui cùng gia đình và quan khách.', venueName: 'Tư gia', venueAddress: 'Thạnh Hưng, An Giang' }
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
  { id: 1, guestName: 'Thanh Trúc', message: 'Cảm ơn anh đã đến bên em và cùng em đi qua bao ngày nắng mưa. Từ hôm nay, em chính thức là vợ anh — cùng nhau xây một mái nhà bình yên, nắm tay nhau đi hết những mùa hoa nhé!', approved: true, createdAt: '2026-12-27' },
  { id: 2, guestName: 'Xuân Yên', message: 'Cảm ơn em đã chọn anh giữa bao người. Anh hứa sẽ yêu thương, chở che em suốt đời — từ hôm nay, chúng ta là một gia đình.', approved: true, createdAt: '2026-12-27' },
  { id: 3, guestName: 'Phương Thảo', message: 'Trúc xinh quá đi! Chúc hai bạn một đời bình an, nắm tay nhau đi hết những mùa hoa.', approved: true, createdAt: '2025-10-20' }
]

// SỐ TÀI KHOẢN THẬT của cô dâu và chú rể (TPBank, VietQR).
// qrPayload là chuỗi payload VietQR giải mã từ mã QR thật do hai bạn cung cấp;
// frontend vẽ mã QR từ chuỗi này nên không cần file ảnh nhị phân.
export const fallbackGiftAccounts: GiftAccount[] = [
  { id: 1, ownerName: 'Thanh Trúc', bankName: 'TPBank', accountNumber: '0000 0846 416', accountHolder: 'VO THI THANH TRUC', role: 'BRIDE', qrPayload: '0002010102111531397007040052044600000000084641638550010A000000727012500069704230111000008464160208QRIBFTTA5204513753037045802VN5917VO THI THANH TRUC6006Ha Noi8707CLASSIC63040E47' },
  { id: 2, ownerName: 'Xuân Yên', bankName: 'TPBank', accountNumber: '3719 1472 484', accountHolder: 'DO XUAN YEN', role: 'GROOM', qrPayload: '0002010102111531397007040052044600003719147248438530010A000000727012300069704230109doxuanyen0208QRIBFTTA5204513753037045802VN5911DO XUAN YEN6006Ha Noi8707CLASSIC63045EFF' }
]
