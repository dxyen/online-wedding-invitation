package com.wedding.controller;

import com.wedding.dto.request.RsvpRequest;
import com.wedding.dto.response.ApiResponse;
import com.wedding.dto.response.RsvpResponse;
import com.wedding.service.RsvpService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rsvps")
public class AdminRsvpController {

    private final RsvpService rsvpService;

    public AdminRsvpController(RsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RsvpResponse>>> list(@RequestParam Long weddingId) {
        return ResponseEntity.ok(ApiResponse.ok(rsvpService.listByWedding(weddingId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RsvpResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(rsvpService.getById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RsvpResponse>> update(@PathVariable Long id,
                                                            @Valid @RequestBody RsvpRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("RSVP updated", rsvpService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        rsvpService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("RSVP deleted", null));
    }
}
