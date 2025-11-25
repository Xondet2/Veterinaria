package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.*; import com.sophie.veterinaria.repository.*; import org.springframework.http.ResponseEntity; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import jakarta.validation.constraints.*; import lombok.Data; import java.time.LocalDate; import java.util.*; import java.util.UUID;
@RestController @RequestMapping("/api/vacunas") public class VacunaController {
  private final VacunaRepository vacunas; private final MascotaRepository mascotas; private final UsuarioRepository usuarios;
  public VacunaController(VacunaRepository v, MascotaRepository m, UsuarioRepository u){ this.vacunas=v; this.mascotas=m; this.usuarios=u; }
  @GetMapping public ResponseEntity<?> list(@RequestParam(required=false) String pet, Authentication auth){
    List<Vacuna> res;
    if (pet!=null){
      UUID petId; try { petId = UUID.fromString(pet); } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error","ID de mascota inválido")); }
      var m=mascotas.findById(petId).orElse(null); if (m==null) return ResponseEntity.status(404).body(Map.of("error","Mascota no encontrada")); res=vacunas.findByPetOrderByAppliedDateDesc(m);
    } else { res=vacunas.findAll(); }
    if (auth != null && auth.getPrincipal() != null) {
      var userId=UUID.fromString((String)auth.getPrincipal()); var user=usuarios.findById(userId).orElse(null);
      if (user != null && user.getRole()== Usuario.Rol.dueño) res=res.stream().filter(v->v.getPet()!=null && v.getPet().getOwner()!=null && v.getPet().getOwner().getId().equals(user.getId())).toList();
    }
    var data = res.stream().map(v -> Map.of(
      "id", v.getId() == null ? "" : v.getId().toString(),
      "nombre", v.getName() == null ? "" : v.getName(),
      "fechaAplicacion", v.getAppliedDate() == null ? "" : v.getAppliedDate().toString(),
      "dosis", v.getDose() == null ? "" : v.getDose(),
      "lote", v.getLot() == null ? "" : v.getLot(),
      "proximaFecha", v.getNextDate() == null ? "" : v.getNextDate().toString(),
      "mascota", Map.of("id", v.getPet() == null || v.getPet().getId() == null ? "" : v.getPet().getId().toString(), "nombre", v.getPet() == null || v.getPet().getName() == null ? "" : v.getPet().getName())
    )).toList();
    return ResponseEntity.ok(Map.of("success",true,"data",data));
  }
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody CreateVacuna req){
    UUID vetId; try { vetId = UUID.fromString(req.getVetId()); } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error","ID de veterinario inválido")); }
    var vet=usuarios.findById(vetId).orElse(null); if (vet==null) return ResponseEntity.status(404).body(Map.of("error","Veterinario no encontrado"));
    if (vet.getRole()!= Usuario.Rol.admin && vet.getRole()!= Usuario.Rol.veterinario)
      return ResponseEntity.status(403).body(Map.of("error","Solo admin/veterinario pueden registrar vacunas"));
    UUID petId; try { petId = UUID.fromString(req.getPetId()); } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error","ID de mascota inválido")); }
    var m=mascotas.findById(petId).orElse(null); if (m==null) return ResponseEntity.status(404).body(Map.of("error","Mascota no encontrada"));
    var v=new Vacuna(); v.setPet(m); v.setVeterinarian(vet); v.setName(req.getName());
    LocalDate applied; try { applied = LocalDate.parse(req.getAppliedDate()); } catch (Exception ex) { try { var fmt = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"); applied = LocalDate.parse(req.getAppliedDate(), fmt); } catch (Exception ex2) { return ResponseEntity.badRequest().body(Map.of("error","Fecha de aplicación inválida")); } }
    v.setAppliedDate(applied);
    v.setDose(req.getDose()); v.setLot(req.getLot());
    LocalDate next = null; if (req.getNextDate()!=null && !req.getNextDate().isBlank()) { try { next = LocalDate.parse(req.getNextDate()); } catch (Exception ex) { try { var fmt = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"); next = LocalDate.parse(req.getNextDate(), fmt); } catch (Exception ex2) { return ResponseEntity.badRequest().body(Map.of("error","Próxima fecha inválida")); } } }
    v.setNextDate(next);
    var saved=vacunas.save(v); return ResponseEntity.status(201).body(Map.of("success",true,"data",saved));
  }
  @Data static class CreateVacuna { @NotNull private String petId; @NotBlank private String name; @NotBlank private String appliedDate; private String dose; private String lot; private String nextDate; @NotNull private String vetId; }
}