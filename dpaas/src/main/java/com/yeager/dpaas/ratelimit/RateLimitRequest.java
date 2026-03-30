package com.yeager.dpaas.ratelimit;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RateLimitRequest {
    @NotNull
    @Min(1)
    private Integer capacity;

    @NotNull
    @Min(1)
    private Integer refillRate;

    @NotNull
    @Min(1)
    private Integer windowSeconds;
}
