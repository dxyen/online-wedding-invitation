package com.wedding.config;

import com.wedding.entity.*;
import com.wedding.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Seeds the DB only when it is empty.
 * Admin credentials: admin@wedding.local / Admin@123 — the password is
 * hashed here at runtime with BCrypt PasswordEncoder; no plaintext password
 * and no fabricated hash is stored anywhere in source or SQL.
 * Seed wedding: Thanh Truc &amp; Xuan Yen, slug thanh-truc-xuan-yen,
 * 27/12/2026, Le Thanh Hon &amp; Tiec Cuoi gop chung 08:00 (don khach 07:30),
 * tai tu gia — Thach Hung, An Giang (ban do: https://maps.app.goo.gl/DGPB7o7WHyMbqfGv9).
 * Tai khoan hop qua la SO THAT (TPBank, VietQR).
 * All seed values are editable later via the Admin API.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WeddingRepository weddingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, WeddingRepository weddingRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.weddingRepository = weddingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .email("admin@wedding.local")
                    .password(passwordEncoder.encode("Admin@123"))
                    .fullName("Wedding Admin")
                    .role("ROLE_ADMIN")
                    .enabled(true)
                    .build();
            userRepository.save(admin);
        }

        if (weddingRepository.count() == 0) {
            Wedding wedding = Wedding.builder()
                    .slug("thanh-truc-xuan-yen")
                    .title("Thanh Trúc & Xuân Yên")
                    .weddingDate(LocalDate.of(2026, 12, 27))
                    .ceremonyTime(LocalTime.of(8, 0))
                    .receptionTime(LocalTime.of(8, 0))
                    .venueName("Tư gia")
                    .venueAddress("Thạnh Hưng, An Giang")
                    .template("thiep-cuoi-hien-dai")
                    .greetingMessage("Trân trọng kính mời quý khách đến dự lễ cưới của chúng tôi.")
                    .build();

            Couple couple = Couple.builder()
                    .wedding(wedding)
                    .brideName("Thanh Trúc")
                    .groomName("Xuân Yên")
                    .monogram("T ♥ Y")
                    .displayName("Thanh Trúc & Xuân Yên")
                    .build();
            wedding.setCouple(couple);

            // Lễ Thành Hôn và Tiệc Cưới gộp chung một buổi sáng tại tư gia.
            wedding.getEvents().add(WeddingEvent.builder()
                    .wedding(wedding).title("Lễ Thành Hôn & Tiệc Cưới").eventType("CEREMONY")
                    .eventDate(LocalDate.of(2026, 12, 27)).startTime(LocalTime.of(8, 0))
                    .endTime(LocalTime.of(10, 30))
                    .location("Tư gia").address("Thạnh Hưng, An Giang")
                    .description("Lễ thành hôn và tiệc cưới được tổ chức tại tư gia — nghi lễ truyền thống cùng hai họ, nối tiếp là tiệc mừng chung vui cùng gia đình và quan khách.").sortOrder(1).build());

            wedding.getTimelineItems().add(TimelineItem.builder()
                    .wedding(wedding).title("Lần đầu gặp nhau")
                    .description("Câu chuyện của Thanh Trúc & Xuân Yên bắt đầu từ đây.")
                    .sortOrder(1).build());
            wedding.getTimelineItems().add(TimelineItem.builder()
                    .wedding(wedding).title("Lời cầu hôn")
                    .description("Và rồi một ngày, Xuân Yên đã ngỏ lời.")
                    .sortOrder(2).build());
            wedding.getTimelineItems().add(TimelineItem.builder()
                    .wedding(wedding).title("Ngày cưới 27/12/2026")
                    .description("Chúng tôi chính thức về chung một nhà.")
                    .eventDate(LocalDate.of(2026, 12, 27)).sortOrder(3).build());

            wedding.getAlbumPhotos().add(AlbumPhoto.builder()
                    .wedding(wedding).imageUrl("/images/album/1.jpg").caption("Thanh Trúc & Xuân Yên").sortOrder(1).build());
            wedding.getAlbumPhotos().add(AlbumPhoto.builder()
                    .wedding(wedding).imageUrl("/images/album/2.jpg").caption("Khoảnh khắc yêu thương").sortOrder(2).build());

            // Tài khoản hộp quà THẬT (TPBank, VietQR) — qrPayload là chuỗi
            // payload VietQR giải mã từ mã QR thật; frontend vẽ mã QR từ chuỗi này.
            wedding.getGiftAccounts().add(GiftAccount.builder()
                    .wedding(wedding).accountHolder("VO THI THANH TRUC").bankName("TPBank")
                    .accountNumber("0000 0846 416").side("BRIDE")
                    .qrPayload("0002010102111531397007040052044600000000084641638550010A000000727012500069704230111000008464160208QRIBFTTA5204513753037045802VN5917VO THI THANH TRUC6006Ha Noi8707CLASSIC63040E47")
                    .sortOrder(1).build());
            wedding.getGiftAccounts().add(GiftAccount.builder()
                    .wedding(wedding).accountHolder("DO XUAN YEN").bankName("TPBank")
                    .accountNumber("3719 1472 484").side("GROOM")
                    .qrPayload("0002010102111531397007040052044600003719147248438530010A000000727012300069704230109doxuanyen0208QRIBFTTA5204513753037045802VN5911DO XUAN YEN6006Ha Noi8707CLASSIC63045EFF")
                    .sortOrder(2).build());

            weddingRepository.save(wedding);
        }
    }
}
