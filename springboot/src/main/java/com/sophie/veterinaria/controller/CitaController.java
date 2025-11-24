package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Cita; import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.entity.Mascota; import com.sophie.veterinaria.repository.CitaRepository; import com.sophie.veterinaria.repository.UsuarioRepository; import com.sophie.veterinaria.repository.MascotaRepository; import com.sophie.veterinaria.service.CitaService; import org.springframework.http.ResponseEntity; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import jakarta.validation.constraints.*; import lombok.Data; import java.time.OffsetDateTime; import java.util.*;
@RestController @RequestMapping("/api/citas") public class CitaController {
  private final CitaRepository citas; private final UsuarioRepository usuarios; private final MascotaRepository mascotas; private final CitaService service;
  public CitaController(CitaRepository c, UsuarioRepository u, MascotaRepository m, CitaService s){ this.citas=c; this.usuarios=u; this.mascotas=m; this.service=s; }
  @GetMapping public ResponseEntity<?> list(@RequestParam(required=false) String veterinarian, @RequestParam(required=false) String pet, Authentication auth){
    var userId=java.util.UUID.fromString((String)auth.getPrincipal()); var user=usuarios.findById(userId).orElseThrow(); java.util.List<Cita> res=new java.util.ArrayList<>();
    if (veterinarian!=null && user.getRole()== Usuario.Rol.veterinario) res=citas.findByVeterinarian(usuarios.findById(java.util.UUID.fromString(veterinarian)).orElseThrow());
    else if (user.getRole()== Usuario.Rol.dueño) res=citas.findByOwnerOrderByStartDateTimeDesc(user);
    else res=citas.findAll();
    if (pet!=null) res=res.stream().filter(c->c.getPet().getId().toString().equals(pet)).toList();
    return ResponseEntity.ok(java.util.Map.of("success",true,"data",res));
  }
  @PreAuthorize("isAuthenticated()")
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody CitaRequest req, Authentication auth){
    var userId=java.util.UUID.fromString((String)auth.getPrincipal()); var inicio=OffsetDateTime.parse(req.getStartDateTime());
    if (service.hasConflict(java.util.UUID.fromString(req.getVeterinarianId()), inicio, req.getDurationMinutes())) return ResponseEntity.status(409).body(java.util.Map.of("error","El veterinario no está disponible en esa hora"));
    java.util.UUID ownerId;
    if (req.getOwnerId()!=null) {
      ownerId = java.util.UUID.fromString(req.getOwnerId());
    } else {
      var u = usuarios.findById(userId).orElseThrow();
      if (u.getRole()== Usuario.Rol.admin || u.getRole()== Usuario.Rol.veterinario) {
        var m = mascotas.findById(java.util.UUID.fromString(req.getPetId())).orElseThrow();
        ownerId = m.getOwner().getId();
      } else {
        ownerId = userId;
      }
    }
    var created=service.create(java.util.UUID.fromString(req.getPetId()), java.util.UUID.fromString(req.getVeterinarianId()), ownerId, inicio, req.getDurationMinutes(), req.getReason());
    return ResponseEntity.status(201).body(java.util.Map.of("success",true,"data",created));
  }

  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @PatchMapping("/{id}/estado")
  public ResponseEntity<?> updateEstado(@PathVariable String id, @RequestBody java.util.Map<String,String> body){
    var cita=citas.findById(java.util.UUID.fromString(id)).orElse(null);
    if (cita==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Cita no encontrada"));
    try {
      var nuevo=com.sophie.veterinaria.entity.Cita.Estado.valueOf(body.getOrDefault("status","confirmada"));
      cita.setStatus(nuevo);
      citas.save(cita);
      return ResponseEntity.ok(java.util.Map.of("success",true,"data",cita));
    } catch (Exception e){
      return ResponseEntity.badRequest().body(java.util.Map.of("error","Estado inválido"));
    }
  }
  @Data static class CitaRequest {
    @NotNull private String petId; @NotNull private String veterinarianId; @NotNull private String startDateTime;
    @NotNull @Min(15) @Max(120) private Integer durationMinutes; @NotBlank @Size(min=3,max=500) private String reason; private String ownerId;
  }
}
