package com.wedding.repository;

import com.wedding.entity.WeddingEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeddingEventRepository extends JpaRepository<WeddingEvent, Long> {
    List<WeddingEvent> findByWeddingIdOrderBySortOrderAscStartTimeAsc(Long weddingId);
    List<WeddingEvent> findByWeddingId(Long weddingId);
}
