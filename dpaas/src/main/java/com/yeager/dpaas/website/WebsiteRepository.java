package com.yeager.dpaas.website;

import com.yeager.dpaas.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebsiteRepository extends JpaRepository<Website, String> {
    List<Website> findByUser(User user);

    Optional<Website> findByApiKey(String apiKey);
}
