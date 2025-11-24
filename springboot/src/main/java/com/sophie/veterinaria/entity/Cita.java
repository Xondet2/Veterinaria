package com.sophie.veterinaria.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "citas")
@Data
public class Cita {
  @Id
  @GeneratedValue
  private UUID id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "pet_id")
  private Mascota pet;

  @ManyToOne(optional = false)
  @JoinColumn(name = "veterinarian_id")
  private Usuario veterinarian;

  @ManyToOne(optional = false)
  @JoinColumn(name = "owner_id")
  private Usuario owner;

  @Column(nullable = false)
  private OffsetDateTime startDateTime;

  @Column(nullable = false)
  private Integer durationMinutes;

  @Column(nullable = false, length = 500)
  private String reason;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Estado status = Estado.agendada;

  @Column(length = 500)
  private String internalNotes;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  public enum Estado { agendada, confirmada, completada, cancelada, no_asistió }
}
