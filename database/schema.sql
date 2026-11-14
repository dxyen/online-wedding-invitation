-- ============================================================================
-- Online Wedding Invitation — Database Schema (MySQL 8.0)
-- ============================================================================
-- Database : wedding_db
-- Charset  : utf8mb4 / utf8mb4_unicode_ci (tiếng Việt có dấu, emoji ♥)
-- Engine   : InnoDB (khóa ngoại, transaction)
--
-- QUAN TRỌNG: schema này KHỚP 1-1 với các JPA entity trong
-- backend/src/main/java/com/wedding/entity/ (Spring PhysicalNamingStrategy:
-- camelCase -> snake_case, tên bảng lấy từ @Table). Backend chạy với
-- ddl-auto: update nên Hibernate tự tạo/cập nhật bảng theo entity;
-- file này dùng khi khởi tạo MySQL bằng tay / trên môi trường không chạy
-- Hibernate (xem database/README.md). Đừng sửa lệch khỏi entity.
--
-- Cách chạy:
--   mysql -h 127.0.0.1 -P 3306 -u wedding -p wedding_db < database/schema.sql
--
-- Seed demo (Thanh Trúc & Xuân Yên, 03/01/2026) nằm ở database/seed.sql,
-- chạy SAU file này. Tài khoản admin dev KHÔNG nằm trong schema/seed SQL:
-- admin@wedding.local / Admin@123 do backend DataSeeder tạo lúc chạy
-- (password hash BCrypt chỉ được tạo bằng code, không ghi hash giả vào SQL).
-- ============================================================================

CREATE DATABASE IF NOT EXISTS wedding_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE wedding_db;

SET NAMES utf8mb4;
SET time_zone = '+07:00';

-- ----------------------------------------------------------------------------
-- users: tài khoản quản trị (Admin). role lưu dạng ROLE_ADMIN (như entity User).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         BIGINT       NOT NULL AUTO_INCREMENT,
  email      VARCHAR(150) NOT NULL,
  password   VARCHAR(255) NOT NULL COMMENT 'BCrypt hash, do backend DataSeeder / AuthService tạo — không ghi tay vào SQL',
  full_name  VARCHAR(150) NULL,
  role       VARCHAR(30)  NOT NULL DEFAULT 'ROLE_ADMIN',
  enabled    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at TIMESTAMP    NULL,
  updated_at TIMESTAMP    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Tài khoản quản trị';

