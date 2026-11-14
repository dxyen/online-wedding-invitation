# Kiến trúc — Online Wedding Invitation

## Tổng quan

Hệ thống thiệp cưới online: khách mở link thiệp theo slug, xem thông tin cưới,
gửi RSVP và lời chúc; admin đăng nhập quản lý toàn bộ nội dung thiệp.

```
Khách / Admin (trình duyệt)
        │  HTTP
        ▼
Frontend — React + Vite (port 5173)
        │  REST /api (JSON, JWT Bearer cho admin)
        ▼
Backend — Spring Boot (port 8080)
        │  JPA / Hibernate
        ▼
MySQL 8.0 (port 3306, database wedding_db)
```

| Tầng | Công nghệ | Vai trò |
| --- | --- | --- |
| Frontend | React 18 + Vite, React Router, Axios | Trang thiệp public (`/w/{slug}`), trang Admin (dashboard, quản lý wedding/guests/RSVP/wishes) |
| Backend | Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security + JWT, MySQL driver, springdoc-openapi (Swagger) | REST API `/api`, xác thực JWT, nghiệp vụ, truy vấn DB |
| Database | MySQL 8.0, InnoDB, `utf8mb4` | 10 bảng, trung tâm là `weddings` (xem `docs/database.md`) |
| Hạ tầng dev | Docker Compose | 3 service `mysql` / `backend` / `frontend` trên network `wedding-net` |

## Sơ đồ luồng request

### 1. Khách xem thiệp (public, không đăng nhập)

```
Browser ──GET /w/thanh-truc-xuan-yen──▶ React Router
React ──GET /api/public/weddings/thanh-truc-xuan-yen──▶ Spring Boot
Spring Boot ──SELECT weddings + couples + events (theo slug)──▶ MySQL
MySQL ──rows──▶ Spring Boot ──JSON──▶ React ──render thiệp──▶ Browser
```

Các khối thiệp gọi thêm (song song, sau khi có wedding):
`GET /api/public/weddings/{slug}/timeline`,
`.../album`, `.../events`, `.../wishes` (chỉ lời đã duyệt),
`.../gift-accounts`.

### 2. Khách gửi RSVP / lời chúc (public, không đăng nhập)

```
Browser ──form RSVP──▶ React
React ──POST /api/public/weddings/{slug}/rsvp {guestName, attending, ...}──▶ Spring Boot
Spring Boot ──validate (slug tồn tại, wedding đã publish, guestCount hợp lệ)
           ──INSERT rsvps──▶ MySQL ──201 Created──▶ React ──thông báo thành công
```

Lời chúc tương tự (`POST .../wishes`), nhưng `is_approved` mặc định `false` —
chỉ hiện public sau khi admin duyệt.

### 3. Admin đăng nhập và quản lý (JWT)

```
Browser ──POST /api/auth/login {email, password}──▶ Spring Boot
Spring Boot ──kiểm tra users (BCrypt)──▶ MySQL
          ──200 {token}──▶ React (lưu token, vd: localStorage)
React ──GET /api/admin/dashboard/stats?weddingId=1
        Header: Authorization: Bearer <token>──▶ Spring Boot
Spring Boot ──JwtAuthenticationFilter: verify chữ ký + hạn token
           ──SecurityContext: role ADMIN──▶ Controller ──MySQL──▶ JSON
```

