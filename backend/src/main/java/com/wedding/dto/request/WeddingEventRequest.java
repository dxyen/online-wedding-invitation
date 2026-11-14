package com.wedding.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeddingEventRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @Size(max = 50)
    private String eventType;

    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;

    @Size(max = 255)
    private String location;

    @Size(max = 500)
    private String address;

    private String description;
    private Integer sortOrder;
}
