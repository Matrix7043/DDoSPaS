package com.yeager.dpaas.website;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WebsiteResponse {
    private String id;
    private String domain;
    private String targetOrigin;
    private String apiKey;
    private String gatewayUrl;
    private Instant createdAt;

    public static WebsiteResponse from(Website w, String gatewayBase) {
        return WebsiteResponse.builder()
                .id(w.getId())
                .domain(w.getDomain())
                .targetOrigin(w.getTargetOrigin())
                .apiKey(w.getApiKey())
                .gatewayUrl(gatewayBase + "/" + w.getApiKey())
                .createdAt(w.getCreatedAt())
                .build();
    }
}
