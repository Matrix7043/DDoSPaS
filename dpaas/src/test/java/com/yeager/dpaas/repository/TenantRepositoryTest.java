package com.yeager.dpaas.repository;

import com.yeager.dpaas.entity.Tenant;
import com.yeager.dpaas.enums.PlanType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class TenantRepositoryTest {

    @Autowired
    private TenantRepository tenantRepository;

    Tenant tenant1;
    String id = "123";
    String domain = "www.xyz.com";
    String origin = "http://128.172.8.2:3000";
    String name = "Hostinger";
    PlanType plan = PlanType.FREE;
    String verificationToken = "1111";

    @BeforeEach
    void setUp() {
        tenant1 = Tenant.builder()
                .id(id)
                .origin(origin)
                .verificationToken(verificationToken)
                .name(name)
                .domain(domain)
                .plan(plan)
                .build();
    }

    @Test
    public void saveTenant() {

        Tenant savedTenant = tenantRepository.save(tenant1);
        assertNotNull(savedTenant);

        assertNotNull(savedTenant.getId());
        assertEquals(name, savedTenant.getName());
        assertEquals(domain, savedTenant.getDomain());
    }

    @Test
    public void testFindByDomain() throws Exception {
        Tenant savedTenant = tenantRepository.save(tenant1);

        Tenant foundTenant = tenantRepository.findByDomain(savedTenant.getDomain())
                .orElseThrow(() -> new RuntimeException("Tenant not Found"));

        assertNotNull(foundTenant);
        assertEquals(savedTenant.getId(), foundTenant.getId());
    }
}
