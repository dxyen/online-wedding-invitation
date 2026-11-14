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
public class WishResponse {
    private Long id;
    private Long weddingId;
    private String senderName;
    private String message;
    private boolean approved;
    private LocalDateTime createdAt;
}
