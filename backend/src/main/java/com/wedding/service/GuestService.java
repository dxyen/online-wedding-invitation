package com.wedding.service;

import com.wedding.dto.request.GuestRequest;
import com.wedding.dto.response.GuestResponse;

import java.util.List;

public interface GuestService {
    List<GuestResponse> listByWedding(Long weddingId);
    GuestResponse getById(Long id);
    GuestResponse create(Long weddingId, GuestRequest request);
    GuestResponse update(Long id, GuestRequest request);
    void delete(Long id);
}
