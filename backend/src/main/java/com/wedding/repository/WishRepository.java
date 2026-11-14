package com.wedding.repository;

import com.wedding.entity.Wish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishRepository extends JpaRepository<Wish, Long> {
    List<Wish> findByWeddingIdOrderByCreatedAtDesc(Long weddingId);
    List<Wish> findByWeddingIdAndApprovedOrderByCreatedAtDesc(Long weddingId, boolean approved);
    long countByWeddingId(Long weddingId);
    long countByWeddingIdAndApproved(Long weddingId, boolean approved);
}
