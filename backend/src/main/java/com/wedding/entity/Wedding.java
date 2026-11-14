package com.wedding.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "weddings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wedding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false)
    private LocalDate weddingDate;

    private LocalTime ceremonyTime;
    private LocalTime receptionTime;

    @Column(length = 255)
    private String venueName;

    @Column(length = 500)
    private String venueAddress;

    @Column(length = 500)
    private String musicUrl;

    @Column(length = 100)
    @Builder.Default
    private String template = "thiep-cuoi-hien-dai";

    @Column(columnDefinition = "TEXT")
    private String greetingMessage;

    @OneToOne(mappedBy = "wedding", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Couple couple;

    @OneToMany(mappedBy = "wedding", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WeddingEvent> events = new ArrayList<>();

    @OneToMany(mappedBy = "wedding", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TimelineItem> timelineItems = new ArrayList<>();

    @OneToMany(mappedBy = "wedding", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AlbumPhoto> albumPhotos = new ArrayList<>();

    @OneToMany(mappedBy = "wedding", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Guest> guests = new ArrayList<>();

    @OneToMany(mappedBy = "wedding", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Rsvp> rsvps = new ArrayList<>();

    @OneToMany(mappedBy = "wedding", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Wish> wishes = new ArrayList<>();

    @OneToMany(mappedBy = "wedding", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GiftAccount> giftAccounts = new ArrayList<>();

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
