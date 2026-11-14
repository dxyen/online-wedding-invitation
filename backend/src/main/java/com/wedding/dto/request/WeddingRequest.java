package com.wedding.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeddingRequest {
    @NotBlank(message = "Slug is required")
    @Size(max = 200)
    private String slug;

    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @NotNull(message = "Wedding date is required")
    private LocalDate weddingDate;

    private LocalTime ceremonyTime;
    private LocalTime receptionTime;

    @Size(max = 255)
    private String venueName;

    @Size(max = 500)
    private String venueAddress;

    @Size(max = 500)
    private String musicUrl;

    @Size(max = 100)
    private String template;

    private String greetingMessage;

    @Valid
    private CoupleRequest couple;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoupleRequest {
        @NotBlank(message = "Bride name is required")
        @Size(max = 150)
        private String brideName;

        @NotBlank(message = "Groom name is required")
        @Size(max = 150)
        private String groomName;

        private String brideBio;
        private String groomBio;

        @Size(max = 500)
        private String bridePhotoUrl;

        @Size(max = 500)
        private String groomPhotoUrl;

        @Size(max = 50)
        private String monogram;

        @Size(max = 255)
        private String displayName;
    }
}
