package com.yeager.dpaas.website;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebsiteRedisSyncService {

    private final StringRedisTemplate redisTemplate;

    public void pushOrigin(String apiKey, String origin) {
        String key = "tenant:" + apiKey + ":origin";
        redisTemplate.opsForValue().set(key, origin);
        log.info("Pushed target origin to Redis: {} -> {}", key, origin);
    }

    public void deleteOrigin(String apiKey) {
        String key = "tenant:" + apiKey + ":origin";
        redisTemplate.delete(key);
        log.info("Deleted target origin from Redis: {}", key);
    }
}
