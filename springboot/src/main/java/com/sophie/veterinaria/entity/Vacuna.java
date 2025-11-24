package com.sophie.veterinaria.entity;
import jakarta.persistence.*; import lombok.Data; import java.time.LocalDate; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="vacunas") @Data public class Vacuna {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional=false) @JoinColumn(name="pet_id") private Mascota pet;
  @ManyToOne(optional=false) @JoinColumn(name="veterinarian_id") private Usuario veterinarian;
  @Column(nullable=false, length=100) private String name;
  @Column(nullable=false) private LocalDate appliedDate;
  @Column(length=50) private String dose;
  @Column(length=50) private String lot;
  private LocalDate nextDate;
  @Column(nullable=false) private Instant createdAt=Instant.now();
}