package com.sophie.veterinaria.entity;
import jakarta.persistence.*; import lombok.Data; import java.time.LocalDate; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="certificados") @Data public class Certificado {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional=false) @JoinColumn(name="pet_id") private Mascota pet;
  @ManyToOne(optional=false) @JoinColumn(name="veterinarian_id") private Usuario veterinarian;
  @Column(nullable=false, length=50) private String type;
  @Column(nullable=false, length=500) private String description;
  @Column(nullable=false) private LocalDate issuedDate;
  @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Estado status=Estado.vigente;
  @Column(nullable=false) private Instant createdAt=Instant.now();
  public enum Estado { vigente, anulado }
}