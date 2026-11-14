package com.wedding.repository;

import com.wedding.entity.GiftAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GiftAccountRepository extends JpaRepository<GiftAccount, Long> {
    List<GiftAccount> findByWeddingIdOrderBySortOrderAscCreatedAtAsc(Long weddingId);
}
