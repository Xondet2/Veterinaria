package com.sophie.veterinaria.entity;
import jakarta.persistence.*; import lombok.Data; import java.time.LocalDate; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="mascotas") @Data public class Mascota {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional=false) @JoinColumn(name="dueño_id") private Usuario dueño;
  @Column(nullable=false, length=100) private String nombre;
  @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Especie especie;
  @Column(nullable=false, length=100) private String raza;
  @Enumerated(EnumType.STRING) @Column(nullable=false, length=10) private Sexo sexo;
  @Column(nullable=false) private Integer edadAños;
  @Column(nullable=false) private Double pesoKg;
  @Column(length=15, unique=true) private String microchip;
  private LocalDate fechaNacimiento;
  @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Estado estado=Estado.activo;
  @Column(nullable=false) private Instant fechaCreacion=Instant.now();
  public enum Especie { perro, gato, conejo, pajaro, roedor, otro }
  public enum Sexo { macho, hembra }
  public enum Estado { activo, fallecido, desconocido }
}
