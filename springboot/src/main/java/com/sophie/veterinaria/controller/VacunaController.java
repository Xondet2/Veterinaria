package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.*; import com.sophie.veterinaria.repository.*; import org.springframework.http.ResponseEntity; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import jakarta.validation.constraints.*; import lombok.Data; import java.time.LocalDate; import java.util.*; import java.util.UUID;
@RestController @RequestMapping("/api/vacunas") public class VacunaController {
  private final VacunaRepository vacunas; private final MascotaRepository mascotas; private final UsuarioRepository usuarios;
  public VacunaController(VacunaRepository v, MascotaRepository m, UsuarioRepository u){ this.vacunas=v; this.mascotas=m; this.usuarios=u; }
  @GetMapping public ResponseEntity<?> list(@RequestParam(required=false) String mascota, Authentication auth){
    var userId=UUID.fromString((String)auth.getPrincipal()); var user=usuarios.findById(userId).orElseThrow(); List<Vacuna> res;
    if (mascota!=null){ var m=mascotas.findById(UUID.fromString(mascota)).orElseThrow(); res=vacunas.findByMascotaOrderByFechaAplicacionDesc(m);
    } else { res=vacunas.findAll(); }
    if (user.getRol()== Usuario.Rol.dueño) res=res.stream().filter(v->v.getMascota().getDueño().getId().equals(user.getId())).toList();
    return ResponseEntity.ok(Map.of("success",true,"data",res));
  }
  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody CreateVacuna req, Authentication auth){
    var vetId=UUID.fromString((String)auth.getPrincipal()); var vet=usuarios.findById(vetId).orElseThrow(); var m=mascotas.findById(UUID.fromString(req.getMascotaId())).orElseThrow();
    var v=new Vacuna(); v.setMascota(m); v.setVeterinario(vet); v.setNombre(req.getNombre()); v.setFechaAplicacion(LocalDate.parse(req.getFechaAplicacion())); v.setDosis(req.getDosis()); v.setLote(req.getLote()); v.setProximaFecha(req.getProximaFecha()!=null? LocalDate.parse(req.getProximaFecha()): null);
    var saved=vacunas.save(v); return ResponseEntity.status(201).body(Map.of("success",true,"data",saved));
  }
  @Data static class CreateVacuna { @NotNull private String mascotaId; @NotBlank private String nombre; @NotBlank private String fechaAplicacion; private String dosis; private String lote; private String proximaFecha; }
}