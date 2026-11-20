package com.wedding.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "gift_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GiftAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wedding_id", nullable = false)
    private Wedding wedding;

    @Column(nullable = false, length = 150)
    private String accountHolder;

    @Column(nullable = false, length = 100)
    private String bankName;

    @Column(nullable = false, length = 50)
    private String accountNumber;

    @Column(length = 150)
    private String branch;

    @Column(length = 500)
    private String qrCodeUrl;

    /** Chuỗi payload VietQR (EMVCo) — frontend vẽ mã QR từ chuỗi này. */
    @Column(length = 500)
    private String qrPayload;

    /** BRIDE or GROOM */
    @Column(length = 20)
    private String side;

    @Builder.Default
    private int sortOrder = 0;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
