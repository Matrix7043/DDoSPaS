package com.yeager.dpaas.ratelimit;

import com.yeager.dpaas.endpoint.Endpoint;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rate_limit_rules")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RateLimitRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endpoint_id", nullable = false, unique = true)
    private Endpoint endpoint;

    private int capacity;
    private int refillRate;
    private int windowSeconds;
}
