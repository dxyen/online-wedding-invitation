package com.wedding.mapper;

import com.wedding.dto.response.RsvpResponse;
import com.wedding.entity.Rsvp;

public interface RsvpMapper {
    RsvpResponse toResponse(Rsvp rsvp);
}
