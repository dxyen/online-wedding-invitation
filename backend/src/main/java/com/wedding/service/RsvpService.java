package com.wedding.service;

import com.wedding.dto.request.RsvpRequest;
import com.wedding.dto.response.RsvpResponse;

import java.util.List;

public interface RsvpService {
    RsvpResponse create(String slug, RsvpRequest request);
    List<RsvpResponse> listByWedding(Long weddingId);
    RsvpResponse getById(Long id);
    RsvpResponse update(Long id, RsvpRequest request);
    void delete(Long id);
}
