package com.wedding.service;

import com.wedding.dto.request.WishRequest;
import com.wedding.dto.response.WishResponse;

import java.util.List;

public interface WishService {
    WishResponse create(String slug, WishRequest request);
    List<WishResponse> listApproved(String slug);
    List<WishResponse> listByWedding(Long weddingId, Boolean approved);
    WishResponse getById(Long id);
    WishResponse approve(Long id);
    WishResponse reject(Long id);
    void delete(Long id);
}
