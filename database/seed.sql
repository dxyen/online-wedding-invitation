-- ============================================================================
-- Online Wedding Invitation — Seed data (MySQL 8.0)
-- ============================================================================
-- Chạy SAU database/schema.sql, trên database wedding_db trống (hoặc đã có
-- seed cũ — file này chạy lại được: dữ liệu seed của wedding này sẽ được
-- xóa và chèn lại, dữ liệu wedding khác không bị ảnh hưởng).
--
--   mysql -h 127.0.0.1 -P 3306 -u wedding -p wedding_db < database/seed.sql
--
-- Seed demo:
--   Cô dâu Thanh Trúc & chú rể Xuân Yên — nữ trước, monogram T ♥ Y
--   Slug: thanh-truc-xuan-yen — URL public: /w/thanh-truc-xuan-yen
--   Ngày cưới: 03/01/2026
--   Lễ Thành Hôn 09:00, Tiệc Cưới 18:00 — White Palace Hoàng Văn Thụ,
--   194 Hoàng Văn Thụ, Phú Nhuận
--
-- Các cột trong file này KHỚP 1-1 với JPA entity backend
-- (xem database/schema.sql) — đừng sửa lệch khỏi entity.
--
-- ⚠ SỐ TÀI KHOẢN HỘP QUÀ TRONG FILE NÀY LÀ SỐ MẪU (vd: 1903123456),
--   KHÔNG PHẢI SỐ THẬT. Đổi sang số thật qua trang Admin / Admin API
--   trước khi gửi thiệp cho khách.
--
-- ⚠ KHÔNG insert users / password hash trong file này. Tài khoản admin dev
--   admin@wedding.local / Admin@123 do backend DataSeeder tạo lúc chạy
--   (hash BCrypt chỉ được tạo bằng code, không ghi hash giả vào SQL).
--   Bio, timeline trong seed là dữ liệu demo, sửa được qua Admin.
-- ============================================================================

USE wedding_db;

SET NAMES utf8mb4;
SET time_zone = '+07:00';

-- ----------------------------------------------------------------------------
-- 1. Wedding — chèn mới hoặc lấy lại id nếu slug đã tồn tại (chạy lại được).
-- ----------------------------------------------------------------------------
INSERT INTO weddings
  (slug, title, wedding_date, ceremony_time, reception_time,
   venue_name, venue_address, music_url, template, greeting_message)
VALUES
  ('thanh-truc-xuan-yen', 'Thanh Trúc & Xuân Yên', '2026-01-03', '09:00:00', '18:00:00',
   'White Palace Hoàng Văn Thụ', '194 Hoàng Văn Thụ, Phú Nhuận, TP. Hồ Chí Minh',
   'https://cdn.example.com/music/wedding-theme.mp3',
   'thiep-cuoi-hien-dai',
   'Trân trọng kính mời Quý khách đến dự buổi tiệc chung vui cùng gia đình chúng tôi.')
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);

SET @wedding_id = LAST_INSERT_ID();

-- Xóa dữ liệu seed cũ của wedding này để chạy lại không bị trùng lặp.
DELETE FROM rsvps          WHERE wedding_id = @wedding_id;
DELETE FROM wishes         WHERE wedding_id = @wedding_id;
DELETE FROM gift_accounts  WHERE wedding_id = @wedding_id;
DELETE FROM guests         WHERE wedding_id = @wedding_id;
DELETE FROM album_photos   WHERE wedding_id = @wedding_id;
DELETE FROM timeline_items WHERE wedding_id = @wedding_id;
DELETE FROM wedding_events WHERE wedding_id = @wedding_id;
DELETE FROM couples        WHERE wedding_id = @wedding_id;

-- ----------------------------------------------------------------------------
-- 2. Couples — MỘT dòng/wedding, chứa cả cô dâu và chú rể (khớp entity Couple).
-- ----------------------------------------------------------------------------
INSERT INTO couples
  (wedding_id, bride_name, groom_name, bride_bio, groom_bio,
   bride_photo_url, groom_photo_url, monogram, display_name)
VALUES
  (@wedding_id, 'Thanh Trúc', 'Xuân Yên',
   'Cô dâu Thanh Trúc — dịu dàng, yêu hoa và những buổi chiều cà phê. Tin rằng hạnh phúc là những điều nhỏ bé được làm cùng nhau mỗi ngày.',
   'Chú rể Xuân Yên — người đàn ông của gia đình, mê xe và những chuyến đi xa. Gặp Trúc là điều may mắn nhất đời anh.',
   'https://picsum.photos/seed/thanh-truc-avatar/600/600',
   'https://picsum.photos/seed/xuan-yen-avatar/600/600',
   'T ♥ Y', 'Thanh Trúc & Xuân Yên');

