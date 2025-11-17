package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.*; import com.sophie.veterinaria.repository.*; import org.springframework.http.ResponseEntity; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import jakarta.validation.constraints.*; import lombok.Data; import java.time.LocalDate; import java.util.*; import java.util.UUID;
@RestController @RequestMapping("/api/historial") public class HistorialMedicoController {
  private final HistorialMedicoRepository historiales; private final MascotaRepository mascotas; private final UsuarioRepository usuarios;
  public HistorialMedicoController(HistorialMedicoRepository h, MascotaRepository m, UsuarioRepository u){ this.historiales=h; this.mascotas=m; this.usuarios=u; }
  @GetMapping public ResponseEntity<?> list(@RequestParam(required=false) String mascota, Authentication auth){
    var userId=UUID.fromString((String)auth.getPrincipal()); var user=usuarios.findById(userId).orElseThrow(); List<HistorialMedico> res;
    if (mascota!=null){ var m=mascotas.findById(UUID.fromString(mascota)).orElseThrow(); res=historiales.findByMascotaOrderByFechaDesc(m);
    } else { res=historiales.findAll(); }
    if (user.getRol()== Usuario.Rol.dueño) res=res.stream().filter(h->h.getMascota().getDueño().getId().equals(user.getId())).toList();
    return ResponseEntity.ok(Map.of("success",true,"data",res));
  }
  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody CreateHistorial req, Authentication auth){
    var vetId=UUID.fromString((String)auth.getPrincipal()); var vet=usuarios.findById(vetId).orElseThrow(); var m=mascotas.findById(UUID.fromString(req.getMascotaId())).orElseThrow();
    var h=new HistorialMedico(); h.setMascota(m); h.setVeterinario(vet); h.setFecha(LocalDate.parse(req.getFecha())); h.setDescripcion(req.getDescripcion()); h.setDiagnostico(req.getDiagnostico()); h.setTratamiento(req.getTratamiento());
    var saved=historiales.save(h); return ResponseEntity.status(201).body(Map.of("success",true,"data",saved));
  }
  @Data static class CreateHistorial { @NotNull private String mascotaId; @NotBlank private String fecha; @NotBlank @Size(min=5,max=500) private String descripcion; private String diagnostico; private String tratamiento; }
}