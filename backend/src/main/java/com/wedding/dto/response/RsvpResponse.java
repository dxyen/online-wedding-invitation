package com.wedding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RsvpResponse {
    private Long id;
    private Long weddingId;
    private String guestName;
    private String phone;
    private String email;
    private boolean attending;
    private int guestCount;
    private String message;
    private LocalDateTime createdAt;
}
