package com.wedding.service.impl;

import com.wedding.dto.request.GuestRequest;
import com.wedding.dto.response.GuestResponse;
import com.wedding.entity.Guest;
import com.wedding.entity.Wedding;
import com.wedding.exception.ResourceNotFoundException;
import com.wedding.mapper.GuestMapper;
import com.wedding.repository.GuestRepository;
import com.wedding.repository.WeddingRepository;
import com.wedding.service.GuestService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GuestServiceImpl implements GuestService {

    private final GuestRepository guestRepository;
    private final WeddingRepository weddingRepository;
    private final GuestMapper mapper;

    public GuestServiceImpl(GuestRepository guestRepository, WeddingRepository weddingRepository, GuestMapper mapper) {
        this.guestRepository = guestRepository;
        this.weddingRepository = weddingRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuestResponse> listByWedding(Long weddingId) {
        return guestRepository.findByWeddingIdOrderByFullNameAsc(weddingId).stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public GuestResponse getById(Long id) {
        return mapper.toResponse(findOrThrow(id));
    }

    @Override
    public GuestResponse create(Long weddingId, GuestRequest request) {
        Wedding wedding = weddingRepository.findById(weddingId)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding not found: " + weddingId));
        Guest guest = Guest.builder()
                .wedding(wedding).fullName(request.getFullName()).phone(request.getPhone())
                .email(request.getEmail()).groupName(request.getGroupName())
                .invitedCount(request.getInvitedCount() != null ? request.getInvitedCount() : 1)
                .notes(request.getNotes()).build();
        return mapper.toResponse(guestRepository.save(guest));
    }

    @Override
    public GuestResponse update(Long id, GuestRequest request) {
        Guest guest = findOrThrow(id);
        guest.setFullName(request.getFullName());
        guest.setPhone(request.getPhone());
        guest.setEmail(request.getEmail());
        guest.setGroupName(request.getGroupName());
        if (request.getInvitedCount() != null) guest.setInvitedCount(request.getInvitedCount());
        guest.setNotes(request.getNotes());
        return mapper.toResponse(guestRepository.save(guest));
    }

    @Override
    public void delete(Long id) {
        guestRepository.delete(findOrThrow(id));
    }

    private Guest findOrThrow(Long id) {
        return guestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guest not found: " + id));
    }
}
