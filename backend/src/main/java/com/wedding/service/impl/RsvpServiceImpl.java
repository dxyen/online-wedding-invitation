package com.wedding.service.impl;

import com.wedding.dto.request.RsvpRequest;
import com.wedding.dto.response.RsvpResponse;
import com.wedding.entity.Rsvp;
import com.wedding.entity.Wedding;
import com.wedding.exception.ResourceNotFoundException;
import com.wedding.mapper.RsvpMapper;
import com.wedding.repository.RsvpRepository;
import com.wedding.repository.WeddingRepository;
import com.wedding.service.RsvpService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RsvpServiceImpl implements RsvpService {

    private final RsvpRepository rsvpRepository;
    private final WeddingRepository weddingRepository;
    private final RsvpMapper mapper;

    public RsvpServiceImpl(RsvpRepository rsvpRepository, WeddingRepository weddingRepository, RsvpMapper mapper) {
        this.rsvpRepository = rsvpRepository;
        this.weddingRepository = weddingRepository;
        this.mapper = mapper;
    }

    @Override
    public RsvpResponse create(String slug, RsvpRequest request) {
        Wedding wedding = weddingRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding not found: " + slug));
        Rsvp rsvp = Rsvp.builder()
                .wedding(wedding).guestName(request.getGuestName()).phone(request.getPhone())
                .email(request.getEmail()).attending(request.getAttending())
                .guestCount(request.getGuestCount()).message(request.getMessage()).build();
        return mapper.toResponse(rsvpRepository.save(rsvp));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RsvpResponse> listByWedding(Long weddingId) {
        return rsvpRepository.findByWeddingIdOrderByCreatedAtDesc(weddingId).stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RsvpResponse getById(Long id) {
        return mapper.toResponse(findOrThrow(id));
    }

    @Override
    public RsvpResponse update(Long id, RsvpRequest request) {
        Rsvp rsvp = findOrThrow(id);
        rsvp.setGuestName(request.getGuestName());
        rsvp.setPhone(request.getPhone());
        rsvp.setEmail(request.getEmail());
        if (request.getAttending() != null) rsvp.setAttending(request.getAttending());
        if (request.getGuestCount() != null) rsvp.setGuestCount(request.getGuestCount());
        rsvp.setMessage(request.getMessage());
        return mapper.toResponse(rsvpRepository.save(rsvp));
    }

    @Override
    public void delete(Long id) {
        rsvpRepository.delete(findOrThrow(id));
    }

    private Rsvp findOrThrow(Long id) {
        return rsvpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RSVP not found: " + id));
    }
}
