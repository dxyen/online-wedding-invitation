# Online Wedding Invitation

Thiệp cưới online: khách mở link thiệp, xem thông tin cưới, gửi RSVP và lời
chúc; admin đăng nhập quản lý toàn bộ nội dung thiệp (thông tin cưới,
timeline, album, sự kiện, khách mời, RSVP, lời chúc, hộp quà mừng).

- **Frontend:** React 18 + Vite
- **Backend:** Java 17, Spring Boot 3 (REST API `/api`, JWT)
- **Database:** MySQL 8.0 (`wedding_db`, `utf8mb4`)

## Demo seed

Thiệp mẫu đã có sẵn trong database:

| | |
| --- | --- |
| Cô dâu & chú rể | **Thanh Trúc & Xuân Yên** (nữ trước, monogram T ♥ Y) |
| Ngày cưới | **03/01/2026** |
| Lễ Thành Hôn | 09:00 — White Palace Hoàng Văn Thụ |
| Tiệc Cưới | 18:00 — White Palace Hoàng Văn Thụ, 194 Hoàng Văn Thụ, Phú Nhuận |
| Slug / URL thiệp | `thanh-truc-xuan-yen` → `http://localhost:5173/w/thanh-truc-xuan-yen` |
| API public | `http://localhost:8080/api/public/weddings/thanh-truc-xuan-yen` |

> ⚠ **Số tài khoản hộp quà trong seed là SỐ MẪU** (vd: `1903123456`), không
> phải số thật. Đổi sang số thật qua trang Admin trước khi gửi thiệp cho khách.
>
> Ngày cưới, giờ lễ/tiệc, địa điểm, ảnh và lời chúc trong seed đều là dữ liệu
> demo, sửa được qua trang Admin — không cần sửa code hay SQL.

## Cấu trúc thư mục

```
online-wedding-invitation/
├── backend/               Spring Boot — REST API /api, JWT, JPA
├── frontend/              React + Vite — trang thiệp public + trang Admin
├── database/
│   ├── schema.sql         Tạo database wedding_db + 10 bảng (MySQL 8)
│   ├── seed.sql           Dữ liệu demo Thanh Trúc & Xuân Yên
│   └── README.md          Cách chạy schema + seed
├── docs/
│   ├── API.md             Hợp đồng API đầy đủ (public / auth / admin)
│   ├── architecture.md    Kiến trúc, luồng request, JWT flow, mở rộng
│   └── database.md        Schema, sơ đồ ER, ghi chú seed
├── docker-compose.yml     3 service: mysql / backend / frontend
├── .gitignore
└── README.md              Tài liệu này
```

## Yêu cầu

- Java 17+
- Node.js 20+ và npm
- MySQL 8 **hoặc** Docker + Docker Compose (khuyên dùng cho dev)

## Cách chạy bằng docker-compose (khuyên dùng)

```bash
# Từ thư mục gốc dự án
docker compose up -d --build

# Xem log
docker compose logs -f backend
docker compose logs -f frontend
```

Lần đầu chạy, sau khi MySQL healthy thì chạy schema + seed:

```bash
docker compose exec -T mysql mysql -u root -p"${MYSQL_ROOT_PASSWORD:-rootpassword}" < database/schema.sql
docker compose exec -T mysql mysql -u root -p"${MYSQL_ROOT_PASSWORD:-rootpassword}" < database/seed.sql
```

(Lưu ý: backend khi khởi động cũng tự tạo admin + wedding tối thiểu qua
`DataSeeder`; chạy `seed.sql` để có dữ liệu demo đầy đủ: timeline, album,
khách mời, RSVP, lời chúc, hộp quà. Xem `database/README.md`.)

| Dịch vụ | URL |
| --- | --- |
| Thiệp demo | http://localhost:5173/w/thanh-truc-xuan-yen |
| Trang Admin | http://localhost:5173/admin |
| Backend API | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| MySQL | localhost:3306 (`wedding_db`) |

Dừng:

```bash
docker compose down       # dừng, giữ dữ liệu
docker compose down -v    # dừng + XÓA dữ liệu MySQL (chỉ dùng ở dev)
```

## Cách chạy backend riêng (không dùng Docker cho backend)

```bash
cd backend

# Cần MySQL đang chạy (docker compose up -d mysql, hoặc MySQL local),
# rồi chạy schema + seed theo database/README.md.
./mvnw spring-boot:run

# Backend chạy tại http://localhost:8080
```

**Chạy thử nhanh bằng H2 (không cần MySQL)** — dùng profile `dev`:

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Profile `dev` dùng H2 in-memory: Hibernate tự tạo bảng, `DataSeeder`
chèn admin + wedding tối thiểu. Dữ liệu mất khi tắt app, không dùng cho
dữ liệu thật. Không chọn profile nào (mặc định) thì backend dùng MySQL.

## Cách chạy frontend riêng (không dùng Docker cho frontend)

```bash
cd frontend
npm install
npm run dev

# Frontend chạy tại http://localhost:5173
# (cần backend đang chạy ở http://localhost:8080, xem mục trên)
```

Build production:

```bash
cd frontend
npm run build
npm run preview
```

## Biến môi trường

Tạo file `.env` ở thư mục gốc (không commit — đã có trong `.gitignore`) với
các biến dưới đây. Mọi giá trị mặc định trong `docker-compose.yml` chỉ dùng
cho dev.

