package com.wedding.repository;

import com.wedding.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    List<Guest> findByWeddingIdOrderByFullNameAsc(Long weddingId);
    long countByWeddingId(Long weddingId);
}
