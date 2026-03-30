package com.yeager.dpaas.website;

import com.yeager.dpaas.auth.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "websites")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Website {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String domain;

    @Column(nullable = false)
    private String targetOrigin;

    @Column(nullable = false, unique = true)
    private String apiKey;

    @CreationTimestamp
    private Instant createdAt;
}
