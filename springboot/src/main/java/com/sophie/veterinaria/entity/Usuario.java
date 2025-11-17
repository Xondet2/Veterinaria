package com.sophie.veterinaria.entity;
import jakarta.persistence.*; import lombok.Data; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="usuarios") @Data public class Usuario {
  @Id @GeneratedValue private UUID id;
  @Column(nullable=false, unique=true, length=255) private String email;
  @Column(nullable=false, length=255) private String contraseñaHash;
  @Column(nullable=false, length=100) private String nombre;
  @Column(nullable=false, length=100) private String apellido;
  @Column(length=20, unique=true) private String telefono;
  @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Rol rol;
  @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Estado estado=Estado.activo;
  @Column(length=100) private String especialidad;
  @Column(length=50) private String licenciaVeterinaria;
  @Column(nullable=false) private Boolean estadoEmailVerificado=false;
  @Column(nullable=false) private Instant fechaCreacion=Instant.now();
  public enum Rol { admin, veterinario, recepcionista, dueño }
  public enum Estado { activo, inactivo, suspendido }
}
