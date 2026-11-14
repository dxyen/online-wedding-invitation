package com.wedding.mapper;

import com.wedding.dto.response.WishResponse;
import com.wedding.entity.Wish;

public interface WishMapper {
    WishResponse toResponse(Wish wish);
}
