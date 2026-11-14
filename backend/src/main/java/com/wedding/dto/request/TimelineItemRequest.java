package com.wedding.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimelineItemRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    private String description;
    private LocalDate eventDate;

    @Size(max = 500)
    private String imageUrl;

    private Integer sortOrder;
}
