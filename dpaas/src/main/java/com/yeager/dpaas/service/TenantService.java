package com.yeager.dpaas.service;

import com.yeager.dpaas.dto.request.CreateTenantRequest;
import com.yeager.dpaas.entity.Tenant;
import com.yeager.dpaas.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import com.yeager.dpaas.utility.implementation.DummyDNSVerification;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TenantService {
    private final TenantRepository tenantRepository;
    private final StringRedisTemplate redisTemplate;
    private final DummyDNSVerification dnsVerification;

    public Tenant createTenant(CreateTenantRequest request){
        Tenant tenant = Tenant.builder()
                .id(UUID.randomUUID().toString())
                .domain(request.getDomain())
                .name(request.getName())
                .origin(request.getOrigin())
                .plan(request.getPlan())
                .verificationToken("dpverify-" + UUID.randomUUID())
                .build();
        return tenantRepository.save(tenant);
    }

    public String verifyTenant(String domain){
        Tenant tenant = tenantRepository.findByDomain(domain)
                .orElseThrow(() -> new RuntimeException("Not found"));

        boolean verified = dnsVerification.verifyDomain(tenant.getDomain(), tenant.getVerificationToken());
        if(!verified){
            throw new RuntimeException("DNS verification failed");
        }
        tenant.setVerified(verified);
        tenantRepository.save(tenant);

        // Sync to Redis (Activate Data Plane)
        redisTemplate.opsForValue().set(
                "host_map:" + tenant.getDomain(),
                tenant.getId()
        );

        redisTemplate.opsForValue().set(
                "tenant:" + tenant.getId() + ":origin",
                tenant.getOrigin()
        );

        redisTemplate.opsForValue().set(
                "tenant:" + tenant.getId() + ":policy",
                """
                {
                  "routes": {
                    "default": { "limit": 100, "window": 60, "block": 300 }
                  }
                }
                """
        );
        return ("Tenant veified and activated");
    }



}
