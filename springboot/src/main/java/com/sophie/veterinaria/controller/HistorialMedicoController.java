package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.*; import com.sophie.veterinaria.repository.*; import org.springframework.http.ResponseEntity; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import jakarta.validation.constraints.*; import lombok.Data; import java.time.LocalDate; import java.util.*; import java.util.UUID;
@RestController @RequestMapping("/api/historial") public class HistorialMedicoController {
  private final HistorialMedicoRepository historiales; private final MascotaRepository mascotas; private final UsuarioRepository usuarios;
  public HistorialMedicoController(HistorialMedicoRepository h, MascotaRepository m, UsuarioRepository u){ this.historiales=h; this.mascotas=m; this.usuarios=u; }
  @GetMapping public ResponseEntity<?> list(@RequestParam(required=false) String pet, Authentication auth){
    var userId=UUID.fromString((String)auth.getPrincipal()); var user=usuarios.findById(userId).orElseThrow(); List<HistorialMedico> res;
    if (pet!=null){ var m=mascotas.findById(UUID.fromString(pet)).orElseThrow(); res=historiales.findByPetOrderByDateDesc(m);
    } else { res=historiales.findAll(); }
    if (user.getRole()== Usuario.Rol.dueño) res=res.stream().filter(h->h.getPet().getOwner().getId().equals(user.getId())).toList();
    return ResponseEntity.ok(Map.of("success",true,"data",res));
  }
  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody CreateHistorial req, Authentication auth){
    var vetId=UUID.fromString((String)auth.getPrincipal()); var vet=usuarios.findById(vetId).orElseThrow(); var m=mascotas.findById(UUID.fromString(req.getPetId())).orElseThrow();
    var h=new HistorialMedico(); h.setPet(m); h.setVeterinarian(vet); h.setDate(LocalDate.parse(req.getDate())); h.setDescription(req.getDescription()); h.setDiagnosis(req.getDiagnosis()); h.setTreatment(req.getTreatment());
    var saved=historiales.save(h); return ResponseEntity.status(201).body(Map.of("success",true,"data",saved));
  }
  @Data static class CreateHistorial { @NotNull private String petId; @NotBlank private String date; @NotBlank @Size(min=5,max=500) private String description; private String diagnosis; private String treatment; }
}