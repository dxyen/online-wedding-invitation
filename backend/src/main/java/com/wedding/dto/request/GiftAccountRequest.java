package com.wedding.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiftAccountRequest {
    @NotBlank(message = "Account holder is required")
    @Size(max = 150)
    private String accountHolder;

    @NotBlank(message = "Bank name is required")
    @Size(max = 100)
    private String bankName;

    @NotBlank(message = "Account number is required")
    @Size(max = 50)
    private String accountNumber;

    @Size(max = 150)
    private String branch;

    @Size(max = 500)
    private String qrCodeUrl;

    @Size(max = 20)
    private String side;

    private Integer sortOrder;
}
