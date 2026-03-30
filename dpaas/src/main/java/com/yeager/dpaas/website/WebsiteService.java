package com.yeager.dpaas.website;

import com.yeager.dpaas.auth.User;
import com.yeager.dpaas.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WebsiteService {

    private final WebsiteRepository websiteRepository;
    private final UserRepository userRepository;
    private final WebsiteRedisSyncService redisSyncService;

    @Value("${app.gateway.base-url}")
    private String gatewayBaseUrl;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public WebsiteResponse create(CreateWebsiteRequest req) {
        Website website = Website.builder()
                .user(currentUser())
                .domain(req.getDomain())
                .targetOrigin(req.getTargetOrigin())
                .apiKey(UUID.randomUUID().toString())
                .build();
        Website saved = websiteRepository.save(website);
        redisSyncService.pushOrigin(saved.getApiKey(), saved.getTargetOrigin());
        return WebsiteResponse.from(saved, gatewayBaseUrl);
    }

    public List<WebsiteResponse> findAll() {
        return websiteRepository.findByUser(currentUser())
                .stream()
                .map(w -> WebsiteResponse.from(w, gatewayBaseUrl))
                .collect(Collectors.toList());
    }

    public void delete(String id) {
        Website website = websiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Website not found"));
        if (!website.getUser().getId().equals(currentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }
        redisSyncService.deleteOrigin(website.getApiKey());
        websiteRepository.delete(website);
    }
}
