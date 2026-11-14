# API — Online Wedding Invitation

Base URL: `http://localhost:8080/api` (dev). Frontend gọi qua `VITE_API_URL`
(mặc định `http://localhost:8080/api`).

- Mọi response JSON. Lỗi trả về dạng: `{"message": "...", "status": 400}` (hoặc
  `{"error": "..."}` — backend thống nhất dùng `message`).
- Phân trang (danh sách admin): `?page=0&size=20&sort=createdAt,desc`.
- Auth admin: JWT Bearer. Đăng nhập lấy token rồi gửi kèm mọi request `/api/admin/**`:
  `Authorization: Bearer <token>`.
- `{slug}` là slug của wedding, vd: `thanh-truc-xuan-yen`.
- `{id}` là id số (BIGINT) của bản ghi.
- Ngày: `wedding_date` / `event_date` dạng `YYYY-MM-DD` (`2026-01-03`).
  Giờ: `start_time` / `end_time` dạng `HH:mm` hoặc `HH:mm:ss` (`09:00`).
- **Số tài khoản hộp quà trả về từ API seed là SỐ MẪU, không phải số thật.**

Mục lục: [Public](#public) · [Auth](#auth) · [Admin — Dashboard](#admin--dashboard) ·
[Admin — Weddings](#admin--weddings) · [Admin — Timeline / Album / Events / Gift accounts](#admin--timeline--album--events--gift-accounts) ·
[Admin — Guests](#admin--guests) · [Admin — RSVPs](#admin--rsvps) · [Admin — Wishes](#admin--wishes) ·
[Mã lỗi chung](#mã-lỗi-chung)

---

## Public

Không cần đăng nhập. Chỉ wedding đã `is_published = true` mới trả về (chưa
publish → `404`). Lời chúc public chỉ trả những lời đã duyệt (`is_approved = true`).

### GET /api/public/weddings/{slug}

Lấy toàn bộ thông tin thiệp theo slug (trang thiệp dùng API này làm dữ liệu chính).

- **Auth:** không.
- **Response 200:**

```json
{
  "id": 1,
  "slug": "thanh-truc-xuan-yen",
  "title": "Thanh Trúc & Xuân Yên",
  "brideName": "Thanh Trúc",
  "groomName": "Xuân Yên",
  "weddingDate": "2026-01-03",
  "coverImageUrl": "https://picsum.photos/seed/thanh-truc-xuan-yen-cover/1600/900",
  "musicUrl": "https://cdn.example.com/music/wedding-theme.mp3",
  "template": "thiep-cuoi-hien-dai",
  "isPublished": true,
  "couples": [
    { "id": 1, "role": "BRIDE", "fullName": "Thanh Trúc", "nickname": "Trúc",
      "bio": "Cô dâu Thanh Trúc — ...", "avatarUrl": "https://...",
      "fatherName": "Nguyễn Văn Hùng", "motherName": "Trần Thị Lan" },
    { "id": 2, "role": "GROOM", "fullName": "Xuân Yên", "nickname": "Yên",
      "bio": "Chú rể Xuân Yên — ...", "avatarUrl": "https://...",
      "fatherName": "Phạm Văn Đức", "motherName": "Lê Thị Hoa" }
  ],
  "events": [
    { "id": 1, "name": "Lễ Thành Hôn", "eventDate": "2026-01-03",
      "startTime": "09:00:00", "endTime": "11:00:00",
      "venueName": "White Palace Hoàng Văn Thụ",
      "address": "194 Hoàng Văn Thụ, Phú Nhuận, TP. Hồ Chí Minh",
      "mapUrl": "https://maps.google.com/?q=White+Palace+194+Hoang+Van+Thu+Phu+Nhuan",
      "description": "Lễ Thành Hôn trong không khí ấm cúng cùng gia đình hai bên." },
    { "id": 2, "name": "Tiệc Cưới", "eventDate": "2026-01-03",
      "startTime": "18:00:00", "endTime": "21:00:00",
      "venueName": "White Palace Hoàng Văn Thụ",
      "address": "194 Hoàng Văn Thụ, Phú Nhuận, TP. Hồ Chí Minh",
      "mapUrl": "https://maps.google.com/?q=White+Palace+194+Hoang+Van+Thu+Phu+Nhuan",
      "description": "Tiệc Cưới chiêu đãi bạn bè, đồng nghiệp — ..." }
  ]
}
```

- **Lỗi:** `404` — không tìm thấy slug / thiệp chưa publish.

### GET /api/public/weddings/{slug}/timeline

Danh sách timeline, sắp xếp theo `sortOrder` tăng dần.

- **Auth:** không.
- **Response 200:** mảng:

```json
[
  { "id": 1, "title": "Lần đầu gặp nhau",
    "description": "Một buổi chiều mưa, ...",
    "eventDate": "2019-02-14",
    "imageUrl": "https://picsum.photos/seed/thanh-truc-xuan-yen-timeline-1/800/600",
    "sortOrder": 1 }
]
```

- **Lỗi:** `404` — slug không tồn tại.

### GET /api/public/weddings/{slug}/album

Album ảnh, sắp xếp theo `sortOrder` tăng dần.

- **Auth:** không.
- **Response 200:**

```json
[
  { "id": 1, "imageUrl": "https://picsum.photos/seed/thanh-truc-xuan-yen-1/800/600",
    "caption": "Khoảnh khắc đầu tiên", "sortOrder": 1 }
]
```

- **Lỗi:** `404` — slug không tồn tại.

### GET /api/public/weddings/{slug}/events

Danh sách sự kiện (lễ / tiệc) của wedding.

- **Auth:** không.
- **Response 200:** mảng object sự kiện, cùng dạng `events` trong
  `GET /api/public/weddings/{slug}` (xem trên).
- **Lỗi:** `404` — slug không tồn tại.

### GET /api/public/weddings/{slug}/wishes

Lời chúc **đã duyệt** (`is_approved = true`), mới nhất trước.

- **Auth:** không.
- **Response 200:**

```json
[
  { "id": 1, "senderName": "Minh Anh",
    "message": "Chúc Trúc và Yên trăm năm hạnh phúc, sớm có tin vui nhé!",
    "createdAt": "2026-01-03T10:00:00" }
]
```

- **Lỗi:** `404` — slug không tồn tại.

### GET /api/public/weddings/{slug}/gift-accounts

Tài khoản nhận quà mừng (hộp quà).

- **Auth:** không.
- **Response 200:**

```json
[
  { "id": 1, "ownerType": "BRIDE", "ownerName": "Thanh Trúc",
    "bankName": "Vietcombank", "accountNumber": "1903123456",
    "accountHolder": "THANH TRUC",
    "qrImageUrl": "https://picsum.photos/seed/thanh-truc-xuan-yen-qr-bride/400/400" }
]
```

> ⚠ `accountNumber` trong dữ liệu seed là **SỐ MẪU**. Admin phải đổi sang số thật
> trước khi gửi thiệp cho khách.

- **Lỗi:** `404` — slug không tồn tại.

### POST /api/public/weddings/{slug}/rsvp

Gửi xác nhận tham dự. `guestId` tùy chọn — khách trong danh sách thì gửi kèm,
khách vãng lai bỏ trống (chỉ cần `guestName` + `phone`).

- **Auth:** không.
- **Request body:**

```json
{
  "guestId": 4,
  "guestName": "Lê Minh Anh",
  "phone": "0904444444",
  "email": "minhanh.le@example.com",
  "attending": true,
  "guestCount": 2,
  "message": "Nhất định mình sẽ đến chung vui cùng hai bạn!"
}
```

| Trường | Bắt buộc | Ghi chú |
| --- | --- | --- |
| `guestName` | Có | Tên người xác nhận |
| `attending` | Có | `true` = tham dự, `false` = không tham dự |
| `guestCount` | Không | Mặc định `1`; nếu `attending=false` thì `0` |
| `guestId` | Không | Id trong bảng `guests`, nếu có |
| `phone`, `email`, `message` | Không | Liên hệ + lời nhắn |

- **Response 201:**

```json
{
  "id": 10, "guestName": "Lê Minh Anh", "phone": "0904444444",
  "attending": true, "guestCount": 2,
  "message": "Nhất định mình sẽ đến chung vui cùng hai bạn!",
  "createdAt": "2026-01-03T10:05:00"
}
```

- **Lỗi:** `400` — thiếu `guestName` / `guestCount < 0` / `guestCount > 0` khi
  `attending=false`; `404` — slug không tồn tại / `guestId` không thuộc wedding này.

### POST /api/public/weddings/{slug}/wishes

Gửi lời chúc. Lời chúc mới mặc định **chưa duyệt** (`isApproved=false`) và chỉ
hiện public sau khi admin duyệt.

- **Auth:** không.
- **Request body:**

```json
{
  "senderName": "Minh Anh",
  "message": "Chúc Trúc và Yên trăm năm hạnh phúc!"
}
```

- **Response 201:**

```json
{
  "id": 11, "senderName": "Minh Anh",
  "message": "Chúc Trúc và Yên trăm năm hạnh phúc!",
  "isApproved": false,
  "createdAt": "2026-01-03T10:06:00"
}
```

- **Lỗi:** `400` — thiếu `senderName` hoặc `message` (trống / quá dài);
  `404` — slug không tồn tại.

---

## Auth

### POST /api/auth/login

Đăng nhập admin, trả JWT dùng cho mọi API `/api/admin/**`.

- **Auth:** không.
- **Request body:**

```json
{
  "email": "admin@wedding.local",
  "password": "Admin@123"
}
```

> Tài khoản dev mặc định (seed bởi backend `DataSeeder`, đổi qua env
> `ADMIN_EMAIL` / `ADMIN_PASSWORD`): `admin@wedding.local` / `Admin@123`.
> **Đổi mật khẩu này trước khi đưa lên production.**

- **Response 200:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "email": "admin@wedding.local",
  "fullName": "Admin",
  "role": "ADMIN"
}
```

- **Lỗi:** `400` — thiếu email/password; `401` — sai email hoặc mật khẩu.

---

## Admin — Dashboard

Tất cả API dưới đây yêu cầu header `Authorization: Bearer <token>` (role `ADMIN`).

### GET /api/admin/dashboard/stats?weddingId={id}

Thống kê tổng quan cho dashboard.

- **Auth:** JWT admin.
- **Query:** `weddingId` (bắt buộc, vd: `?weddingId=1`).
- **Response 200:**

```json
{
  "weddingId": 1,
  "totalGuests": 5,
  "totalRsvps": 3,
  "confirmedGuests": 2,
  "declinedGuests": 1,
  "totalAttendingPersons": 3,
  "totalWishes": 4,
  "approvedWishes": 2,
  "pendingWishes": 2
}
```

Tên trường khớp `StatsResponse` của backend (`confirmedGuests` /
`declinedGuests` / `totalAttendingPersons` — số người tham dự tính theo
`guestCount`, không phải số RSVP).

- **Lỗi:** `400` — thiếu `weddingId`; `401` — chưa đăng nhập / token hết hạn;
  `404` — wedding không tồn tại.

---

## Admin — Weddings

### GET /api/admin/weddings

Danh sách wedding (phân trang).

- **Auth:** JWT admin.
- **Query:** `page=0&size=20&sort=createdAt,desc` (tùy chọn).
- **Response 200:**

```json
{
  "content": [
    { "id": 1, "slug": "thanh-truc-xuan-yen", "title": "Thanh Trúc & Xuân Yên",
      "brideName": "Thanh Trúc", "groomName": "Xuân Yên",
      "weddingDate": "2026-01-03", "template": "thiep-cuoi-hien-dai", "isPublished": true }
  ],
  "totalElements": 1, "totalPages": 1, "page": 0, "size": 20
}
```

### GET /api/admin/weddings/{id}

Chi tiết một wedding (kèm couples, events — dùng để load form sửa).

- **Auth:** JWT admin.
- **Response 200:** object wedding đầy đủ, cùng dạng public nhưng thêm
  `isPublished` và đầy đủ trường quản trị.
- **Lỗi:** `404` — id không tồn tại.

### POST /api/admin/weddings

Tạo wedding mới. `slug` phải duy nhất, chỉ gồm chữ thường, số và dấu `-`.

- **Auth:** JWT admin.
- **Request body:**

```json
{
  "slug": "thanh-truc-xuan-yen",
  "title": "Thanh Trúc & Xuân Yên",
  "brideName": "Thanh Trúc",
  "groomName": "Xuân Yên",
  "weddingDate": "2026-01-03",
  "coverImageUrl": "https://picsum.photos/seed/thanh-truc-xuan-yen-cover/1600/900",
  "musicUrl": "https://cdn.example.com/music/wedding-theme.mp3",
  "template": "thiep-cuoi-hien-dai",
  "isPublished": true,
  "couples": [
    { "role": "BRIDE", "fullName": "Thanh Trúc", "nickname": "Trúc",
      "bio": "...", "avatarUrl": "https://...",
      "fatherName": "Nguyễn Văn Hùng", "motherName": "Trần Thị Lan" },
    { "role": "GROOM", "fullName": "Xuân Yên", "nickname": "Yên",
      "bio": "...", "avatarUrl": "https://...",
      "fatherName": "Phạm Văn Đức", "motherName": "Lê Thị Hoa" }
  ]
}
```

- **Response 201:** object wedding vừa tạo (kèm `id`).
- **Lỗi:** `400` — thiếu trường bắt buộc / `slug` sai định dạng;
  `409` — `slug` đã tồn tại.

### PUT /api/admin/weddings/{id}

Cập nhật wedding (ngày cưới, địa điểm, template, publish...). Body cùng dạng
`POST`, các trường không gửi giữ nguyên (hoặc gửi đủ — theo backend `PUT` thay
thế toàn bộ trường chính; `couples` gửi kèm sẽ được đồng bộ theo `role`).

- **Auth:** JWT admin.
- **Response 200:** object wedding sau cập nhật.
- **Lỗi:** `400` — dữ liệu không hợp lệ; `404` — id không tồn tại;
  `409` — đổi `slug` trùng slug khác.

### DELETE /api/admin/weddings/{id}

Xóa wedding và toàn bộ dữ liệu con (couples, events, timeline, album, guests,
rsvps, wishes, gift accounts — xóa cascade ở DB). **Không khôi phục được.**

- **Auth:** JWT admin.
- **Response:** `204 No Content`.
- **Lỗi:** `404` — id không tồn tại.

---

## Admin — Timeline / Album / Events / Gift accounts

Bốn nhóm con của wedding dùng chung một mẫu CRUD, chỉ khác path và body.
`{id}` ở đây là **id của wedding**.

### Timeline

- `GET /api/admin/weddings/{id}/timeline` — danh sách timeline (`sortOrder` tăng dần).
- `POST /api/admin/weddings/{id}/timeline` — thêm mốc.
- `PUT /api/admin/weddings/{id}/timeline/{itemId}` — sửa mốc.
- `DELETE /api/admin/weddings/{id}/timeline/{itemId}` — xóa mốc (`204`).

**Body (POST/PUT):**

```json
{
  "title": "Lời cầu hôn",
  "description": "Đêm Giáng sinh, Yên quỳ gối với chiếc nhẫn giấu trong hộp quà.",
  "eventDate": "2024-12-24",
  "imageUrl": "https://picsum.photos/seed/thanh-truc-xuan-yen-timeline-3/800/600",
  "sortOrder": 3
}
```

### Album

- `GET /api/admin/weddings/{id}/album`
- `POST /api/admin/weddings/{id}/album`
- `PUT /api/admin/weddings/{id}/album/{photoId}`
- `DELETE /api/admin/weddings/{id}/album/{photoId}` (`204`)

**Body (POST/PUT):**

```json
{
  "imageUrl": "https://picsum.photos/seed/thanh-truc-xuan-yen-1/800/600",
  "caption": "Khoảnh khắc đầu tiên",
  "sortOrder": 1
}
```

### Events

- `GET /api/admin/weddings/{id}/events`
- `POST /api/admin/weddings/{id}/events`
- `PUT /api/admin/weddings/{id}/events/{eventId}`
- `DELETE /api/admin/weddings/{id}/events/{eventId}` (`204`)

**Body (POST/PUT):**

```json
{
  "name": "Tiệc Cưới",
  "eventDate": "2026-01-03",
  "startTime": "18:00",
  "endTime": "21:00",
  "venueName": "White Palace Hoàng Văn Thụ",
  "address": "194 Hoàng Văn Thụ, Phú Nhuận, TP. Hồ Chí Minh",
  "mapUrl": "https://maps.google.com/?q=White+Palace+194+Hoang+Van+Thu+Phu+Nhuan",
  "description": "Tiệc Cưới chiêu đãi bạn bè, đồng nghiệp."
}
```

### Gift accounts

- `GET /api/admin/weddings/{id}/gift-accounts`
- `POST /api/admin/weddings/{id}/gift-accounts`
- `PUT /api/admin/weddings/{id}/gift-accounts/{accountId}`
- `DELETE /api/admin/weddings/{id}/gift-accounts/{accountId}` (`204`)

**Body (POST/PUT):**

```json
{
  "ownerType": "BRIDE",
  "ownerName": "Thanh Trúc",
  "bankName": "Vietcombank",
  "accountNumber": "1903123456",
  "accountHolder": "THANH TRUC",
  "qrImageUrl": "https://picsum.photos/seed/thanh-truc-xuan-yen-qr-bride/400/400"
}
```

> ⚠ `accountNumber` trong seed là **SỐ MẪU**. Cập nhật số thật qua API này
> trước khi gửi thiệp cho khách.

**Lỗi chung cho 4 nhóm:** `400` — thiếu trường bắt buộc; `401` — chưa đăng nhập;
`404` — wedding hoặc bản ghi con không tồn tại / không thuộc wedding này.

---

## Admin — Guests

### GET /api/admin/guests?weddingId={id}

Danh sách khách mời của một wedding (phân trang, lọc tùy chọn).

- **Auth:** JWT admin.
- **Query:** `weddingId` (tùy chọn — lọc theo wedding; không gửi thì trả mọi
  wedding), `page`, `size`, `side=BRIDE|GROOM|BOTH`,
  `search=` (tìm theo tên/SĐT) — tùy chọn.
- **Response 200:** trang danh sách, mỗi phần tử:

```json
{
  "content": [
    { "id": 4, "fullName": "Lê Minh Anh", "phone": "0904444444",
      "email": "minhanh.le@example.com", "groupName": "Bạn thân",
      "side": "BOTH", "note": "Bạn thân của cô dâu từ thời đại học" }
  ],
  "totalElements": 5, "totalPages": 1, "page": 0, "size": 20
}
```

### POST /api/admin/guests

- **Auth:** JWT admin.
- **Request body:**

```json
{
  "weddingId": 1,
  "fullName": "Lê Minh Anh",
  "phone": "0904444444",
  "email": "minhanh.le@example.com",
  "groupName": "Bạn thân",
  "side": "BOTH",
  "note": "Bạn thân của cô dâu từ thời đại học"
}
```

- **Response 201:** object guest vừa tạo (kèm `id`).
- **Lỗi:** `400` — thiếu `weddingId`/`fullName` hoặc `side` không hợp lệ;
  `404` — wedding không tồn tại.

### PUT /api/admin/guests/{id} · DELETE /api/admin/guests/{id}

- `PUT` — body cùng dạng `POST` (cập nhật guest). Response `200` object đã sửa.
- `DELETE` — xóa guest; các RSVP đã gắn guest này giữ lại với `guestId = null`
  (DB `ON DELETE SET NULL`). Response `204`.
- **Lỗi:** `404` — guest không tồn tại.

---

## Admin — RSVPs

### GET /api/admin/rsvps?weddingId={id}

Danh sách RSVP, mới nhất trước (phân trang, lọc tùy chọn).

- **Auth:** JWT admin.
- **Query:** `weddingId` (tùy chọn — lọc theo wedding; không gửi thì trả mọi
  wedding), `page`, `size`, `attending=true|false` (tùy chọn).
- **Response 200:**

```json
{
  "content": [
    { "id": 1, "guestId": 4, "guestName": "Lê Minh Anh",
      "phone": "0904444444", "email": "minhanh.le@example.com",
      "attending": true, "guestCount": 2,
      "message": "Nhất định mình sẽ đến chung vui cùng hai bạn!",
      "createdAt": "2026-01-03T10:05:00" }
  ],
  "totalElements": 3, "totalPages": 1, "page": 0, "size": 20
}
```

### GET /api/admin/rsvps/{id}

Chi tiết một RSVP.

- **Auth:** JWT admin. **Lỗi:** `404` — id không tồn tại.

### DELETE /api/admin/rsvps/{id}

Xóa một RSVP (vd: spam / trùng). Response `204`.

- **Auth:** JWT admin. **Lỗi:** `404` — id không tồn tại.

> RSVP do khách gửi từ trang public, admin **không tạo/sửa RSVP** qua API
> (chỉ xem và xóa). Muốn sửa, xóa RSVP cũ và nhờ khách gửi lại, hoặc sửa
> trực tiếp trong DB.

---

## Admin — Wishes

### GET /api/admin/wishes?weddingId={id}

Danh sách lời chúc **gồm cả chưa duyệt** (khác public chỉ thấy đã duyệt).

- **Auth:** JWT admin.
- **Query:** `weddingId` (tùy chọn — lọc theo wedding; không gửi thì trả mọi
  wedding), `page`, `size`, `approved=true|false` (tùy chọn — lọc đã/chưa duyệt).
- **Response 200:**

```json
{
  "content": [
    { "id": 1, "senderName": "Minh Anh",
      "message": "Chúc Trúc và Yên trăm năm hạnh phúc, sớm có tin vui nhé!",
      "isApproved": true, "createdAt": "2026-01-03T10:00:00" }
  ],
  "totalElements": 4, "totalPages": 1, "page": 0, "size": 20
}
```

### PUT /api/admin/wishes/{id}/approve

> Method `PUT` theo frontend hiện tại (`api.ts`: `approveWish` / `rejectWish`
> dùng `PUT`).

Duyệt lời chúc → hiện trên trang public.

- **Auth:** JWT admin.
- **Response 200:** object wish với `isApproved: true`.
- **Lỗi:** `404` — wish không tồn tại.

### PUT /api/admin/wishes/{id}/reject

Từ chối lời chúc → chuyển về chưa duyệt (`isApproved=false`, không hiện public).
Không xóa hẳn — muốn xóa hẳn thì dùng `DELETE` bên dưới.

- **Auth:** JWT admin.
- **Response 200:** object wish với `isApproved: false`.
- **Lỗi:** `404` — wish không tồn tại.

### DELETE /api/admin/wishes/{id}

Xóa hẳn một lời chúc (vd: spam). Response `204`.

- **Auth:** JWT admin. **Lỗi:** `404` — id không tồn tại.

---

## Mã lỗi chung

| Mã | Ý nghĩa | Khi nào gặp |
| --- | --- | --- |
| `400` | Bad Request | Thiếu trường bắt buộc, sai định dạng (slug, ngày, giờ, `side`/`ownerType`/`role` không hợp lệ), `guestCount` không hợp lệ |
| `401` | Unauthorized | Thiếu token, token hết hạn / sai chữ ký (mọi API `/api/admin/**` và thao tác cần đăng nhập) |
| `403` | Forbidden | Token hợp lệ nhưng role không phải `ADMIN` |
| `404` | Not Found | Slug / id không tồn tại, thiệp chưa publish (public), bản ghi con không thuộc wedding |
| `409` | Conflict | `slug` đã tồn tại khi tạo / đổi slug |
| `500` | Internal Server Error | Lỗi server / DB — kiểm tra log backend |

Response lỗi mẫu:

```json
{
  "message": "Không tìm thấy thiệp cưới với slug: thanh-truc-xuan-yen",
  "status": 404
}
```

## Swagger

Khi backend đang chạy, xem và thử API trực tiếp tại:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