Token hết hạn / sai chữ ký / thiếu token → `401`. Token hợp lệ nhưng không
phải `ADMIN` → `403`. Chi tiết xem [JWT flow](#jwt-flow) bên dưới.

## JWT flow

1. **Đăng nhập:** `POST /api/auth/login` với `email` + `password`.
   Backend tìm user theo email, kiểm tra mật khẩu bằng BCrypt
   (`PasswordEncoder.matches`). Đúng → ký JWT (thuật toán HS256, secret lấy
   từ env `JWT_SECRET`, hạn mặc định 24h) chứa `sub=email`, `role=ADMIN`.
   Sai → `401`.
2. **Gửi kèm request:** frontend gắn header `Authorization: Bearer <token>`
   cho mọi request `/api/admin/**` (Axios interceptor).
3. **Xác thực:** `JwtAuthenticationFilter` (Spring Security filter chain)
   chạy trước controller: tách token, verify chữ ký + hạn, load user, đưa
   `Authentication` (role `ADMIN`) vào `SecurityContext`.
4. **Phân quyền:** `SecurityConfig` — `/api/public/**` và `/api/auth/**`
   cho phép tất cả; `/api/admin/**` yêu cầu `hasRole("ADMIN")`; còn lại
   yêu cầu đã xác thực.
5. **Hết hạn:** frontend nhận `401` → xóa token, chuyển về trang đăng nhập.

> `JWT_SECRET` là secret thật, **chỉ đặt qua biến môi trường**, không commit
> vào repo. Secret dev trong `docker-compose.yml` chỉ dùng local.

## Backend — cấu trúc layered

```
backend/
└── src/main/java/com/wedding/
    ├── config/          SecurityConfig, JwtAuthenticationFilter, CorsConfig,
    │                    OpenApiConfig (Swagger)
    ├── controller/      AuthController, PublicWeddingController,
    │                    AdminWeddingController, AdminGuestController,
    │                    AdminRsvpController, AdminWishController,
    │                    DashboardController
    ├── service/         WeddingService, GuestService, RsvpService,
    │                    WishService, DashboardService, AuthService
    ├── repository/      WeddingRepository, CoupleRepository, EventRepository,
    │                    TimelineRepository, AlbumRepository, GuestRepository,
    │                    RsvpRepository, WishRepository, GiftAccountRepository,
    │                    UserRepository  (Spring Data JPA)
    ├── entity/          User, Wedding, Couple, WeddingEvent, TimelineItem,
    │                    AlbumPhoto, Guest, Rsvp, Wish, GiftAccount
    ├── dto/             Request/response DTO (không trả entity trực tiếp)
    ├── security/        JwtUtil, CustomUserDetailsService
    └── seed/            DataSeeder (chạy lúc khởi động — xem bên dưới)
```

Nguyên tắc:

- **Controller** mỏng: chỉ nhận request, validate đầu vào, gọi service, trả
  response (DTO + mã HTTP đúng: `200` / `201` / `204` / `400` / `404`...).
- **Service** chứa nghiệp vụ: kiểm tra slug tồn tại, wedding đã publish chưa,
  `guestId` có thuộc wedding không, RSVP hợp lệ không, đếm thống kê dashboard.
- **Repository** (Spring Data JPA): truy vấn theo `weddingId` / `slug`
  (`findBySlug`, `findByWeddingIdOrderBySortOrderAsc`...). Mọi truy vấn con
  đều lọc theo `wedding_id` — không bao giờ trả dữ liệu của wedding khác.
- **Entity ↔ DTO:** API không trả entity JPA trực tiếp (tránh lộ
  `password_hash`, tránh vòng lặp quan hệ). Dùng DTO riêng cho public
  (ẩn `isApproved`, chỉ trả wish đã duyệt) và admin.
- **Transaction:** service method ghi dữ liệu dùng `@Transactional`
  (vd: tạo wedding kèm couples phải thành công cùng nhau hoặc rollback hết).

### DataSeeder (chạy lúc backend khởi động)

- Tạo admin mặc định nếu chưa có user nào: `ADMIN_EMAIL` / `ADMIN_PASSWORD`
  (mặc định dev `admin@wedding.local` / `Admin@123`), mật khẩu hash bằng
  BCrypt **trong code** — không bao giờ ghi hash vào SQL.
- Tạo wedding demo `thanh-truc-xuan-yen` nếu chưa có wedding nào (dữ liệu
  tối thiểu: wedding + couples + events). Dữ liệu demo đầy đủ hơn
  (timeline/album/guests/RSVP/wishes/gift accounts) nằm trong
  `database/seed.sql` — chạy tay khi cần.

### Profile

- Mặc định (không profile): MySQL qua `SPRING_DATASOURCE_URL`
  (docker-compose hoặc MySQL local).
- `dev` (chạy backend riêng không cần MySQL): H2 in-memory, Hibernate tự
  tạo bảng + `DataSeeder` chèn dữ liệu tối thiểu. Chỉ dùng để chạy thử
  nhanh, không dùng cho dữ liệu thật. Xem `README.md` ở gốc.

> ⚠ **Lệch với `database/schema.sql` — cần coordinator chốt:** backend hiện
> tại đặt `ddl-auto: update` ở cả hai profile (`application.yml` và
> `application-dev.yml`), tức Hibernate sẽ tự tạo/sửa bảng theo entity.
> Tài liệu này và `schema.sql` giả định schema do SQL quản lý
> (`ddl-auto: validate`). Nếu giữ `update`, `schema.sql` và entity có thể
> trôi khỏi nhau (xem các lệch entity ở `docs/database.md` — phần ghi chú).
> Đề xuất: chuyển sang `validate` khi schema đã ổn định, hoặc dùng
> Flyway/Liquibase.

## Frontend — cấu trúc

```
frontend/
└── src/
    ├── pages/
    │   ├── PublicWedding.jsx     Trang thiệp /w/{slug}: cover, countdown,
    │   │                         couples, timeline, album, events, RSVP form,
    │   │                         wishes, gift accounts
    │   └── admin/
    │       ├── Login.jsx
    │       ├── Dashboard.jsx     Thống kê (gọi /api/admin/dashboard/stats)
    │       ├── WeddingEditor.jsx Quản lý wedding / timeline / album / events
    │       ├── Guests.jsx        Quản lý khách mời
    │       ├── Rsvps.jsx         Xem / xóa RSVP
    │       └── Wishes.jsx        Duyệt / từ chối / xóa lời chúc
    ├── components/    Countdown, Timeline, AlbumGallery, RsvpForm,
    │                  WishList, GiftBox, ...
    ├── api/           Axios instance (baseURL = VITE_API_URL, interceptor
    │                  gắn JWT), các hàm gọi API public/admin
    ├── context/       AuthContext (token, user, login/logout)
    └── routes.jsx     /w/:slug (public), /admin/* (cần đăng nhập)
```

- Trang public load dữ liệu theo `slug` từ URL (`useParams`), không hard-code
  tên cô dâu/chú rể — đổi wedding chỉ cần đổi slug.
- Trang admin kiểm tra token trước khi render (chưa đăng nhập → `/admin/login`).
- Ảnh cưới dùng URL ngoài (`picsum.photos` trong seed) hoặc upload sau này —
  file upload (nếu thêm) lưu ở `uploads/` (đã có trong `.gitignore`).

## Cấu trúc thư mục toàn dự án

```
online-wedding-invitation/
├── backend/               Spring Boot (nhóm backend)
├── frontend/              React + Vite (nhóm frontend)
├── database/
│   ├── schema.sql         Tạo 10 bảng (MySQL 8)
│   ├── seed.sql           Dữ liệu demo Thanh Trúc & Xuân Yên
│   └── README.md          Cách chạy schema + seed
├── docs/
│   ├── API.md             Hợp đồng API đầy đủ
│   ├── architecture.md    Tài liệu này
│   └── database.md        Schema, ER, ghi chú seed
├── docker-compose.yml     3 service: mysql / backend / frontend
├── .gitignore
└── README.md              Hướng dẫn tổng thể
```

## Quyết định kỹ thuật

| Quyết định | Lý do |
| --- | --- |
| MySQL 8 thay vì H2/Postgres | MySQL phổ biến, dễ deploy shared hosting/VPS; H2 chỉ là profile chạy thử nhanh |
| Schema quản lý bằng SQL tay (`schema.sql`), Hibernate nên để `validate` | Schema là hợp đồng chung của 3 nhóm; tránh Hibernate tự sinh bảng lệch nhau giữa các máy (hiện backend đang để `update` — xem ghi chú ở mục Profile) |
| Một wedding = một `slug`, mọi bảng con FK về `weddings` | Thêm thiệp mới không cần sửa code/schema; public API chỉ cần slug |
| JWT (stateless) thay vì session | Backend không lưu session, dễ scale ngang; frontend chỉ cần giữ token |
| Public API tách khỏi Admin API (`/api/public/**` vs `/api/admin/**`) | Phân quyền rõ ràng ở `SecurityConfig`; public không bao giờ thấy dữ liệu chưa duyệt / chưa publish |
| Lời chúc mặc định chưa duyệt | Chống spam hiển thị thẳng lên thiệp |
| RSVP `guest_id` nullable | Khách vãng lai vẫn RSVP được; khách trong danh sách thì đối chiếu được |
| Ảnh dùng URL ngoài, chưa upload file | Giữ backend đơn giản giai đoạn 1; upload thêm sau không phá API (chỉ đổi `image_url`) |
| `utf8mb4` | Tiếng Việt có dấu + emoji (♥ trong monogram T ♥ Y) |

## Cách mở rộng

- **Nhiều template:** thêm mã template mới vào `weddings.template`
  (vd: `classic`, `elegant`) + component hiển thị tương ứng ở frontend
  (chọn theo `template` trả về từ API). Không đổi API hay schema.
- **Nhiều wedding:** tạo wedding mới qua `POST /api/admin/weddings`
  (slug mới, vd: `lan-anh-quoc-bao`) — mọi API public/admin đã lọc theo
  slug/`wedding_id`. Trang thiệp: `/w/{slug}`. Dashboard: chọn wedding qua
  `?weddingId=`.
- **Nhiều admin / phân quyền theo wedding:** thêm bảng trung gian
  `user_weddings (user_id, wedding_id)` + kiểm tra trong service
  (admin chỉ thấy wedding của mình). Không sửa các bảng hiện có.
- **Upload ảnh:** thêm endpoint `POST /api/admin/upload` (lưu `uploads/`,
  trả URL) rồi dùng URL đó cho `cover_image_url` / `image_url` /
  `avatar_url` / `qr_image_url` — các API hiện tại không đổi.
- **Gửi thiệp / nhắc RSVP:** thêm service gửi email/SMS dựa trên
  `guests` + `rsvps` (khách chưa RSVP). Cần thêm cột trạng thái gửi tin
  vào `guests` hoặc bảng `invitations` riêng.
- **Thanh toán / quà mừng thật:** `gift_accounts` đã có sẵn `qr_image_url`;
  chỉ cần thay số tài khoản mẫu bằng số thật qua Admin.
