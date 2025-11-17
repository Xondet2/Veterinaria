package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Cita; import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.entity.Mascota; import com.sophie.veterinaria.repository.CitaRepository; import com.sophie.veterinaria.repository.UsuarioRepository; import com.sophie.veterinaria.repository.MascotaRepository; import com.sophie.veterinaria.service.CitaService; import org.springframework.http.ResponseEntity; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import jakarta.validation.constraints.*; import lombok.Data; import java.time.OffsetDateTime; import java.util.*;
@RestController @RequestMapping("/api/citas") public class CitaController {
  private final CitaRepository citas; private final UsuarioRepository usuarios; private final MascotaRepository mascotas; private final CitaService service;
  public CitaController(CitaRepository c, UsuarioRepository u, MascotaRepository m, CitaService s){ this.citas=c; this.usuarios=u; this.mascotas=m; this.service=s; }
  @GetMapping public ResponseEntity<?> list(@RequestParam(required=false) String veterinario, @RequestParam(required=false) String mascota, Authentication auth){
    var userId=java.util.UUID.fromString((String)auth.getPrincipal()); var user=usuarios.findById(userId).orElseThrow(); java.util.List<Cita> res=new java.util.ArrayList<>();
    if (veterinario!=null && user.getRol()== Usuario.Rol.veterinario) res=citas.findByVeterinario(usuarios.findById(java.util.UUID.fromString(veterinario)).orElseThrow());
    else if (user.getRol()== Usuario.Rol.dueño) res=citas.findByDueñoOrderByFechaHoraInicioDesc(user);
    else res=citas.findAll();
    if (mascota!=null) res=res.stream().filter(c->c.getMascota().getId().toString().equals(mascota)).toList();
    return ResponseEntity.ok(java.util.Map.of("success",true,"data",res));
  }
  @PreAuthorize("hasAnyRole('admin','veterinario','dueño')")
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody CitaRequest req, Authentication auth){
    var userId=java.util.UUID.fromString((String)auth.getPrincipal()); var inicio=OffsetDateTime.parse(req.getFechaHora());
    if (service.hayConflicto(java.util.UUID.fromString(req.getVeterinarioId()), inicio, req.getDuracionMinutos())) return ResponseEntity.status(409).body(java.util.Map.of("error","El veterinario no está disponible en esa hora"));
    java.util.UUID dueñoId;
    if (req.getDueñoId()!=null) {
      dueñoId = java.util.UUID.fromString(req.getDueñoId());
    } else {
      var u = usuarios.findById(userId).orElseThrow();
      if (u.getRol()== Usuario.Rol.admin || u.getRol()== Usuario.Rol.veterinario) {
        var m = mascotas.findById(java.util.UUID.fromString(req.getMascotaId())).orElseThrow();
        dueñoId = m.getDueño().getId();
      } else {
        dueñoId = userId;
      }
    }
    var created=service.crear(java.util.UUID.fromString(req.getMascotaId()), java.util.UUID.fromString(req.getVeterinarioId()), dueñoId, inicio, req.getDuracionMinutos(), req.getMotivo());
    return ResponseEntity.status(201).body(java.util.Map.of("success",true,"data",created));
  }

  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @PatchMapping("/{id}/estado")
  public ResponseEntity<?> updateEstado(@PathVariable String id, @RequestBody java.util.Map<String,String> body){
    var cita=citas.findById(java.util.UUID.fromString(id)).orElse(null);
    if (cita==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Cita no encontrada"));
    try {
      var nuevo=com.sophie.veterinaria.entity.Cita.Estado.valueOf(body.getOrDefault("estado","confirmada"));
      cita.setEstado(nuevo);
      citas.save(cita);
      return ResponseEntity.ok(java.util.Map.of("success",true,"data",cita));
    } catch (Exception e){
      return ResponseEntity.badRequest().body(java.util.Map.of("error","Estado inválido"));
    }
  }
  @Data static class CitaRequest {
    @NotNull private String mascotaId; @NotNull private String veterinarioId; @NotNull private String fechaHora;
    @NotNull @Min(15) @Max(120) private Integer duracionMinutos; @NotBlank @Size(min=10,max=500) private String motivo; private String dueñoId;
  }
}
