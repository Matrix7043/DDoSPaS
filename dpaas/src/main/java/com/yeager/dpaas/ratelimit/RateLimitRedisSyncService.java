package com.yeager.dpaas.ratelimit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimitRedisSyncService {

    private final StringRedisTemplate redisTemplate;

    /**
     * Writes rate limit config to Redis.
     * Key: ratelimit:{apiKey}:{path}
     * Fields: capacity, refill_rate, window_seconds
     */
    public void pushToRedis(String apiKey, String path, int capacity, int refillRate, int windowSeconds) {
        String key = buildKey(apiKey, path);
        redisTemplate.opsForHash().putAll(key, Map.of(
                "capacity", String.valueOf(capacity),
                "refill_rate", String.valueOf(refillRate),
                "window_seconds", String.valueOf(windowSeconds)));
        log.info("Pushed rate limit to Redis: {} -> capacity={}, refill_rate={}", key, capacity, refillRate);
    }

    /**
     * Removes rate limit config from Redis.
     */
    public void deleteFromRedis(String apiKey, String path) {
        String key = buildKey(apiKey, path);
        redisTemplate.delete(key);
        log.info("Deleted rate limit from Redis: {}", key);
    }

    private String buildKey(String apiKey, String path) {
        // normalize path: /api/login → api/login (no leading slash)
        String normalizedPath = path.startsWith("/") ? path.substring(1) : path;
        return "ratelimit:" + apiKey + ":" + normalizedPath;
    }
}
