package com.wedding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GiftAccountResponse {
    private Long id;
    private Long weddingId;
    private String accountHolder;
    private String bankName;
    private String accountNumber;
    private String branch;
    private String qrCodeUrl;
    private String qrPayload;
    private String side;
    private int sortOrder;
}
