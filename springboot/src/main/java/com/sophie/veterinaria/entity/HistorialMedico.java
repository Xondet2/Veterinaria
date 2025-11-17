package com.sophie.veterinaria.entity;
import jakarta.persistence.*; import lombok.Data; import java.time.LocalDate; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="historial_medico") @Data public class HistorialMedico {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional=false) @JoinColumn(name="mascota_id") private Mascota mascota;
  @ManyToOne(optional=false) @JoinColumn(name="veterinario_id") private Usuario veterinario;
  @Column(nullable=false) private LocalDate fecha;
  @Column(nullable=false, length=500) private String descripcion;
  @Column(length=500) private String diagnostico;
  @Column(length=500) private String tratamiento;
  @Column(nullable=false) private Instant fechaCreacion=Instant.now();
}