package com.wedding.service.impl;

import com.wedding.dto.request.WishRequest;
import com.wedding.dto.response.WishResponse;
import com.wedding.entity.Wedding;
import com.wedding.entity.Wish;
import com.wedding.exception.ResourceNotFoundException;
import com.wedding.mapper.WishMapper;
import com.wedding.repository.WeddingRepository;
import com.wedding.repository.WishRepository;
import com.wedding.service.WishService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class WishServiceImpl implements WishService {

    private final WishRepository wishRepository;
    private final WeddingRepository weddingRepository;
    private final WishMapper mapper;

    public WishServiceImpl(WishRepository wishRepository, WeddingRepository weddingRepository, WishMapper mapper) {
        this.wishRepository = wishRepository;
        this.weddingRepository = weddingRepository;
        this.mapper = mapper;
    }

    @Override
    public WishResponse create(String slug, WishRequest request) {
        Wedding wedding = weddingRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding not found: " + slug));
        Wish wish = Wish.builder()
                .wedding(wedding).senderName(request.getSenderName())
                .message(request.getMessage()).approved(false).build();
        return mapper.toResponse(wishRepository.save(wish));
    }

    @Override
    @Transactional(readOnly = true)
    public List<WishResponse> listApproved(String slug) {
        Wedding wedding = weddingRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Wedding not found: " + slug));
        return wishRepository.findByWeddingIdAndApprovedOrderByCreatedAtDesc(wedding.getId(), true)
                .stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WishResponse> listByWedding(Long weddingId, Boolean approved) {
        List<Wish> wishes = approved == null
                ? wishRepository.findByWeddingIdOrderByCreatedAtDesc(weddingId)
                : wishRepository.findByWeddingIdAndApprovedOrderByCreatedAtDesc(weddingId, approved);
        return wishes.stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public WishResponse getById(Long id) {
        return mapper.toResponse(findOrThrow(id));
    }

    @Override
    public WishResponse approve(Long id) {
        Wish wish = findOrThrow(id);
        wish.setApproved(true);
        return mapper.toResponse(wishRepository.save(wish));
    }

    @Override
    public WishResponse reject(Long id) {
        Wish wish = findOrThrow(id);
        wish.setApproved(false);
        return mapper.toResponse(wishRepository.save(wish));
    }

    @Override
    public void delete(Long id) {
        wishRepository.delete(findOrThrow(id));
    }

    private Wish findOrThrow(Long id) {
        return wishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wish not found: " + id));
    }
}
