package com.wedding.mapper;

import com.wedding.dto.response.GuestResponse;
import com.wedding.entity.Guest;
import org.springframework.stereotype.Component;

@Component
public class GuestMapperImpl implements GuestMapper {
    @Override
    public GuestResponse toResponse(Guest guest) {
        if (guest == null) return null;
        return GuestResponse.builder()
                .id(guest.getId()).weddingId(guest.getWedding() != null ? guest.getWedding().getId() : null)
                .fullName(guest.getFullName()).phone(guest.getPhone()).email(guest.getEmail())
                .groupName(guest.getGroupName()).invitedCount(guest.getInvitedCount()).notes(guest.getNotes())
                .build();
    }
}
