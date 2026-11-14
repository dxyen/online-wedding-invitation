package com.wedding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoupleResponse {
    private Long id;
    private String brideName;
    private String groomName;
    private String brideBio;
    private String groomBio;
    private String bridePhotoUrl;
    private String groomPhotoUrl;
    private String monogram;
    private String displayName;
}
