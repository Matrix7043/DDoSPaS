package com.yeager.dpaas.ratelimit;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RateLimitResponse {
    private String id;
    private String endpointId;
    private String endpointPath;
    private String endpointMethod;
    private int capacity;
    private int refillRate;
    private int windowSeconds;

    public static RateLimitResponse from(RateLimitRule r) {
        return RateLimitResponse.builder()
                .id(r.getId())
                .endpointId(r.getEndpoint().getId())
                .endpointPath(r.getEndpoint().getPath())
                .endpointMethod(r.getEndpoint().getMethod())
                .capacity(r.getCapacity())
                .refillRate(r.getRefillRate())
                .windowSeconds(r.getWindowSeconds())
                .build();
    }
}