| Biến | Mặc định (dev) | Dùng cho | Ghi chú |
| --- | --- | --- | --- |
| `MYSQL_ROOT_PASSWORD` | `rootpassword` | MySQL | Mật khẩu root MySQL |
| `MYSQL_DATABASE` | `wedding_db` | MySQL / backend | Tên database |
| `MYSQL_USER` | `wedding` | MySQL / backend | User ứng dụng |
| `MYSQL_PASSWORD` | `weddingpassword` | MySQL / backend | Mật khẩu user ứng dụng |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://mysql:3306/wedding_db?...` | Backend | JDBC URL (docker-compose tự ráp từ các biến MySQL) |
| `SPRING_PROFILES_ACTIVE` | _(trống)_ | Backend | Không đặt = MySQL (mặc định); `dev` = H2 chạy thử nhanh |
| `JWT_SECRET` | `dev-secret-key-change-me-...` | Backend | Secret ký JWT (tối thiểu 32 ký tự) — **bắt buộc đổi ở production** |
| `FRONTEND_URL` | `http://localhost:5173` | Backend | URL frontend, dùng cho CORS |
| `ADMIN_EMAIL` | `admin@wedding.local` | Backend (`DataSeeder`) | Email admin dev |
| `ADMIN_PASSWORD` | `Admin@123` | Backend (`DataSeeder`) | Mật khẩu admin dev — **đổi ở production** |
| `VITE_API_URL` | `http://localhost:8080/api` | Frontend | Base URL gọi backend API |

Ví dụ `.env` tối thiểu:

```env
MYSQL_ROOT_PASSWORD=doi-mat-khau-root
MYSQL_DATABASE=wedding_db
MYSQL_USER=wedding
MYSQL_PASSWORD=doi-mat-khau-nay
JWT_SECRET=hay-doi-secret-nay-thanh-chuoi-dai-ngau-nhien-it-nhat-32-ky-tu
ADMIN_EMAIL=admin@wedding.local
ADMIN_PASSWORD=Admin@123
```

## Tài khoản dev

| | |
| --- | --- |
| Email | `admin@wedding.local` |
| Mật khẩu | `Admin@123` |
| Đăng nhập | Trang Admin `http://localhost:5173/admin` (hoặc `POST /api/auth/login`) |

Tài khoản này do backend `DataSeeder` tạo lúc chạy (hash BCrypt tạo bằng code,
không có trong SQL). Đổi qua env `ADMIN_EMAIL` / `ADMIN_PASSWORD`, và đổi
mật khẩu ngay trước khi đưa lên production.

## API tóm tắt

Chi tiết đầy đủ (request/response mẫu, mã lỗi) xem [`docs/API.md`](docs/API.md).
Swagger khi backend chạy: http://localhost:8080/swagger-ui.html

**Public** (không cần đăng nhập):

| Method | Path | Mô tả |
| --- | --- | --- |
| GET | `/api/public/weddings/{slug}` | Thông tin thiệp (kèm couples, events) |
| GET | `/api/public/weddings/{slug}/timeline` | Timeline câu chuyện |
| GET | `/api/public/weddings/{slug}/album` | Album ảnh |
| GET | `/api/public/weddings/{slug}/events` | Sự kiện lễ / tiệc |
| GET | `/api/public/weddings/{slug}/wishes` | Lời chúc đã duyệt |
| GET | `/api/public/weddings/{slug}/gift-accounts` | Tài khoản hộp quà (số mẫu) |
| POST | `/api/public/weddings/{slug}/rsvp` | Gửi xác nhận tham dự |
| POST | `/api/public/weddings/{slug}/wishes` | Gửi lời chúc (chờ duyệt) |

**Auth:**

| Method | Path | Mô tả |
| --- | --- | --- |
| POST | `/api/auth/login` | Đăng nhập admin, trả JWT |

**Admin** (cần header `Authorization: Bearer <token>`):

| Method | Path | Mô tả |
| --- | --- | --- |
| GET | `/api/admin/dashboard/stats?weddingId=` | Thống kê dashboard |
| GET/POST | `/api/admin/weddings` | Danh sách / tạo wedding |
| GET/PUT/DELETE | `/api/admin/weddings/{id}` | Chi tiết / sửa / xóa wedding |
| GET/POST/PUT/DELETE | `/api/admin/weddings/{id}/timeline` (+`/{itemId}`) | Quản lý timeline |
| GET/POST/PUT/DELETE | `/api/admin/weddings/{id}/album` (+`/{photoId}`) | Quản lý album |
| GET/POST/PUT/DELETE | `/api/admin/weddings/{id}/events` (+`/{eventId}`) | Quản lý sự kiện |
| GET/POST/PUT/DELETE | `/api/admin/weddings/{id}/gift-accounts` (+`/{accountId}`) | Quản lý hộp quà |
| GET/POST | `/api/admin/guests` (+`?weddingId=`) | Danh sách / thêm khách mời |
| PUT/DELETE | `/api/admin/guests/{id}` | Sửa / xóa khách mời |
| GET | `/api/admin/rsvps?weddingId=` | Danh sách RSVP |
| GET/DELETE | `/api/admin/rsvps/{id}` | Chi tiết / xóa RSVP |
| GET | `/api/admin/wishes?weddingId=` | Danh sách lời chúc (gồm chưa duyệt) |
| PUT | `/api/admin/wishes/{id}/approve` | Duyệt lời chúc |
| PUT | `/api/admin/wishes/{id}/reject` | Từ chối lời chúc |
| DELETE | `/api/admin/wishes/{id}` | Xóa lời chúc |

## Tài liệu thêm

- [`docs/API.md`](docs/API.md) — hợp đồng API đầy đủ
- [`docs/database.md`](docs/database.md) — schema, sơ đồ ER, ghi chú seed
- [`docs/architecture.md`](docs/architecture.md) — kiến trúc, JWT flow, cách mở rộng
- [`database/README.md`](database/README.md) — cách chạy schema + seed
