package com.yeager.dpaas.ratelimit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RateLimitRuleRepository extends JpaRepository<RateLimitRule, String> {
    Optional<RateLimitRule> findByEndpoint_Id(String endpointId);

    void deleteByEndpoint_Id(String endpointId);
}
