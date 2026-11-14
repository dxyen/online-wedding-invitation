package com.wedding.mapper;

import com.wedding.dto.response.RsvpResponse;
import com.wedding.entity.Rsvp;
import org.springframework.stereotype.Component;

@Component
public class RsvpMapperImpl implements RsvpMapper {
    @Override
    public RsvpResponse toResponse(Rsvp rsvp) {
        if (rsvp == null) return null;
        return RsvpResponse.builder()
                .id(rsvp.getId()).weddingId(rsvp.getWedding() != null ? rsvp.getWedding().getId() : null)
                .guestName(rsvp.getGuestName()).phone(rsvp.getPhone()).email(rsvp.getEmail())
                .attending(rsvp.isAttending()).guestCount(rsvp.getGuestCount())
                .message(rsvp.getMessage()).createdAt(rsvp.getCreatedAt())
                .build();
    }
}
