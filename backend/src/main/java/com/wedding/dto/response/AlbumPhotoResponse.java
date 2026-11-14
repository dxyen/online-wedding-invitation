package com.wedding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlbumPhotoResponse {
    private Long id;
    private Long weddingId;
    private String imageUrl;
    private String caption;
    private int sortOrder;
}
