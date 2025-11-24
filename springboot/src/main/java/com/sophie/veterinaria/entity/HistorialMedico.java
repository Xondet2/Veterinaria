package com.sophie.veterinaria.entity;
import jakarta.persistence.*; import lombok.Data; import java.time.LocalDate; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="historial_medico") @Data public class HistorialMedico {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional=false) @JoinColumn(name="pet_id") private Mascota pet;
  @ManyToOne(optional=false) @JoinColumn(name="veterinarian_id") private Usuario veterinarian;
  @Column(nullable=false) private LocalDate date;
  @Column(nullable=false, length=500) private String description;
  @Column(length=500) private String diagnosis;
  @Column(length=500) private String treatment;
  @Column(nullable=false) private Instant createdAt=Instant.now();
}