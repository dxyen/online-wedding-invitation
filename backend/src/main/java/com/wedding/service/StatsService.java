package com.wedding.service;

import com.wedding.dto.response.StatsResponse;

public interface StatsService {
    StatsResponse getStats(Long weddingId);
}
