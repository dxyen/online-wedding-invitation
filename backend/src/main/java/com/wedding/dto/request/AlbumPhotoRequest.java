package com.wedding.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumPhotoRequest {
    @NotBlank(message = "Image URL is required")
    @Size(max = 500)
    private String imageUrl;

    @Size(max = 255)
    private String caption;

    private Integer sortOrder;
}
