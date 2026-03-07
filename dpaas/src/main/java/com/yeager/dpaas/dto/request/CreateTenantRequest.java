package com.yeager.dpaas.dto.request;

import com.yeager.dpaas.enums.PlanType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTenantRequest {
    @NotBlank(message = "Tenant name is required")
    @Size(max = 100, message = "Tenant name must be less than 100 characters")
    private String name;

    @NotBlank(message = "Domain name is required")
    @Pattern(
            regexp = "^(?=.{1,253}$)(?!-)[A-Za-z0-9-]+(\\\\.[A-Za-z0-9-]+)+$",
            message = "Invalid domain format"
    )
    private String domain;

    @NotBlank(message = "Origin URL is required")
    @Pattern(
            regexp = "^(http|https)://.*$",
            message = "Origin must start with http:// or https://"
    )
    private String origin;

    @NotNull(message = "Plan is required")
    private PlanType plan;
}
