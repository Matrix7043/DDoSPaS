package com.yeager.dpaas.endpoint;

import com.yeager.dpaas.website.Website;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "endpoints")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Endpoint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "website_id", nullable = false)
    private Website website;

    @Column(nullable = false)
    private String path;

    @Column(nullable = false)
    private String method;

    @CreationTimestamp
    private Instant createdAt;
}