-- ----------------------------------------------------------------------------
-- weddings: một đám cưới = một thiệp, định danh bằng slug.
-- Ví dụ seed: slug = thanh-truc-xuan-yen, URL public /w/thanh-truc-xuan-yen
-- Tên cô dâu/chú rể nằm ở bảng couples (quan hệ 1-1), không nằm ở đây.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weddings (
  id               BIGINT       NOT NULL AUTO_INCREMENT,
  slug             VARCHAR(200) NOT NULL COMMENT 'Duy nhất, dùng trong URL public, vd: thanh-truc-xuan-yen',
  title            VARCHAR(255) NOT NULL COMMENT 'Vd: Thanh Trúc & Xuân Yên',
  wedding_date     DATE         NOT NULL COMMENT 'Ngày cưới, vd: 2026-01-03',
  ceremony_time    TIME         NULL COMMENT 'Giờ Lễ Thành Hôn, vd: 09:00:00',
  reception_time   TIME         NULL COMMENT 'Giờ Tiệc Cưới, vd: 18:00:00',
  venue_name       VARCHAR(255) NULL COMMENT 'Vd: White Palace Hoàng Văn Thụ',
  venue_address    VARCHAR(500) NULL COMMENT 'Vd: 194 Hoàng Văn Thụ, Phú Nhuận, TP. Hồ Chí Minh',
  music_url        VARCHAR(500) NULL COMMENT 'Nhạc nền thiệp (mp3)',
  template         VARCHAR(100) NOT NULL DEFAULT 'thiep-cuoi-hien-dai' COMMENT 'Mã template hiển thị, vd: thiep-cuoi-hien-dai',
  greeting_message TEXT         NULL COMMENT 'Lời chào / lời mời trên thiệp',
  created_at       TIMESTAMP    NULL,
  updated_at       TIMESTAMP    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_weddings_slug (slug)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Đám cưới / thiệp cưới';

-- ----------------------------------------------------------------------------
-- couples: thông tin cô dâu / chú rể của một wedding (MỘT dòng/wedding,
-- chứa cả bride_* và groom_* — khớp entity Couple, quan hệ 1-1 với weddings).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS couples (
  id             BIGINT       NOT NULL AUTO_INCREMENT,
  wedding_id     BIGINT       NOT NULL,
  bride_name     VARCHAR(150) NOT NULL COMMENT 'Tên cô dâu, vd: Thanh Trúc',
  groom_name     VARCHAR(150) NOT NULL COMMENT 'Tên chú rể, vd: Xuân Yên',
  bride_bio      TEXT         NULL COMMENT 'Giới thiệu cô dâu',
  groom_bio      TEXT         NULL COMMENT 'Giới thiệu chú rể',
  bride_photo_url VARCHAR(500) NULL,
  groom_photo_url VARCHAR(500) NULL,
  monogram       VARCHAR(50)  NULL COMMENT 'Vd: T ♥ Y',
  display_name   VARCHAR(255) NULL COMMENT 'Tên hiển thị, vd: Thanh Trúc & Xuân Yên (nữ trước)',
  created_at     TIMESTAMP    NULL,
  updated_at     TIMESTAMP    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_couples_wedding_id (wedding_id),
  KEY idx_couples_wedding_id (wedding_id),
  CONSTRAINT fk_couples_wedding
    FOREIGN KEY (wedding_id) REFERENCES weddings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Cô dâu / chú rể (1 dòng / wedding)';

-- ----------------------------------------------------------------------------
-- wedding_events: các sự kiện trong ngày cưới (lễ, tiệc...).
-- event_type: CEREMONY = Lễ Thành Hôn, RECEPTION = Tiệc Cưới.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wedding_events (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  wedding_id  BIGINT       NOT NULL,
  title       VARCHAR(200) NOT NULL COMMENT 'Vd: Lễ Thành Hôn, Tiệc Cưới',
  event_type  VARCHAR(50)  NULL COMMENT 'CEREMONY | RECEPTION',
  event_date  DATE         NOT NULL,
  start_time  TIME         NULL COMMENT 'Vd: 09:00:00',
  end_time    TIME         NULL,
  location    VARCHAR(255) NULL COMMENT 'Vd: White Palace Hoàng Văn Thụ',
  address     VARCHAR(500) NULL COMMENT 'Vd: 194 Hoàng Văn Thụ, Phú Nhuận, TP. Hồ Chí Minh',
  description TEXT         NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NULL,
  updated_at  TIMESTAMP    NULL,
  PRIMARY KEY (id),
  KEY idx_wedding_events_wedding_id (wedding_id),
  CONSTRAINT fk_wedding_events_wedding
    FOREIGN KEY (wedding_id) REFERENCES weddings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Sự kiện cưới (lễ / tiệc)';

-- ----------------------------------------------------------------------------
-- timeline_items: câu chuyện tình yêu, sắp xếp theo sort_order.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_items (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  wedding_id  BIGINT       NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT         NULL,
  event_date  DATE         NULL COMMENT 'Ngày của mốc kỷ niệm (có thể chỉ năm/tháng)',
  image_url   VARCHAR(500) NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NULL,
  updated_at  TIMESTAMP    NULL,
  PRIMARY KEY (id),
  KEY idx_timeline_items_wedding_id (wedding_id),
  CONSTRAINT fk_timeline_items_wedding
    FOREIGN KEY (wedding_id) REFERENCES weddings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Timeline câu chuyện tình yêu';

-- ----------------------------------------------------------------------------
-- album_photos: ảnh album cưới.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS album_photos (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  wedding_id  BIGINT       NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  caption     VARCHAR(255) NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NULL,
  updated_at  TIMESTAMP    NULL,
  PRIMARY KEY (id),
  KEY idx_album_photos_wedding_id (wedding_id),
  CONSTRAINT fk_album_photos_wedding
    FOREIGN KEY (wedding_id) REFERENCES weddings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Ảnh album cưới';

-- ----------------------------------------------------------------------------
-- guests: danh sách khách mời. invited_count = số người được mời đi kèm.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guests (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  wedding_id    BIGINT       NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  phone         VARCHAR(30)  NULL,
  email         VARCHAR(150) NULL,
  group_name    VARCHAR(100) NULL COMMENT 'Vd: Gia đình, Bạn thân, Đồng nghiệp',
  invited_count INT          NOT NULL DEFAULT 1,
  notes         TEXT         NULL,
  created_at    TIMESTAMP    NULL,
  updated_at    TIMESTAMP    NULL,
  PRIMARY KEY (id),
  KEY idx_guests_wedding_id (wedding_id),
  KEY idx_guests_email (email),
  CONSTRAINT fk_guests_wedding
    FOREIGN KEY (wedding_id) REFERENCES weddings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Khách mời';

-- ----------------------------------------------------------------------------
-- rsvps: xác nhận tham dự. Không có guest_id — khách RSVP bằng tên + SĐT,
-- không bắt buộc phải có trong danh sách guests (khớp entity Rsvp).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rsvps (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  wedding_id  BIGINT       NOT NULL,
  guest_name  VARCHAR(150) NOT NULL,
  phone       VARCHAR(30)  NULL,
  email       VARCHAR(150) NULL,
  attending   TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '1 = tham dự, 0 = không tham dự',
  guest_count INT          NOT NULL DEFAULT 1 COMMENT 'Số người đi (tính cả bản thân)',
  message     TEXT         NULL COMMENT 'Lời nhắn kèm RSVP',
  created_at  TIMESTAMP    NULL,
  updated_at  TIMESTAMP    NULL,
  PRIMARY KEY (id),
  KEY idx_rsvps_wedding_id (wedding_id),
  KEY idx_rsvps_email (email),
  CONSTRAINT fk_rsvps_wedding
    FOREIGN KEY (wedding_id) REFERENCES weddings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Xác nhận tham dự (RSVP)';

-- ----------------------------------------------------------------------------
-- wishes: lời chúc của khách. Mặc định chưa duyệt (approved = 0),
-- chỉ lời chúc đã duyệt mới hiển thị công khai.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishes (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  wedding_id  BIGINT       NOT NULL,
  sender_name VARCHAR(150) NOT NULL,
  message     TEXT         NOT NULL,
  approved    TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '0 = chờ duyệt, 1 = đã duyệt (mới hiện public)',
  created_at  TIMESTAMP    NULL,
  updated_at  TIMESTAMP    NULL,
  PRIMARY KEY (id),
  KEY idx_wishes_wedding_id (wedding_id),
  CONSTRAINT fk_wishes_wedding
    FOREIGN KEY (wedding_id) REFERENCES weddings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Lời chúc';

-- ----------------------------------------------------------------------------
-- gift_accounts: tài khoản nhận quà mừng (hộp quà / mừng cưới).
-- side: BRIDE = cô dâu, GROOM = chú rể. branch = chi nhánh ngân hàng.
-- LƯU Ý: số tài khoản trong seed là SỐ MẪU, không phải số thật.
-- Khi dùng thật, admin cập nhật số thật qua Admin API / trang quản trị.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gift_accounts (
  id             BIGINT       NOT NULL AUTO_INCREMENT,
  wedding_id     BIGINT       NOT NULL,
  account_holder VARCHAR(150) NOT NULL COMMENT 'Tên chủ tài khoản',
  bank_name      VARCHAR(100) NOT NULL COMMENT 'Vd: Vietcombank, Techcombank',
  account_number VARCHAR(50)  NOT NULL,
  branch         VARCHAR(150) NULL COMMENT 'Chi nhánh ngân hàng',
  qr_code_url    VARCHAR(500) NULL COMMENT 'Ảnh QR chuyển khoản',
  side           VARCHAR(20)  NULL COMMENT 'BRIDE = cô dâu, GROOM = chú rể',
  sort_order     INT          NOT NULL DEFAULT 0,
  created_at     TIMESTAMP    NULL,
  updated_at     TIMESTAMP    NULL,
  PRIMARY KEY (id),
  KEY idx_gift_accounts_wedding_id (wedding_id),
  CONSTRAINT fk_gift_accounts_wedding
    FOREIGN KEY (wedding_id) REFERENCES weddings (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Tài khoản nhận quà mừng (số trong seed là số mẫu)';
