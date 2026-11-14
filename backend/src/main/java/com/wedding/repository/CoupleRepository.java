package com.wedding.repository;

import com.wedding.entity.Couple;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoupleRepository extends JpaRepository<Couple, Long> {
    Optional<Couple> findByWeddingId(Long weddingId);
}
