package com.sophie.veterinaria.entity;
import jakarta.persistence.*; import lombok.Data; import java.time.Instant; import java.time.OffsetDateTime; import java.util.UUID;
@Entity @Table(name="citas") @Data public class Cita {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional=false) @JoinColumn(name="mascota_id") private Mascota mascota;
  @ManyToOne(optional=false) @JoinColumn(name="veterinario_id") private Usuario veterinario;
  @ManyToOne(optional=false) @JoinColumn(name="dueño_id") private Usuario dueño;
  @Column(nullable=false) private OffsetDateTime fechaHoraInicio;
  @Column(nullable=false) private Integer duracionMinutos;
  @Column(nullable=false, length=500) private String motivo;
  @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Estado estado=Estado.agendada;
  @Column(length=500) private String notasInternas;
  @Column(nullable=false) private Instant fechaCreacion=Instant.now();
  public enum Estado { agendada, confirmada, completada, cancelada, no_asistió }
}
