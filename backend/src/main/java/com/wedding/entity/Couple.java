package com.wedding.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "couples")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Couple {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wedding_id", nullable = false, unique = true)
    private Wedding wedding;

    @Column(nullable = false, length = 150)
    private String brideName;

    @Column(nullable = false, length = 150)
    private String groomName;

    @Column(columnDefinition = "TEXT")
    private String brideBio;

    @Column(columnDefinition = "TEXT")
    private String groomBio;

    @Column(length = 500)
    private String bridePhotoUrl;

    @Column(length = 500)
    private String groomPhotoUrl;

    @Column(length = 50)
    private String monogram;

    @Column(length = 255)
    private String displayName;

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
