package com.wedding.repository;

import com.wedding.entity.AlbumPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlbumPhotoRepository extends JpaRepository<AlbumPhoto, Long> {
    List<AlbumPhoto> findByWeddingIdOrderBySortOrderAscCreatedAtAsc(Long weddingId);
}
