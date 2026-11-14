package com.wedding.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rsvps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rsvp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wedding_id", nullable = false)
    private Wedding wedding;

    @Column(nullable = false, length = 150)
    private String guestName;

    @Column(length = 30)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(nullable = false)
    private boolean attending;

    @Column(nullable = false)
    @Builder.Default
    private int guestCount = 1;

    @Column(columnDefinition = "TEXT")
    private String message;

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
