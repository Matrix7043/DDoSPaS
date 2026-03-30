package com.yeager.dpaas.ratelimit;

import com.yeager.dpaas.endpoint.Endpoint;
import com.yeager.dpaas.endpoint.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RateLimitService {

    private final RateLimitRuleRepository rateLimitRuleRepository;
    private final EndpointRepository endpointRepository;
    private final RateLimitRedisSyncService redisSyncService;

    public RateLimitResponse create(String endpointId, RateLimitRequest req) {
        Endpoint endpoint = endpointRepository.findById(endpointId)
                .orElseThrow(() -> new RuntimeException("Endpoint not found"));

        if (rateLimitRuleRepository.findByEndpoint_Id(endpointId).isPresent()) {
            throw new IllegalStateException("Rate limit already exists for this endpoint. Use PUT to update.");
        }

        RateLimitRule rule = RateLimitRule.builder()
                .endpoint(endpoint)
                .capacity(req.getCapacity())
                .refillRate(req.getRefillRate())
                .windowSeconds(req.getWindowSeconds())
                .build();

        RateLimitRule saved = rateLimitRuleRepository.save(rule);

        String apiKey = endpoint.getWebsite().getApiKey();
        redisSyncService.pushToRedis(apiKey, endpoint.getPath(), req.getCapacity(), req.getRefillRate(),
                req.getWindowSeconds());

        return RateLimitResponse.from(saved);
    }

    public RateLimitResponse update(String ruleId, RateLimitRequest req) {
        RateLimitRule rule = rateLimitRuleRepository.findById(ruleId)
                .orElseThrow(() -> new RuntimeException("Rate limit rule not found"));

        rule.setCapacity(req.getCapacity());
        rule.setRefillRate(req.getRefillRate());
        rule.setWindowSeconds(req.getWindowSeconds());

        RateLimitRule saved = rateLimitRuleRepository.save(rule);

        String apiKey = rule.getEndpoint().getWebsite().getApiKey();
        redisSyncService.pushToRedis(apiKey, rule.getEndpoint().getPath(), req.getCapacity(), req.getRefillRate(),
                req.getWindowSeconds());

        return RateLimitResponse.from(saved);
    }

    public RateLimitResponse get(String endpointId) {
        return rateLimitRuleRepository.findByEndpoint_Id(endpointId)
                .map(RateLimitResponse::from)
                .orElseThrow(() -> new RuntimeException("No rate limit rule for endpoint: " + endpointId));
    }

    public void deleteByEndpointId(String endpointId) {
        rateLimitRuleRepository.findByEndpoint_Id(endpointId).ifPresent(rule -> {
            String apiKey = rule.getEndpoint().getWebsite().getApiKey();
            redisSyncService.deleteFromRedis(apiKey, rule.getEndpoint().getPath());
            rateLimitRuleRepository.delete(rule);
        });
    }
}