-- ----------------------------------------------------------------------------
-- 3. Wedding events — 2 sự kiện ngày 03/01/2026 tại White Palace.
-- ----------------------------------------------------------------------------
INSERT INTO wedding_events
  (wedding_id, title, event_type, event_date, start_time, end_time,
   location, address, description, sort_order)
VALUES
  (@wedding_id, 'Lễ Thành Hôn', 'CEREMONY', '2026-01-03', '09:00:00', '11:00:00',
   'White Palace Hoàng Văn Thụ', '194 Hoàng Văn Thụ, Phú Nhuận, TP. Hồ Chí Minh',
   'Lễ Thành Hôn trong không khí ấm cúng cùng gia đình hai bên.', 1),
  (@wedding_id, 'Tiệc Cưới', 'RECEPTION', '2026-01-03', '18:00:00', '21:00:00',
   'White Palace Hoàng Văn Thụ', '194 Hoàng Văn Thụ, Phú Nhuận, TP. Hồ Chí Minh',
   'Tiệc Cưới chiêu đãi bạn bè, đồng nghiệp — cùng nâng ly chúc mừng hạnh phúc của Thanh Trúc & Xuân Yên.', 2);

-- ----------------------------------------------------------------------------
-- 4. Timeline — 4 mốc câu chuyện tình yêu.
-- ----------------------------------------------------------------------------
INSERT INTO timeline_items
  (wedding_id, title, description, event_date, image_url, sort_order)
VALUES
  (@wedding_id, 'Lần đầu gặp nhau',
   'Một buổi chiều mưa, Yên nhường Trúc chiếc ô cuối cùng ở quán cà phê quen. Câu chuyện bắt đầu từ đó.',
   '2019-02-14', 'https://picsum.photos/seed/thanh-truc-xuan-yen-timeline-1/800/600', 1),
  (@wedding_id, 'Lời tỏ tình',
   'Sau hai năm làm bạn, Yên tỏ tình với Trúc dưới ánh đèn vàng của con phố nhỏ — và Trúc đã gật đầu.',
   '2021-06-20', 'https://picsum.photos/seed/thanh-truc-xuan-yen-timeline-2/800/600', 2),
  (@wedding_id, 'Lời cầu hôn',
   'Đêm Giáng sinh, Yên quỳ gối với chiếc nhẫn giấu trong hộp quà. Trúc khóc — và nói “Em đồng ý”.',
   '2024-12-24', 'https://picsum.photos/seed/thanh-truc-xuan-yen-timeline-3/800/600', 3),
  (@wedding_id, 'Lễ ăn hỏi',
   'Hai gia đình chính thức gặp nhau, trao lễ vật và chọn ngày lành 03/01/2026 cho đám cưới.',
   '2025-11-15', 'https://picsum.photos/seed/thanh-truc-xuan-yen-timeline-4/800/600', 4);

-- ----------------------------------------------------------------------------
-- 5. Album — 6 ảnh placeholder (picsum.photos, seed cố định nên ảnh ổn định).
--    Khi có ảnh cưới thật, thay URL qua Admin (album API).
-- ----------------------------------------------------------------------------
INSERT INTO album_photos
  (wedding_id, image_url, caption, sort_order)
VALUES
  (@wedding_id, 'https://picsum.photos/seed/thanh-truc-xuan-yen-1/800/600', 'Khoảnh khắc đầu tiên', 1),
  (@wedding_id, 'https://picsum.photos/seed/thanh-truc-xuan-yen-2/800/600', 'Nắng vàng ngày ấy', 2),
  (@wedding_id, 'https://picsum.photos/seed/thanh-truc-xuan-yen-3/800/600', 'Cùng nhau đi khắp nơi', 3),
  (@wedding_id, 'https://picsum.photos/seed/thanh-truc-xuan-yen-4/800/600', 'Nụ cười của Trúc', 4),
  (@wedding_id, 'https://picsum.photos/seed/thanh-truc-xuan-yen-5/800/600', 'Ngày cầu hôn', 5),
  (@wedding_id, 'https://picsum.photos/seed/thanh-truc-xuan-yen-6/800/600', 'Chuẩn bị cho ngày trọng đại', 6);

-- ----------------------------------------------------------------------------
-- 6. Gift accounts — 3 tài khoản MẪU (SỐ MẪU, KHÔNG PHẢI SỐ THẬT).
--    Đổi sang số thật qua Admin trước khi gửi thiệp cho khách.
-- ----------------------------------------------------------------------------
INSERT INTO gift_accounts
  (wedding_id, account_holder, bank_name, account_number, branch, qr_code_url, side, sort_order)
VALUES
  (@wedding_id, 'THANH TRUC', 'Vietcombank', '1903123456', 'Chi nhánh Phú Nhuận',
   'https://picsum.photos/seed/thanh-truc-xuan-yen-qr-bride/400/400', 'BRIDE', 1),
  (@wedding_id, 'THANH TRUC', 'MB Bank', '1903123457', 'Chi nhánh Phú Nhuận',
   'https://picsum.photos/seed/thanh-truc-xuan-yen-qr-bride-mb/400/400', 'BRIDE', 2),
  (@wedding_id, 'XUAN YEN', 'Techcombank', '1903765432', 'Chi nhánh Phú Nhuận',
   'https://picsum.photos/seed/thanh-truc-xuan-yen-qr-groom/400/400', 'GROOM', 3);

