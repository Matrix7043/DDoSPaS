package com.yeager.dpaas.endpoint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EndpointRepository extends JpaRepository<Endpoint, String> {
    List<Endpoint> findByWebsite_Id(String websiteId);

    void deleteByWebsite_Id(String websiteId);
}
