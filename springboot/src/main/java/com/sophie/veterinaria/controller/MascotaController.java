package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Mascota; import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.repository.MascotaRepository; import com.sophie.veterinaria.repository.UsuarioRepository; import com.sophie.veterinaria.service.MascotaService; import org.springframework.http.ResponseEntity; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import jakarta.validation.constraints.*; import lombok.Data; import java.util.UUID;
@RestController @RequestMapping("/api/mascotas") public class MascotaController {
  private final MascotaRepository mascotas; private final UsuarioRepository usuarios; private final MascotaService service;
  public MascotaController(MascotaRepository m, UsuarioRepository u, MascotaService s){ this.mascotas=m; this.usuarios=u; this.service=s; }
  @GetMapping public ResponseEntity<?> list(Authentication auth){
    var userId=UUID.fromString((String)auth.getPrincipal()); var user=usuarios.findById(userId).orElseThrow();
    if (user.getRol()== Usuario.Rol.dueño) return ResponseEntity.ok(java.util.Map.of("success",true,"data",mascotas.findByDueñoAndEstado(user, Mascota.Estado.activo)));
    return ResponseEntity.ok(java.util.Map.of("success",true,"data",mascotas.findAll()));
  }
  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody MascotaRequest req, Authentication auth){
    var userId=UUID.fromString((String)auth.getPrincipal());
    var dueñoId = req.getDueñoId()!=null && !req.getDueñoId().isBlank() ? UUID.fromString(req.getDueñoId()) : userId;
    var created=service.crear(dueñoId, req.getNombre(), req.getEspecie(), req.getRaza(), req.getEdadAños(), req.getPesoKg(), req.getSexo(), req.getMicrochip(), req.getFechaNacimiento());
    return ResponseEntity.status(201).body(java.util.Map.of("success",true,"data",created));
  }
  @Data static class MascotaRequest {
    @NotBlank @Size(min=2,max=100) private String nombre; @NotBlank private String especie; @NotBlank @Size(min=2,max=100) private String raza;
    @NotNull @Min(0) @Max(50) private Integer edadAños; @NotNull @jakarta.validation.constraints.DecimalMin("0.1") @jakarta.validation.constraints.DecimalMax("150") private Double pesoKg; @NotBlank private String sexo;
    @Pattern(regexp="^[0-9A-Fa-f]{15}$") private String microchip; @NotNull private String fechaNacimiento; private String dueñoId;
  }
}
