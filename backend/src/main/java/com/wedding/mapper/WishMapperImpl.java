package com.wedding.mapper;

import com.wedding.dto.response.WishResponse;
import com.wedding.entity.Wish;
import org.springframework.stereotype.Component;

@Component
public class WishMapperImpl implements WishMapper {
    @Override
    public WishResponse toResponse(Wish wish) {
        if (wish == null) return null;
        return WishResponse.builder()
                .id(wish.getId()).weddingId(wish.getWedding() != null ? wish.getWedding().getId() : null)
                .senderName(wish.getSenderName()).message(wish.getMessage())
                .approved(wish.isApproved()).createdAt(wish.getCreatedAt())
                .build();
    }
}
