package com.sophie.veterinaria.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mascotas")
@Data
public class Mascota {
  @Id
  @GeneratedValue
  private UUID id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "owner_id")
  private Usuario owner;

  @Column(nullable = false, length = 100)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Especie species;

  @Column(nullable = false, length = 100)
  private String breed;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  private Sexo sex;

  @Column(nullable = false)
  private Integer ageYears;

  @Column(nullable = false)
  private Double weightKg;

  @Column(length = 15, unique = true)
  private String microchip;

  private LocalDate birthDate;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Estado status = Estado.activo;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public enum Especie { perro, gato, conejo, pajaro, roedor, otro }
  public enum Sexo { macho, hembra }
  public enum Estado { activo, fallecido, desconocido }
}
