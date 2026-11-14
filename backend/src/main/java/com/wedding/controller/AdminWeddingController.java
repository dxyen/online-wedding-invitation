package com.wedding.controller;

import com.wedding.dto.request.*;
import com.wedding.dto.response.*;
import com.wedding.service.WeddingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/weddings")
public class AdminWeddingController {

    private final WeddingService weddingService;

    public AdminWeddingController(WeddingService weddingService) {
        this.weddingService = weddingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WeddingResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(weddingService.listAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WeddingResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(weddingService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WeddingResponse>> create(@Valid @RequestBody WeddingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Wedding created", weddingService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WeddingResponse>> update(@PathVariable Long id,
                                                               @Valid @RequestBody WeddingRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Wedding updated", weddingService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        weddingService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Wedding deleted", null));
    }

    // ---- timeline ----
    @GetMapping("/{weddingId}/timeline")
    public ResponseEntity<ApiResponse<List<TimelineItemResponse>>> listTimeline(@PathVariable Long weddingId) {
        // Admin view reuses the same ordered list; slug lookup is public-only.
        return ResponseEntity.ok(ApiResponse.ok(weddingService.getTimelineById(weddingId)));
    }

    @PostMapping("/{weddingId}/timeline")
    public ResponseEntity<ApiResponse<TimelineItemResponse>> addTimeline(@PathVariable Long weddingId,
                                                                         @Valid @RequestBody TimelineItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Timeline item created", weddingService.addTimeline(weddingId, request)));
    }

    @PutMapping("/{weddingId}/timeline/{itemId}")
    public ResponseEntity<ApiResponse<TimelineItemResponse>> updateTimeline(@PathVariable Long weddingId,
                                                                            @PathVariable Long itemId,
                                                                            @Valid @RequestBody TimelineItemRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Timeline item updated",
                weddingService.updateTimeline(weddingId, itemId, request)));
    }

    @DeleteMapping("/{weddingId}/timeline/{itemId}")
    public ResponseEntity<ApiResponse<Void>> deleteTimeline(@PathVariable Long weddingId, @PathVariable Long itemId) {
        weddingService.deleteTimeline(weddingId, itemId);
        return ResponseEntity.ok(ApiResponse.ok("Timeline item deleted", null));
    }

    // ---- album ----
    @GetMapping("/{weddingId}/album")
    public ResponseEntity<ApiResponse<List<AlbumPhotoResponse>>> listAlbum(@PathVariable Long weddingId) {
        return ResponseEntity.ok(ApiResponse.ok(weddingService.getAlbumById(weddingId)));
    }

    @PostMapping("/{weddingId}/album")
    public ResponseEntity<ApiResponse<AlbumPhotoResponse>> addAlbum(@PathVariable Long weddingId,
                                                                    @Valid @RequestBody AlbumPhotoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Album photo created", weddingService.addAlbum(weddingId, request)));
    }

    @PutMapping("/{weddingId}/album/{photoId}")
    public ResponseEntity<ApiResponse<AlbumPhotoResponse>> updateAlbum(@PathVariable Long weddingId,
                                                                       @PathVariable Long photoId,
                                                                       @Valid @RequestBody AlbumPhotoRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Album photo updated",
                weddingService.updateAlbum(weddingId, photoId, request)));
    }

    @DeleteMapping("/{weddingId}/album/{photoId}")
    public ResponseEntity<ApiResponse<Void>> deleteAlbum(@PathVariable Long weddingId, @PathVariable Long photoId) {
        weddingService.deleteAlbum(weddingId, photoId);
        return ResponseEntity.ok(ApiResponse.ok("Album photo deleted", null));
    }

    // ---- events ----
    @GetMapping("/{weddingId}/events")
    public ResponseEntity<ApiResponse<List<WeddingEventResponse>>> listEvents(@PathVariable Long weddingId) {
        return ResponseEntity.ok(ApiResponse.ok(weddingService.getEventsById(weddingId)));
    }

    @PostMapping("/{weddingId}/events")
    public ResponseEntity<ApiResponse<WeddingEventResponse>> addEvent(@PathVariable Long weddingId,
                                                                      @Valid @RequestBody WeddingEventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Event created", weddingService.addEvent(weddingId, request)));
    }

    @PutMapping("/{weddingId}/events/{eventId}")
    public ResponseEntity<ApiResponse<WeddingEventResponse>> updateEvent(@PathVariable Long weddingId,
                                                                         @PathVariable Long eventId,
                                                                         @Valid @RequestBody WeddingEventRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Event updated",
                weddingService.updateEvent(weddingId, eventId, request)));
    }

    @DeleteMapping("/{weddingId}/events/{eventId}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long weddingId, @PathVariable Long eventId) {
        weddingService.deleteEvent(weddingId, eventId);
        return ResponseEntity.ok(ApiResponse.ok("Event deleted", null));
    }

    // ---- gift accounts ----
    @GetMapping("/{weddingId}/gift-accounts")
    public ResponseEntity<ApiResponse<List<GiftAccountResponse>>> listGiftAccounts(@PathVariable Long weddingId) {
        return ResponseEntity.ok(ApiResponse.ok(weddingService.getGiftAccountsById(weddingId)));
    }

    @PostMapping("/{weddingId}/gift-accounts")
    public ResponseEntity<ApiResponse<GiftAccountResponse>> addGiftAccount(@PathVariable Long weddingId,
                                                                           @Valid @RequestBody GiftAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Gift account created", weddingService.addGiftAccount(weddingId, request)));
    }

    @PutMapping("/{weddingId}/gift-accounts/{accountId}")
    public ResponseEntity<ApiResponse<GiftAccountResponse>> updateGiftAccount(@PathVariable Long weddingId,
                                                                              @PathVariable Long accountId,
                                                                              @Valid @RequestBody GiftAccountRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Gift account updated",
                weddingService.updateGiftAccount(weddingId, accountId, request)));
    }

    @DeleteMapping("/{weddingId}/gift-accounts/{accountId}")
    public ResponseEntity<ApiResponse<Void>> deleteGiftAccount(@PathVariable Long weddingId,
                                                               @PathVariable Long accountId) {
        weddingService.deleteGiftAccount(weddingId, accountId);
        return ResponseEntity.ok(ApiResponse.ok("Gift account deleted", null));
    }
}
