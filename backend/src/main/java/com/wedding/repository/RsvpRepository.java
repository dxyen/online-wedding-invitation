package com.wedding.repository;

import com.wedding.entity.Rsvp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RsvpRepository extends JpaRepository<Rsvp, Long> {
    List<Rsvp> findByWeddingIdOrderByCreatedAtDesc(Long weddingId);
    long countByWeddingId(Long weddingId);
    long countByWeddingIdAndAttending(Long weddingId, boolean attending);

    @Query("SELECT COALESCE(SUM(r.guestCount), 0) FROM Rsvp r WHERE r.wedding.id = :weddingId AND r.attending = true")
    long sumAttendingPersons(@Param("weddingId") Long weddingId);
}
