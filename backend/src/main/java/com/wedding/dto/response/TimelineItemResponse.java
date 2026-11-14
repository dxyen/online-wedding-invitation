package com.wedding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimelineItemResponse {
    private Long id;
    private Long weddingId;
    private String title;
    private String description;
    private LocalDate eventDate;
    private String imageUrl;
    private int sortOrder;
}
