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
 * 03/01/2026, Le Thanh Hon 09:00, Tiec Cuoi 18:00,
 * White Palace Hoang Van Thu, 194 Hoang Van Thu, Phu Nhuan.
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
                    .weddingDate(LocalDate.of(2026, 1, 3))
                    .ceremonyTime(LocalTime.of(9, 0))
                    .receptionTime(LocalTime.of(18, 0))
                    .venueName("White Palace Hoàng Văn Thụ")
                    .venueAddress("194 Hoàng Văn Thụ, Phú Nhuận")
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

            wedding.getEvents().add(WeddingEvent.builder()
                    .wedding(wedding).title("Lễ Thành Hôn").eventType("CEREMONY")
                    .eventDate(LocalDate.of(2026, 1, 3)).startTime(LocalTime.of(9, 0))
                    .location("White Palace Hoàng Văn Thụ").address("194 Hoàng Văn Thụ, Phú Nhuận")
                    .description("Lễ Thành Hôn lúc 09:00").sortOrder(1).build());
            wedding.getEvents().add(WeddingEvent.builder()
                    .wedding(wedding).title("Tiệc Cưới").eventType("RECEPTION")
                    .eventDate(LocalDate.of(2026, 1, 3)).startTime(LocalTime.of(18, 0))
                    .location("White Palace Hoàng Văn Thụ").address("194 Hoàng Văn Thụ, Phú Nhuận")
                    .description("Tiệc Cưới lúc 18:00").sortOrder(2).build());

            wedding.getTimelineItems().add(TimelineItem.builder()
                    .wedding(wedding).title("Lần đầu gặp nhau")
                    .description("Câu chuyện của Thanh Trúc & Xuân Yên bắt đầu từ đây.")
                    .sortOrder(1).build());
            wedding.getTimelineItems().add(TimelineItem.builder()
                    .wedding(wedding).title("Lời cầu hôn")
                    .description("Và rồi một ngày, Xuân Yên đã ngỏ lời.")
                    .sortOrder(2).build());
            wedding.getTimelineItems().add(TimelineItem.builder()
                    .wedding(wedding).title("Ngày cưới 03/01/2026")
                    .description("Chúng tôi chính thức về chung một nhà.")
                    .eventDate(LocalDate.of(2026, 1, 3)).sortOrder(3).build());

            wedding.getAlbumPhotos().add(AlbumPhoto.builder()
                    .wedding(wedding).imageUrl("/images/album/1.jpg").caption("Thanh Trúc & Xuân Yên").sortOrder(1).build());
            wedding.getAlbumPhotos().add(AlbumPhoto.builder()
                    .wedding(wedding).imageUrl("/images/album/2.jpg").caption("Khoảnh khắc yêu thương").sortOrder(2).build());

            wedding.getGiftAccounts().add(GiftAccount.builder()
                    .wedding(wedding).accountHolder("Thanh Trúc").bankName("Vietcombank")
                    .accountNumber("0000000000").side("BRIDE").sortOrder(1).build());
            wedding.getGiftAccounts().add(GiftAccount.builder()
                    .wedding(wedding).accountHolder("Xuân Yên").bankName("Vietcombank")
                    .accountNumber("0000000000").side("GROOM").sortOrder(2).build());

            weddingRepository.save(wedding);
        }
    }
}
