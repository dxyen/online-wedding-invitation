package com.wedding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeddingResponse {
    private Long id;
    private String slug;
    private String title;
    private LocalDate weddingDate;
    private LocalTime ceremonyTime;
    private LocalTime receptionTime;
    private String venueName;
    private String venueAddress;
    private String musicUrl;
    private String template;
    private String greetingMessage;
    private CoupleResponse couple;
    private List<WeddingEventResponse> events;
    private List<GiftAccountResponse> giftAccounts;
}
