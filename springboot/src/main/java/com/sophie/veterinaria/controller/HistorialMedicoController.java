package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.*; import com.sophie.veterinaria.repository.*; import org.springframework.http.ResponseEntity; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import jakarta.validation.constraints.*; import lombok.Data; import java.time.LocalDate; import java.util.*; import java.util.UUID;
@RestController @RequestMapping("/api/historial") public class HistorialMedicoController {
  private final HistorialMedicoRepository historiales; private final MascotaRepository mascotas; private final UsuarioRepository usuarios;
  public HistorialMedicoController(HistorialMedicoRepository h, MascotaRepository m, UsuarioRepository u){ this.historiales=h; this.mascotas=m; this.usuarios=u; }
  @GetMapping public ResponseEntity<?> list(@RequestParam(required=false) String pet){
    List<HistorialMedico> res;
    if (pet!=null){ var m=mascotas.findById(UUID.fromString(pet)).orElseThrow(); res=historiales.findByPetOrderByDateDesc(m);
    } else { res=historiales.findAll(); }
    return ResponseEntity.ok(Map.of("success",true,"data",res));
  }
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody CreateHistorial req){
    var vet=usuarios.findById(UUID.fromString(req.getVetId())).orElseThrow();
    if (vet.getRole()!= Usuario.Rol.admin && vet.getRole()!= Usuario.Rol.veterinario)
      return ResponseEntity.status(403).body(Map.of("error","Solo admin/veterinario pueden crear historial"));
    var m=mascotas.findById(UUID.fromString(req.getPetId())).orElseThrow();
    var h=new HistorialMedico(); h.setPet(m); h.setVeterinarian(vet); h.setDate(LocalDate.parse(req.getDate())); h.setDescription(req.getDescription()); h.setDiagnosis(req.getDiagnosis()); h.setTreatment(req.getTreatment());
    var saved=historiales.save(h); return ResponseEntity.status(201).body(Map.of("success",true,"data",saved));
  }
  @Data static class CreateHistorial { @NotNull private String petId; @NotBlank private String date; @NotBlank @Size(min=5,max=500) private String description; private String diagnosis; private String treatment; @NotNull private String vetId; }
}