package com.wedding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestResponse {
    private Long id;
    private Long weddingId;
    private String fullName;
    private String phone;
    private String email;
    private String groupName;
    private int invitedCount;
    private String notes;
}
