package com.yeager.dpaas.endpoint;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateEndpointRequest {
    @NotBlank
    private String path;

    @NotBlank
    private String method;
}
