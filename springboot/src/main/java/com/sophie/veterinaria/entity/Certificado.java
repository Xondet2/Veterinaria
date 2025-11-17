package com.sophie.veterinaria.entity;
import jakarta.persistence.*; import lombok.Data; import java.time.LocalDate; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="certificados") @Data public class Certificado {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional=false) @JoinColumn(name="mascota_id") private Mascota mascota;
  @ManyToOne(optional=false) @JoinColumn(name="veterinario_id") private Usuario veterinario;
  @Column(nullable=false, length=50) private String tipo;
  @Column(nullable=false, length=500) private String descripcion;
  @Column(nullable=false) private LocalDate fechaEmision;
  @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Estado estado=Estado.vigente;
  @Column(nullable=false) private Instant fechaCreacion=Instant.now();
  public enum Estado { vigente, anulado }
}