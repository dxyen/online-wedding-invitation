package com.wedding.controller;

import com.wedding.dto.response.ApiResponse;
import com.wedding.dto.response.WishResponse;
import com.wedding.service.WishService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/wishes")
public class AdminWishController {

    private final WishService wishService;

    public AdminWishController(WishService wishService) {
        this.wishService = wishService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishResponse>>> list(@RequestParam Long weddingId,
                                                                @RequestParam(required = false) Boolean approved) {
        return ResponseEntity.ok(ApiResponse.ok(wishService.listByWedding(weddingId, approved)));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<WishResponse>> approve(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Wish approved", wishService.approve(id)));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<WishResponse>> reject(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Wish rejected", wishService.reject(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        wishService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Wish deleted", null));
    }
}
