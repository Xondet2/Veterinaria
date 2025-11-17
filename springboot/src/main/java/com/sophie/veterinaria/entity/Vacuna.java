package com.sophie.veterinaria.entity;
import jakarta.persistence.*; import lombok.Data; import java.time.LocalDate; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="vacunas") @Data public class Vacuna {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional=false) @JoinColumn(name="mascota_id") private Mascota mascota;
  @ManyToOne(optional=false) @JoinColumn(name="veterinario_id") private Usuario veterinario;
  @Column(nullable=false, length=100) private String nombre;
  @Column(nullable=false) private LocalDate fechaAplicacion;
  @Column(length=50) private String dosis;
  @Column(length=50) private String lote;
  private LocalDate proximaFecha;
  @Column(nullable=false) private Instant fechaCreacion=Instant.now();
}