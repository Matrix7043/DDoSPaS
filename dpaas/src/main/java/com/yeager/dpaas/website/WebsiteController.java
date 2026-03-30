package com.yeager.dpaas.website;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/websites")
@RequiredArgsConstructor
public class WebsiteController {

    private final WebsiteService websiteService;

    @PostMapping
    public ResponseEntity<WebsiteResponse> create(@Valid @RequestBody CreateWebsiteRequest request) {
        return ResponseEntity.ok(websiteService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<WebsiteResponse>> getAll() {
        return ResponseEntity.ok(websiteService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        websiteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