-- ----------------------------------------------------------------------------
-- 7. Guests — 5 khách mời mẫu.
-- ----------------------------------------------------------------------------
INSERT INTO guests
  (wedding_id, full_name, phone, email, group_name, invited_count, notes)
VALUES
  (@wedding_id, 'Nguyễn Văn Hùng', '0901111111', 'hung.nguyen@example.com', 'Gia đình', 1, 'Bố cô dâu'),
  (@wedding_id, 'Trần Thị Lan', '0902222222', 'lan.tran@example.com', 'Gia đình', 1, 'Mẹ cô dâu'),
  (@wedding_id, 'Phạm Văn Đức', '0903333333', 'duc.pham@example.com', 'Gia đình', 1, 'Bố chú rể'),
  (@wedding_id, 'Lê Minh Anh', '0904444444', 'minhanh.le@example.com', 'Bạn thân', 2, 'Bạn thân của cô dâu từ thời đại học'),
  (@wedding_id, 'Hoàng Quốc Bảo', '0905555555', 'quocbao.hoang@example.com', 'Đồng nghiệp', 1, 'Đồng nghiệp của chú rể');

-- ----------------------------------------------------------------------------
-- 8. RSVPs — 3 mẫu (khách RSVP bằng tên + SĐT, không gắn guest_id).
-- ----------------------------------------------------------------------------
INSERT INTO rsvps
  (wedding_id, guest_name, phone, email, attending, guest_count, message)
VALUES
  (@wedding_id, 'Lê Minh Anh', '0904444444', 'minhanh.le@example.com', 1, 2,
   'Nhất định mình sẽ đến chung vui cùng hai bạn!'),
  (@wedding_id, 'Hoàng Quốc Bảo', '0905555555', 'quocbao.hoang@example.com', 1, 1,
   'Chúc mừng Yên và Trúc, hẹn gặp ở tiệc cưới!'),
  (@wedding_id, 'Nguyễn Thu Hằng', '0906666666', 'thuhang.nguyen@example.com', 0, 1,
   'Tiếc quá mình ở xa không về kịp, chúc hai bạn trăm năm hạnh phúc!');

-- ----------------------------------------------------------------------------
-- 9. Wishes — 4 mẫu: 2 đã duyệt (hiện public), 2 chờ duyệt.
-- ----------------------------------------------------------------------------
INSERT INTO wishes
  (wedding_id, sender_name, message, approved)
VALUES
  (@wedding_id, 'Minh Anh',
   'Chúc Trúc và Yên trăm năm hạnh phúc, sớm có tin vui nhé!', 1),
  (@wedding_id, 'Quốc Bảo',
   'Chúc mừng hai bạn! Một đám cưới thật đẹp và một cuộc đời thật viên mãn.', 1),
  (@wedding_id, 'Thu Hằng',
   'Từ xa gửi lời chúc tốt đẹp nhất đến hai bạn, mãi hạnh phúc nhé!', 0),
  (@wedding_id, 'Gia đình nhà gái',
   'Chúc hai con luôn yêu thương, nhường nhịn và đồng hành cùng nhau suốt đời.', 0);

-- ----------------------------------------------------------------------------
-- Kiểm tra nhanh sau khi seed (kết quả hiển thị khi chạy bằng mysql client):
-- ----------------------------------------------------------------------------
SELECT 'weddings' AS table_name, COUNT(*) AS rows FROM weddings WHERE slug = 'thanh-truc-xuan-yen'
UNION ALL SELECT 'couples', COUNT(*) FROM couples WHERE wedding_id = @wedding_id
UNION ALL SELECT 'wedding_events', COUNT(*) FROM wedding_events WHERE wedding_id = @wedding_id
UNION ALL SELECT 'timeline_items', COUNT(*) FROM timeline_items WHERE wedding_id = @wedding_id
UNION ALL SELECT 'album_photos', COUNT(*) FROM album_photos WHERE wedding_id = @wedding_id
UNION ALL SELECT 'gift_accounts', COUNT(*) FROM gift_accounts WHERE wedding_id = @wedding_id
UNION ALL SELECT 'guests', COUNT(*) FROM guests WHERE wedding_id = @wedding_id
UNION ALL SELECT 'rsvps', COUNT(*) FROM rsvps WHERE wedding_id = @wedding_id
UNION ALL SELECT 'wishes', COUNT(*) FROM wishes WHERE wedding_id = @wedding_id
UNION ALL SELECT 'wishes_approved', COUNT(*) FROM wishes WHERE wedding_id = @wedding_id AND approved = 1;
