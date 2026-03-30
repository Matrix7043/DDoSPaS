package com.yeager.dpaas.endpoint;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EndpointController {

    private final EndpointService endpointService;

    @PostMapping("/websites/{websiteId}/endpoints")
    public ResponseEntity<EndpointResponse> create(
            @PathVariable String websiteId,
            @Valid @RequestBody CreateEndpointRequest request) {
        return ResponseEntity.ok(endpointService.create(websiteId, request));
    }

    @GetMapping("/websites/{websiteId}/endpoints")
    public ResponseEntity<List<EndpointResponse>> getAll(@PathVariable String websiteId) {
        return ResponseEntity.ok(endpointService.findAll(websiteId));
    }

    @DeleteMapping("/endpoints/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        endpointService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
