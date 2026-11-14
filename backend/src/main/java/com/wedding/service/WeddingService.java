package com.wedding.service;

import com.wedding.dto.request.*;
import com.wedding.dto.response.*;
import com.wedding.entity.Wedding;

import java.util.List;

public interface WeddingService {
    Wedding findBySlugOrThrow(String slug);
    Wedding findByIdOrThrow(Long id);
    WeddingResponse getBySlug(String slug);
    WeddingResponse getById(Long id);
    List<WeddingResponse> listAll();
    WeddingResponse create(WeddingRequest request);
    WeddingResponse update(Long id, WeddingRequest request);
    void delete(Long id);

    List<TimelineItemResponse> getTimeline(String slug);
    List<AlbumPhotoResponse> getAlbum(String slug);
    List<WeddingEventResponse> getEvents(String slug);
    List<GiftAccountResponse> getGiftAccounts(String slug);

    List<TimelineItemResponse> getTimelineById(Long weddingId);
    List<AlbumPhotoResponse> getAlbumById(Long weddingId);
    List<WeddingEventResponse> getEventsById(Long weddingId);
    List<GiftAccountResponse> getGiftAccountsById(Long weddingId);

    TimelineItemResponse addTimeline(Long weddingId, TimelineItemRequest request);
    TimelineItemResponse updateTimeline(Long weddingId, Long itemId, TimelineItemRequest request);
    void deleteTimeline(Long weddingId, Long itemId);

    AlbumPhotoResponse addAlbum(Long weddingId, AlbumPhotoRequest request);
    AlbumPhotoResponse updateAlbum(Long weddingId, Long photoId, AlbumPhotoRequest request);
    void deleteAlbum(Long weddingId, Long photoId);

    WeddingEventResponse addEvent(Long weddingId, WeddingEventRequest request);
    WeddingEventResponse updateEvent(Long weddingId, Long eventId, WeddingEventRequest request);
    void deleteEvent(Long weddingId, Long eventId);

    GiftAccountResponse addGiftAccount(Long weddingId, GiftAccountRequest request);
    GiftAccountResponse updateGiftAccount(Long weddingId, Long accountId, GiftAccountRequest request);
    void deleteGiftAccount(Long weddingId, Long accountId);
}
