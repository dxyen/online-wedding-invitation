package com.wedding.controller;

import com.wedding.dto.request.RsvpRequest;
import com.wedding.dto.request.WishRequest;
import com.wedding.dto.response.*;
import com.wedding.service.RsvpService;
import com.wedding.service.WeddingService;
import com.wedding.service.WishService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/weddings")
public class PublicWeddingController {

    private final WeddingService weddingService;
    private final RsvpService rsvpService;
    private final WishService wishService;

    public PublicWeddingController(WeddingService weddingService, RsvpService rsvpService, WishService wishService) {
        this.weddingService = weddingService;
        this.rsvpService = rsvpService;
        this.wishService = wishService;
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<WeddingResponse>> getWedding(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(weddingService.getBySlug(slug)));
    }

    @GetMapping("/{slug}/timeline")
    public ResponseEntity<ApiResponse<List<TimelineItemResponse>>> getTimeline(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(weddingService.getTimeline(slug)));
    }

    @GetMapping("/{slug}/album")
    public ResponseEntity<ApiResponse<List<AlbumPhotoResponse>>> getAlbum(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(weddingService.getAlbum(slug)));
    }

    @GetMapping("/{slug}/events")
    public ResponseEntity<ApiResponse<List<WeddingEventResponse>>> getEvents(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(weddingService.getEvents(slug)));
    }

    @GetMapping("/{slug}/wishes")
    public ResponseEntity<ApiResponse<List<WishResponse>>> getWishes(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(wishService.listApproved(slug)));
    }

    @GetMapping("/{slug}/gift-accounts")
    public ResponseEntity<ApiResponse<List<GiftAccountResponse>>> getGiftAccounts(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(weddingService.getGiftAccounts(slug)));
    }

    @PostMapping("/{slug}/rsvp")
    public ResponseEntity<ApiResponse<RsvpResponse>> createRsvp(@PathVariable String slug,
                                                                @Valid @RequestBody RsvpRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("RSVP received", rsvpService.create(slug, request)));
    }

    @PostMapping("/{slug}/wishes")
    public ResponseEntity<ApiResponse<WishResponse>> createWish(@PathVariable String slug,
                                                                @Valid @RequestBody WishRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Wish received and pending approval", wishService.create(slug, request)));
    }
}
