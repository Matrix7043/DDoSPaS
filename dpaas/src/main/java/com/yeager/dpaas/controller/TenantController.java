package com.yeager.dpaas.controller;

import com.yeager.dpaas.dto.request.CreateTenantRequest;
import com.yeager.dpaas.entity.Tenant;
import com.yeager.dpaas.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    public Tenant create(@RequestBody CreateTenantRequest request){
        return tenantService.createTenant(request);
    }
    @PostMapping("/verify")
    public String verify(@RequestParam String domain){
        return tenantService.verifyTenant(domain);
    }
}
