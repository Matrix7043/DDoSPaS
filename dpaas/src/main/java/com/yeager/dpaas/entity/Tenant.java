package com.yeager.dpaas.entity;

import com.yeager.dpaas.enums.PlanType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Data;

@Entity
@Data
@Builder
public class Tenant {
    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String domain;

    private String origin;
    private String name;
    private PlanType plan;

    private String verificationToken;
    private boolean verified = false;
}
