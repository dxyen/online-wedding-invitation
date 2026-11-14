package com.wedding.service.impl;

import com.wedding.dto.request.*;
import com.wedding.dto.response.*;
import com.wedding.entity.*;
import com.wedding.exception.BadRequestException;
import com.wedding.exception.ResourceNotFoundException;
import com.wedding.mapper.WeddingMapper;
import com.wedding.repository.*;
import com.wedding.service.WeddingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class WeddingServiceImpl implements WeddingService {

    private final WeddingRepository weddingRepository;
    private final CoupleRepository coupleRepository;
    private final WeddingEventRepository eventRepository;
    private final TimelineItemRepository timelineRepository;
    private final AlbumPhotoRepository albumRepository;
    private final GiftAccountRepository giftRepository;
    private final WeddingMapper mapper;

    public WeddingServiceImpl(WeddingRepository weddingRepository, CoupleRepository coupleRepository,
                              WeddingEventRepository eventRepository, TimelineItemRepository timelineRepository,
                              AlbumPhotoRepository albumRepository, GiftAccountRepository giftRepository,
                              WeddingMapper mapper) {
        this.weddingRepository = weddingRepository;
        this.coupleRepository = coupleRepository;
        this.eventRepository = eventRepository;
        this.timelineRepository = timelineRepository;
        this.albumRepository = albumRepository;
        this.giftRepository = giftRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Wedding findBySlugOrThrow(String slug) {
        return weddingRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding not found: " + slug));
    }

    @Override
    @Transactional(readOnly = true)
    public Wedding findByIdOrThrow(Long id) {
        return weddingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public WeddingResponse getBySlug(String slug) {
        return mapper.toResponse(findBySlugOrThrow(slug));
    }

    @Override
    @Transactional(readOnly = true)
    public WeddingResponse getById(Long id) {
        return mapper.toResponse(findByIdOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<WeddingResponse> listAll() {
        return weddingRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    public WeddingResponse create(WeddingRequest request) {
        if (weddingRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Slug already exists: " + request.getSlug());
        }
        Wedding wedding = buildWedding(new Wedding(), request);
        weddingRepository.save(wedding);
        if (request.getCouple() != null) {
            Couple couple = buildCouple(wedding, request.getCouple());
            coupleRepository.save(couple);
            wedding.setCouple(couple);
        }
        return mapper.toResponse(wedding);
    }

    @Override
    public WeddingResponse update(Long id, WeddingRequest request) {
        Wedding wedding = findByIdOrThrow(id);
        if (!wedding.getSlug().equals(request.getSlug()) && weddingRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Slug already exists: " + request.getSlug());
        }
        buildWedding(wedding, request);
        if (request.getCouple() != null) {
            Couple couple = coupleRepository.findByWeddingId(id)
                    .orElseGet(() -> Couple.builder().wedding(wedding).build());
            applyCouple(couple, request.getCouple());
            couple.setWedding(wedding);
            coupleRepository.save(couple);
            wedding.setCouple(couple);
        }
        return mapper.toResponse(weddingRepository.save(wedding));
    }

    @Override
    public void delete(Long id) {
        weddingRepository.delete(findByIdOrThrow(id));
    }

    private Wedding buildWedding(Wedding wedding, WeddingRequest request) {
        wedding.setSlug(request.getSlug());
        wedding.setTitle(request.getTitle());
        wedding.setWeddingDate(request.getWeddingDate());
        wedding.setCeremonyTime(request.getCeremonyTime());
        wedding.setReceptionTime(request.getReceptionTime());
        wedding.setVenueName(request.getVenueName());
        wedding.setVenueAddress(request.getVenueAddress());
        wedding.setMusicUrl(request.getMusicUrl());
        if (request.getTemplate() != null) wedding.setTemplate(request.getTemplate());
        wedding.setGreetingMessage(request.getGreetingMessage());
        return wedding;
    }

    private Couple buildCouple(Wedding wedding, WeddingRequest.CoupleRequest req) {
        Couple couple = new Couple();
        couple.setWedding(wedding);
        applyCouple(couple, req);
        return couple;
    }

    private void applyCouple(Couple couple, WeddingRequest.CoupleRequest req) {
        couple.setBrideName(req.getBrideName());
        couple.setGroomName(req.getGroomName());
        couple.setBrideBio(req.getBrideBio());
        couple.setGroomBio(req.getGroomBio());
        couple.setBridePhotoUrl(req.getBridePhotoUrl());
        couple.setGroomPhotoUrl(req.getGroomPhotoUrl());
        couple.setMonogram(req.getMonogram());
        couple.setDisplayName(req.getDisplayName());
    }

    // ---- public sub-resources (by slug) ----

    @Override
    @Transactional(readOnly = true)
    public List<TimelineItemResponse> getTimeline(String slug) {
        return timelineRepository.findByWeddingIdOrderBySortOrderAscEventDateAsc(findBySlugOrThrow(slug).getId())
                .stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlbumPhotoResponse> getAlbum(String slug) {
        return albumRepository.findByWeddingIdOrderBySortOrderAscCreatedAtAsc(findBySlugOrThrow(slug).getId())
                .stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WeddingEventResponse> getEvents(String slug) {
        return eventRepository.findByWeddingIdOrderBySortOrderAscStartTimeAsc(findBySlugOrThrow(slug).getId())
                .stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<GiftAccountResponse> getGiftAccounts(String slug) {
        return giftRepository.findByWeddingIdOrderBySortOrderAscCreatedAtAsc(findBySlugOrThrow(slug).getId())
                .stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimelineItemResponse> getTimelineById(Long weddingId) {
        findByIdOrThrow(weddingId);
        return timelineRepository.findByWeddingIdOrderBySortOrderAscEventDateAsc(weddingId)
                .stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlbumPhotoResponse> getAlbumById(Long weddingId) {
        findByIdOrThrow(weddingId);
        return albumRepository.findByWeddingIdOrderBySortOrderAscCreatedAtAsc(weddingId)
                .stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WeddingEventResponse> getEventsById(Long weddingId) {
        findByIdOrThrow(weddingId);
        return eventRepository.findByWeddingIdOrderBySortOrderAscStartTimeAsc(weddingId)
                .stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<GiftAccountResponse> getGiftAccountsById(Long weddingId) {
        findByIdOrThrow(weddingId);
        return giftRepository.findByWeddingIdOrderBySortOrderAscCreatedAtAsc(weddingId)
                .stream().map(mapper::toResponse).toList();
    }

    // ---- admin timeline ----

    @Override
    public TimelineItemResponse addTimeline(Long weddingId, TimelineItemRequest request) {
        Wedding wedding = findByIdOrThrow(weddingId);
        TimelineItem item = TimelineItem.builder()
                .wedding(wedding).title(request.getTitle()).description(request.getDescription())
                .eventDate(request.getEventDate()).imageUrl(request.getImageUrl())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0).build();
        return mapper.toResponse(timelineRepository.save(item));
    }

    @Override
    public TimelineItemResponse updateTimeline(Long weddingId, Long itemId, TimelineItemRequest request) {
        TimelineItem item = timelineRepository.findById(itemId)
                .filter(i -> i.getWedding().getId().equals(weddingId))
                .orElseThrow(() -> new ResourceNotFoundException("Timeline item not found: " + itemId));
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setEventDate(request.getEventDate());
        item.setImageUrl(request.getImageUrl());
        if (request.getSortOrder() != null) item.setSortOrder(request.getSortOrder());
        return mapper.toResponse(timelineRepository.save(item));
    }

    @Override
    public void deleteTimeline(Long weddingId, Long itemId) {
        TimelineItem item = timelineRepository.findById(itemId)
                .filter(i -> i.getWedding().getId().equals(weddingId))
                .orElseThrow(() -> new ResourceNotFoundException("Timeline item not found: " + itemId));
        timelineRepository.delete(item);
    }

    // ---- admin album ----

    @Override
    public AlbumPhotoResponse addAlbum(Long weddingId, AlbumPhotoRequest request) {
        Wedding wedding = findByIdOrThrow(weddingId);
        AlbumPhoto photo = AlbumPhoto.builder()
                .wedding(wedding).imageUrl(request.getImageUrl()).caption(request.getCaption())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0).build();
        return mapper.toResponse(albumRepository.save(photo));
    }

    @Override
    public AlbumPhotoResponse updateAlbum(Long weddingId, Long photoId, AlbumPhotoRequest request) {
        AlbumPhoto photo = albumRepository.findById(photoId)
                .filter(p -> p.getWedding().getId().equals(weddingId))
                .orElseThrow(() -> new ResourceNotFoundException("Album photo not found: " + photoId));
        photo.setImageUrl(request.getImageUrl());
        photo.setCaption(request.getCaption());
        if (request.getSortOrder() != null) photo.setSortOrder(request.getSortOrder());
        return mapper.toResponse(albumRepository.save(photo));
    }

    @Override
    public void deleteAlbum(Long weddingId, Long photoId) {
        AlbumPhoto photo = albumRepository.findById(photoId)
                .filter(p -> p.getWedding().getId().equals(weddingId))
                .orElseThrow(() -> new ResourceNotFoundException("Album photo not found: " + photoId));
        albumRepository.delete(photo);
    }

    // ---- admin events ----

    @Override
    public WeddingEventResponse addEvent(Long weddingId, WeddingEventRequest request) {
        Wedding wedding = findByIdOrThrow(weddingId);
        WeddingEvent event = WeddingEvent.builder()
                .wedding(wedding).title(request.getTitle()).eventType(request.getEventType())
                .eventDate(request.getEventDate()).startTime(request.getStartTime()).endTime(request.getEndTime())
                .location(request.getLocation()).address(request.getAddress()).description(request.getDescription())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0).build();
        return mapper.toResponse(eventRepository.save(event));
    }

    @Override
    public WeddingEventResponse updateEvent(Long weddingId, Long eventId, WeddingEventRequest request) {
        WeddingEvent event = eventRepository.findById(eventId)
                .filter(e -> e.getWedding().getId().equals(weddingId))
                .orElseThrow(() -> new ResourceNotFoundException("Wedding event not found: " + eventId));
        event.setTitle(request.getTitle());
        event.setEventType(request.getEventType());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setLocation(request.getLocation());
        event.setAddress(request.getAddress());
        event.setDescription(request.getDescription());
        if (request.getSortOrder() != null) event.setSortOrder(request.getSortOrder());
        return mapper.toResponse(eventRepository.save(event));
    }

    @Override
    public void deleteEvent(Long weddingId, Long eventId) {
        WeddingEvent event = eventRepository.findById(eventId)
                .filter(e -> e.getWedding().getId().equals(weddingId))
                .orElseThrow(() -> new ResourceNotFoundException("Wedding event not found: " + eventId));
        eventRepository.delete(event);
    }

    // ---- admin gift accounts ----

    @Override
    public GiftAccountResponse addGiftAccount(Long weddingId, GiftAccountRequest request) {
        Wedding wedding = findByIdOrThrow(weddingId);
        GiftAccount account = GiftAccount.builder()
                .wedding(wedding).accountHolder(request.getAccountHolder()).bankName(request.getBankName())
                .accountNumber(request.getAccountNumber()).branch(request.getBranch())
                .qrCodeUrl(request.getQrCodeUrl()).side(request.getSide())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0).build();
        return mapper.toResponse(giftRepository.save(account));
    }

    @Override
    public GiftAccountResponse updateGiftAccount(Long weddingId, Long accountId, GiftAccountRequest request) {
        GiftAccount account = giftRepository.findById(accountId)
                .filter(a -> a.getWedding().getId().equals(weddingId))
                .orElseThrow(() -> new ResourceNotFoundException("Gift account not found: " + accountId));
        account.setAccountHolder(request.getAccountHolder());
        account.setBankName(request.getBankName());
        account.setAccountNumber(request.getAccountNumber());
        account.setBranch(request.getBranch());
        account.setQrCodeUrl(request.getQrCodeUrl());
        account.setSide(request.getSide());
        if (request.getSortOrder() != null) account.setSortOrder(request.getSortOrder());
        return mapper.toResponse(giftRepository.save(account));
    }

    @Override
    public void deleteGiftAccount(Long weddingId, Long accountId) {
        GiftAccount account = giftRepository.findById(accountId)
                .filter(a -> a.getWedding().getId().equals(weddingId))
                .orElseThrow(() -> new ResourceNotFoundException("Gift account not found: " + accountId));
        giftRepository.delete(account);
    }
}
