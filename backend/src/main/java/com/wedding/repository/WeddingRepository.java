package com.wedding.repository;

import com.wedding.entity.Wedding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WeddingRepository extends JpaRepository<Wedding, Long> {
    Optional<Wedding> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
