package com.yeager.dpaas.endpoint;

import lombok.*;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EndpointResponse {
    private String id;
    private String websiteId;
    private String path;
    private String method;
    private Instant createdAt;

    public static EndpointResponse from(Endpoint e) {
        return EndpointResponse.builder()
                .id(e.getId())
                .websiteId(e.getWebsite().getId())
                .path(e.getPath())
                .method(e.getMethod())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
