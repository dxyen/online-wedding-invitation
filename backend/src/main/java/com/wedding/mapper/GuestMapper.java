package com.wedding.mapper;

import com.wedding.dto.response.GuestResponse;
import com.wedding.entity.Guest;

public interface GuestMapper {
    GuestResponse toResponse(Guest guest);
}
