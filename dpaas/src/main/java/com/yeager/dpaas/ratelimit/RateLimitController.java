package com.yeager.dpaas.ratelimit;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class RateLimitController {

    private final RateLimitService rateLimitService;

    @PostMapping("/endpoints/{endpointId}/rate-limit")
    public ResponseEntity<RateLimitResponse> create(
            @PathVariable String endpointId,
            @Valid @RequestBody RateLimitRequest request) {
        return ResponseEntity.ok(rateLimitService.create(endpointId, request));
    }

    @PutMapping("/rate-limit/{ruleId}")
    public ResponseEntity<RateLimitResponse> update(
            @PathVariable String ruleId,
            @Valid @RequestBody RateLimitRequest request) {
        return ResponseEntity.ok(rateLimitService.update(ruleId, request));
    }

    @GetMapping("/endpoints/{endpointId}/rate-limit")
    public ResponseEntity<RateLimitResponse> get(@PathVariable String endpointId) {
        return ResponseEntity.ok(rateLimitService.get(endpointId));
    }
}
