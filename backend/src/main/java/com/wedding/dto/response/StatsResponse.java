package com.wedding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsResponse {
    private Long weddingId;
    private long totalGuests;
    private long totalRsvps;
    private long confirmedGuests;
    private long declinedGuests;
    private long totalAttendingPersons;
    private long totalWishes;
    private long approvedWishes;
    private long pendingWishes;
}
