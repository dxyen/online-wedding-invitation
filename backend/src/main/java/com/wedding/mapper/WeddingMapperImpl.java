package com.wedding.mapper;

import com.wedding.dto.response.*;
import com.wedding.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WeddingMapperImpl implements WeddingMapper {

    @Override
    public WeddingResponse toResponse(Wedding wedding) {
        if (wedding == null) return null;
        List<WeddingEventResponse> events = wedding.getEvents() == null ? List.of()
                : wedding.getEvents().stream().map(this::toResponse).toList();
        List<GiftAccountResponse> gifts = wedding.getGiftAccounts() == null ? List.of()
                : wedding.getGiftAccounts().stream().map(this::toResponse).toList();
        return WeddingResponse.builder()
                .id(wedding.getId()).slug(wedding.getSlug()).title(wedding.getTitle())
                .weddingDate(wedding.getWeddingDate()).ceremonyTime(wedding.getCeremonyTime())
                .receptionTime(wedding.getReceptionTime()).venueName(wedding.getVenueName())
                .venueAddress(wedding.getVenueAddress()).musicUrl(wedding.getMusicUrl())
                .template(wedding.getTemplate()).greetingMessage(wedding.getGreetingMessage())
                .couple(toResponse(wedding.getCouple()))
                .events(events).giftAccounts(gifts)
                .build();
    }

    @Override
    public CoupleResponse toResponse(Couple couple) {
        if (couple == null) return null;
        return CoupleResponse.builder()
                .id(couple.getId()).brideName(couple.getBrideName()).groomName(couple.getGroomName())
                .brideBio(couple.getBrideBio()).groomBio(couple.getGroomBio())
                .bridePhotoUrl(couple.getBridePhotoUrl()).groomPhotoUrl(couple.getGroomPhotoUrl())
                .monogram(couple.getMonogram()).displayName(couple.getDisplayName())
                .build();
    }

    @Override
    public WeddingEventResponse toResponse(WeddingEvent event) {
        if (event == null) return null;
        return WeddingEventResponse.builder()
                .id(event.getId()).weddingId(event.getWedding() != null ? event.getWedding().getId() : null)
                .title(event.getTitle()).eventType(event.getEventType()).eventDate(event.getEventDate())
                .startTime(event.getStartTime()).endTime(event.getEndTime()).location(event.getLocation())
                .address(event.getAddress()).description(event.getDescription()).sortOrder(event.getSortOrder())
                .build();
    }

    @Override
    public TimelineItemResponse toResponse(TimelineItem item) {
        if (item == null) return null;
        return TimelineItemResponse.builder()
                .id(item.getId()).weddingId(item.getWedding() != null ? item.getWedding().getId() : null)
                .title(item.getTitle()).description(item.getDescription()).eventDate(item.getEventDate())
                .imageUrl(item.getImageUrl()).sortOrder(item.getSortOrder())
                .build();
    }

    @Override
    public AlbumPhotoResponse toResponse(AlbumPhoto photo) {
        if (photo == null) return null;
        return AlbumPhotoResponse.builder()
                .id(photo.getId()).weddingId(photo.getWedding() != null ? photo.getWedding().getId() : null)
                .imageUrl(photo.getImageUrl()).caption(photo.getCaption()).sortOrder(photo.getSortOrder())
                .build();
    }

    @Override
    public GiftAccountResponse toResponse(GiftAccount account) {
        if (account == null) return null;
        return GiftAccountResponse.builder()
                .id(account.getId()).weddingId(account.getWedding() != null ? account.getWedding().getId() : null)
                .accountHolder(account.getAccountHolder()).bankName(account.getBankName())
                .accountNumber(account.getAccountNumber()).branch(account.getBranch())
                .qrCodeUrl(account.getQrCodeUrl()).qrPayload(account.getQrPayload())
                .side(account.getSide()).sortOrder(account.getSortOrder())
                .build();
    }
}
