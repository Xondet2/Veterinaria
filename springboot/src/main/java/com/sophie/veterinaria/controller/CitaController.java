package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Cita; import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.entity.Mascota; import com.sophie.veterinaria.repository.CitaRepository; import com.sophie.veterinaria.repository.UsuarioRepository; import com.sophie.veterinaria.repository.MascotaRepository; import com.sophie.veterinaria.service.CitaService; import org.springframework.http.ResponseEntity; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import jakarta.validation.constraints.*; import lombok.Data; import java.time.OffsetDateTime; import java.util.*;
@RestController @RequestMapping("/api/citas") public class CitaController {
  private final CitaRepository citas; private final UsuarioRepository usuarios; private final MascotaRepository mascotas; private final CitaService service;
  public CitaController(CitaRepository c, UsuarioRepository u, MascotaRepository m, CitaService s){ this.citas=c; this.usuarios=u; this.mascotas=m; this.service=s; }
  @GetMapping public ResponseEntity<?> list(@RequestParam(required=false) String veterinarian, @RequestParam(required=false) String pet){
    java.util.List<Cita> res=new java.util.ArrayList<>();
    if (veterinarian!=null && !veterinarian.isBlank()) {
      var vet = usuarios.findById(java.util.UUID.fromString(veterinarian)).orElse(null);
      if (vet==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Veterinario no encontrado"));
      res=citas.findByVeterinarian(vet);
    } else {
      res=citas.findAll();
    }
    if (pet!=null && !pet.isBlank()) res=res.stream().filter(c->c.getPet()!=null && c.getPet().getId().toString().equals(pet)).toList();

    var data = res.stream().map(c -> java.util.Map.of(
        "id", c.getId()==null? "" : c.getId().toString(),
        "veterinario", java.util.Map.of(
            "id", (c.getVeterinarian()==null || c.getVeterinarian().getId()==null)? "" : c.getVeterinarian().getId().toString(),
            "nombre", c.getVeterinarian()==null? "" : (c.getVeterinarian().getFirstName()==null? "" : c.getVeterinarian().getFirstName()),
            "apellido", c.getVeterinarian()==null? "" : (c.getVeterinarian().getLastName()==null? "" : c.getVeterinarian().getLastName())
        ),
        "mascota", java.util.Map.of(
            "id", (c.getPet()==null || c.getPet().getId()==null)? "" : c.getPet().getId().toString(),
            "nombre", c.getPet()==null? "" : (c.getPet().getName()==null? "" : c.getPet().getName())
        ),
        "fechaHoraInicio", c.getStartDateTime()==null? "" : c.getStartDateTime().toString(),
        "duracionMinutos", c.getDurationMinutes()==null? 0 : c.getDurationMinutes(),
        "motivo", c.getReason()==null? "" : c.getReason(),
        "estado", c.getStatus()==null? "" : c.getStatus().name()
    )).toList();

    return ResponseEntity.ok(java.util.Map.of("success",true,"data",data));
  }
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody CitaRequest req){
    OffsetDateTime inicio;
    try {
      inicio=OffsetDateTime.parse(req.getStartDateTime());
    } catch (Exception e){
      return ResponseEntity.badRequest().body(java.util.Map.of("error","Fecha y hora inválidas"));
    }
    var vet = usuarios.findById(java.util.UUID.fromString(req.getVeterinarianId())).orElse(null);
    if (vet==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Veterinario no encontrado"));
    if (service.hasConflict(vet.getId(), inicio, req.getDurationMinutes())) return ResponseEntity.status(409).body(java.util.Map.of("error","El veterinario no está disponible en esa hora"));
    java.util.UUID ownerId;
    if (req.getOwnerId()!=null) {
      ownerId = java.util.UUID.fromString(req.getOwnerId());
    } else if (req.getActorId()!=null) {
      var u = usuarios.findById(java.util.UUID.fromString(req.getActorId())).orElse(null);
      if (u==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Actor no encontrado"));
      if (u.getRole()== Usuario.Rol.admin || u.getRole()== Usuario.Rol.veterinario) {
        var m = mascotas.findById(java.util.UUID.fromString(req.getPetId())).orElse(null);
        if (m==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Mascota no encontrada"));
        ownerId = m.getOwner().getId();
      } else {
        ownerId = u.getId();
      }
    } else {
      return ResponseEntity.badRequest().body(java.util.Map.of("error","ownerId o actorId requerido"));
    }
    var pet = mascotas.findById(java.util.UUID.fromString(req.getPetId())).orElse(null);
    if (pet==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Mascota no encontrada"));
    var created=service.create(pet.getId(), vet.getId(), ownerId, inicio, req.getDurationMinutes(), req.getReason());
    return ResponseEntity.status(201).body(java.util.Map.of("success",true,"data",created));
  }

  @PatchMapping("/{id}/estado")
  public ResponseEntity<?> updateEstado(@PathVariable String id, @RequestParam(required=false) String actorId, @RequestBody java.util.Map<String,String> body){
    var cita=citas.findById(java.util.UUID.fromString(id)).orElse(null);
    if (cita==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Cita no encontrada"));
    if (actorId!=null) {
      var actor = usuarios.findById(java.util.UUID.fromString(actorId)).orElse(null);
      if (actor==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Actor no encontrado"));
      if (actor.getRole()!= Usuario.Rol.admin && actor.getRole()!= Usuario.Rol.veterinario) return ResponseEntity.status(403).body(java.util.Map.of("error","Solo admin/veterinario pueden actualizar estado"));
    }
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
    @NotNull @Min(15) @Max(120) private Integer durationMinutes; @NotBlank @Size(min=3,max=500) private String reason; private String ownerId; private String actorId;
  }
}
