package com.yeager.dpaas.endpoint;

import com.yeager.dpaas.website.Website;
import com.yeager.dpaas.website.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EndpointService {

    private final EndpointRepository endpointRepository;
    private final WebsiteRepository websiteRepository;

    public EndpointResponse create(String websiteId, CreateEndpointRequest req) {
        Website website = websiteRepository.findById(websiteId)
                .orElseThrow(() -> new RuntimeException("Website not found"));

        Endpoint endpoint = Endpoint.builder()
                .website(website)
                .path(req.getPath())
                .method(req.getMethod().toUpperCase())
                .build();

        return EndpointResponse.from(endpointRepository.save(endpoint));
    }

    public List<EndpointResponse> findAll(String websiteId) {
        return endpointRepository.findByWebsite_Id(websiteId)
                .stream()
                .map(EndpointResponse::from)
                .collect(Collectors.toList());
    }

    public void delete(String endpointId) {
        endpointRepository.findById(endpointId)
                .orElseThrow(() -> new RuntimeException("Endpoint not found"));
        endpointRepository.deleteById(endpointId);
    }
}
