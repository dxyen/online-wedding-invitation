package com.wedding.repository;

import com.wedding.entity.TimelineItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimelineItemRepository extends JpaRepository<TimelineItem, Long> {
    List<TimelineItem> findByWeddingIdOrderBySortOrderAscEventDateAsc(Long weddingId);
}
