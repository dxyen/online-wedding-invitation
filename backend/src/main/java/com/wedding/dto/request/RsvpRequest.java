package com.wedding.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RsvpRequest {
    @NotBlank(message = "Guest name is required")
    @Size(max = 150, message = "Guest name must be at most 150 characters")
    private String guestName;

    @Size(max = 30)
    private String phone;

    @Email(message = "Email must be valid")
    @Size(max = 150)
    private String email;

    @NotNull(message = "Attending is required")
    private Boolean attending;

    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "Guest count must be at least 1")
    @Max(value = 10, message = "Guest count must be at most 10")
    private Integer guestCount;

    @Size(max = 1000, message = "Message must be at most 1000 characters")
    private String message;
}
