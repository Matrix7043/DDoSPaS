package com.yeager.dpaas.website;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateWebsiteRequest {
    @NotBlank
    private String domain;

    @NotBlank
    private String targetOrigin;
}
