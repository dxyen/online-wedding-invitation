package com.wedding.mapper;

import com.wedding.dto.response.*;
import com.wedding.entity.*;

public interface WeddingMapper {
    WeddingResponse toResponse(Wedding wedding);
    CoupleResponse toResponse(Couple couple);
    WeddingEventResponse toResponse(WeddingEvent event);
    TimelineItemResponse toResponse(TimelineItem item);
    AlbumPhotoResponse toResponse(AlbumPhoto photo);
    GiftAccountResponse toResponse(GiftAccount account);
}
