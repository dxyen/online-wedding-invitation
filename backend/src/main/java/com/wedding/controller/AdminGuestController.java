package com.wedding.controller;

import com.wedding.dto.request.GuestRequest;
import com.wedding.dto.response.ApiResponse;
import com.wedding.dto.response.GuestResponse;
import com.wedding.service.GuestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/guests")
public class AdminGuestController {

    private final GuestService guestService;

    public AdminGuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GuestResponse>>> list(@RequestParam Long weddingId) {
        return ResponseEntity.ok(ApiResponse.ok(guestService.listByWedding(weddingId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GuestResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(guestService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GuestResponse>> create(@RequestParam Long weddingId,
                                                             @Valid @RequestBody GuestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Guest created", guestService.create(weddingId, request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GuestResponse>> update(@PathVariable Long id,
                                                             @Valid @RequestBody GuestRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Guest updated", guestService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        guestService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Guest deleted", null));
    }
}
