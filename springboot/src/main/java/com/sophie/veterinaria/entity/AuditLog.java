package com.sophie.veterinaria.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
  @Id @GeneratedValue private UUID id;
  @Column(nullable = false) private Instant createdAt = Instant.now();
  @Column(length = 36) private String userId;
  @Column(length = 20) private String action;
  @Column(length = 100) private String resource;
  @Column(length = 500) private String details;
}