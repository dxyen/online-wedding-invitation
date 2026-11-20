# Database — Online Wedding Invitation

MySQL 8.0, database `wedding_db`, charset `utf8mb4` (tiếng Việt có dấu, emoji ♥).

| File | Nội dung |
| --- | --- |
| `schema.sql` | Tạo database + 10 bảng: `users`, `weddings`, `couples`, `wedding_events`, `timeline_items`, `album_photos`, `guests`, `rsvps`, `wishes`, `gift_accounts`. Chạy 1 lần, an toàn chạy lại (`IF NOT EXISTS`). |
| `seed.sql` | Dữ liệu demo: Thanh Trúc & Xuân Yên, slug `thanh-truc-xuan-yen`, cưới 27/12/2026. Chạy sau schema, chạy lại được (xóa + chèn lại dữ liệu của wedding này). |

> ⚠ **Số tài khoản hộp quà trong seed là SỐ MẪU** (vd: `1903123456`), không phải số thật. Đổi sang số thật qua trang Admin trước khi gửi thiệp cho khách.
>
> ⚠ **Không có user/password hash trong SQL.** Tài khoản admin dev `admin@wedding.local` / `Admin@123` do backend `DataSeeder` tạo lúc chạy (hash BCrypt chỉ tạo bằng code). Xem `docs/database.md` và `README.md` ở gốc.

## Cách 1 — Chạy bằng mysql client (MySQL đã chạy sẵn)

```bash
# 1. Tạo schema (tạo luôn database wedding_db nếu chưa có)
mysql -h 127.0.0.1 -P 3306 -u root -p < database/schema.sql

# 2. Chèn seed demo
mysql -h 127.0.0.1 -P 3306 -u root -p < database/seed.sql
```

Dùng user ứng dụng thay cho `root` (user này do `docker-compose.yml` tạo sẵn,
hoặc tạo tay — xem bên dưới):

```bash
mysql -h 127.0.0.1 -P 3306 -u wedding -p wedding_db < database/schema.sql
mysql -h 127.0.0.1 -P 3306 -u wedding -p wedding_db < database/seed.sql
```

Kiểm tra nhanh:

```sql
USE wedding_db;
SELECT id, slug, title, wedding_date FROM weddings;
SELECT COUNT(*) FROM couples;          -- kỳ vọng: 2
SELECT COUNT(*) FROM wedding_events;   -- kỳ vọng: 2
SELECT COUNT(*) FROM timeline_items;   -- kỳ vọng: 4
SELECT COUNT(*) FROM album_photos;     -- kỳ vọng: 6
SELECT COUNT(*) FROM gift_accounts;    -- kỳ vọng: 3 (số mẫu)
SELECT COUNT(*) FROM guests;           -- kỳ vọng: 5
SELECT COUNT(*) FROM rsvps;            -- kỳ vọng: 3
SELECT COUNT(*) FROM wishes WHERE is_approved = 1; -- kỳ vọng: 2
```

> `seed.sql` cuối file đã có sẵn câu `SELECT ... UNION ALL` in ra số dòng từng bảng để đối chiếu.

## Cách 2 — Chạy bằng docker-compose (khuyên dùng)

Từ thư mục gốc dự án:

```bash
# Chỉ khởi động MySQL (backend/frontend chưa cần)
docker compose up -d mysql

# Đợi MySQL healthy rồi chạy schema + seed
docker compose exec -T mysql mysql -u root -p"${MYSQL_ROOT_PASSWORD:-rootpassword}" < database/schema.sql
docker compose exec -T mysql mysql -u root -p"${MYSQL_ROOT_PASSWORD:-rootpassword}" < database/seed.sql
```

Hoặc chạy cả stack — backend khi khởi động sẽ tự tạo bảng bằng JPA/Hibernate
và `DataSeeder` sẽ chèn admin + seed nếu database trống (xem `docs/architecture.md`).
Trong trường hợp đó chỉ cần chạy `seed.sql` nếu muốn dữ liệu demo đầy đủ
(timeline/album/khách mời...), vì `DataSeeder` chỉ đảm bảo wedding + admin tối thiểu.

```bash
docker compose up -d
```

## Tạo user MySQL bằng tay (khi không dùng docker-compose)

```sql
CREATE DATABASE IF NOT EXISTS wedding_db
  DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'wedding'@'%' IDENTIFIED BY 'thay-doi-mat-khau-nay';
GRANT ALL PRIVILEGES ON wedding_db.* TO 'wedding'@'%';
FLUSH PRIVILEGES;
```

Biến môi trường tương ứng trong `.env` (xem `README.md` ở gốc):

```env
MYSQL_ROOT_PASSWORD=doi-mat-khau-root
MYSQL_DATABASE=wedding_db
MYSQL_USER=wedding
MYSQL_PASSWORD=doi-mat-khau-nay
```

## Reset database

```bash
# Xóa toàn bộ dữ liệu và làm lại từ đầu
docker compose down -v            # xóa cả volume mysql_data
docker compose up -d mysql
docker compose exec -T mysql mysql -u root -p"${MYSQL_ROOT_PASSWORD:-rootpassword}" < database/schema.sql
docker compose exec -T mysql mysql -u root -p"${MYSQL_ROOT_PASSWORD:-rootpassword}" < database/seed.sql
```

> `docker compose down -v` xóa **mọi** dữ liệu MySQL. Chỉ dùng ở môi trường dev.
