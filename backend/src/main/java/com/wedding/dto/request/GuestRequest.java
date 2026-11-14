package com.wedding.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestRequest {
    @NotBlank(message = "Full name is required")
    @Size(max = 150)
    private String fullName;

    @Size(max = 30)
    private String phone;

    @Email(message = "Email must be valid")
    @Size(max = 150)
    private String email;

    @Size(max = 100)
    private String groupName;

    @Min(value = 1, message = "Invited count must be at least 1")
    private Integer invitedCount;

    private String notes;
}
