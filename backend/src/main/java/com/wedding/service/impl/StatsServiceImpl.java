package com.wedding.service.impl;

import com.wedding.dto.response.StatsResponse;
import com.wedding.exception.ResourceNotFoundException;
import com.wedding.repository.GuestRepository;
import com.wedding.repository.RsvpRepository;
import com.wedding.repository.WeddingRepository;
import com.wedding.repository.WishRepository;
import com.wedding.service.StatsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class StatsServiceImpl implements StatsService {

    private final GuestRepository guestRepository;
    private final RsvpRepository rsvpRepository;
    private final WishRepository wishRepository;
    private final WeddingRepository weddingRepository;

    public StatsServiceImpl(GuestRepository guestRepository, RsvpRepository rsvpRepository,
                            WishRepository wishRepository, WeddingRepository weddingRepository) {
        this.guestRepository = guestRepository;
        this.rsvpRepository = rsvpRepository;
        this.wishRepository = wishRepository;
        this.weddingRepository = weddingRepository;
    }

    @Override
    public StatsResponse getStats(Long weddingId) {
        if (weddingId == null) {
            throw new ResourceNotFoundException("weddingId is required");
        }
        if (!weddingRepository.existsById(weddingId)) {
            throw new ResourceNotFoundException("Wedding not found: " + weddingId);
        }
        long totalWishes = wishRepository.countByWeddingId(weddingId);
        long approvedWishes = wishRepository.countByWeddingIdAndApproved(weddingId, true);
        return StatsResponse.builder()
                .weddingId(weddingId)
                .totalGuests(guestRepository.countByWeddingId(weddingId))
                .totalRsvps(rsvpRepository.countByWeddingId(weddingId))
                .confirmedGuests(rsvpRepository.countByWeddingIdAndAttending(weddingId, true))
                .declinedGuests(rsvpRepository.countByWeddingIdAndAttending(weddingId, false))
                .totalAttendingPersons(rsvpRepository.sumAttendingPersons(weddingId))
                .totalWishes(totalWishes)
                .approvedWishes(approvedWishes)
                .pendingWishes(totalWishes - approvedWishes)
                .build();
    }
}
