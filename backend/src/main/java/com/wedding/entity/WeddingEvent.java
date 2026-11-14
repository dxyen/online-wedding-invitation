package com.wedding.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "wedding_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeddingEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wedding_id", nullable = false)
    private Wedding wedding;

    @Column(nullable = false, length = 200)
    private String title;

    /** e.g. CEREMONY, RECEPTION, TEA_CEREMONY */
    @Column(length = 50)
    private String eventType;

    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;

    @Column(length = 255)
    private String location;

    @Column(length = 500)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

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
