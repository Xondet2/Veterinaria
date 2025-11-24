package com.sophie.veterinaria.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {
  @Id
  @GeneratedValue
  private UUID id;

  @Column(nullable = false, unique = true, length = 255)
  private String email;

  @Column(nullable = false, unique = true, length = 20)
  private String username;

  @Column(nullable = false, length = 255)
  private String passwordHash;

  @Column(nullable = false, length = 100)
  private String firstName;

  @Column(nullable = false, length = 100)
  private String lastName;

  @Column(length = 20, unique = true)
  private String phone;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Rol role;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private Rol requestedRole;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Estado status = Estado.activo;

  @Column(length = 100)
  private String specialty;

  @Column(length = 50)
  private String veterinaryLicense;

  @Column(nullable = false)
  private Boolean emailVerified = false;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public enum Rol { admin, veterinario, recepcionista, dueño }
  public enum Estado { activo, inactivo, suspendido }
}
