package com.wedding.controller;

import com.wedding.dto.response.ApiResponse;
import com.wedding.dto.response.StatsResponse;
import com.wedding.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminStatsController {

    private final StatsService statsService;

    public AdminStatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsResponse>> stats(@RequestParam Long weddingId) {
        return ResponseEntity.ok(ApiResponse.ok(statsService.getStats(weddingId)));
    }
}
