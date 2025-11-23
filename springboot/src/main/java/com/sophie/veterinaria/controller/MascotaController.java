package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Mascota; import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.repository.MascotaRepository; import com.sophie.veterinaria.repository.UsuarioRepository; import com.sophie.veterinaria.repository.VacunaRepository; import com.sophie.veterinaria.repository.CertificadoRepository; import com.sophie.veterinaria.repository.HistorialMedicoRepository; import com.sophie.veterinaria.repository.CitaRepository; import com.sophie.veterinaria.service.MascotaService; import com.sophie.veterinaria.service.AuditService; import org.springframework.http.ResponseEntity; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import jakarta.validation.constraints.*; import lombok.Data; import java.util.UUID;
@RestController @RequestMapping("/api/mascotas") public class MascotaController {
  private final MascotaRepository mascotas; private final UsuarioRepository usuarios; private final VacunaRepository vacunas; private final CertificadoRepository certificados; private final HistorialMedicoRepository historiales; private final CitaRepository citas; private final MascotaService service; private final AuditService audit;
  public MascotaController(MascotaRepository m, UsuarioRepository u, VacunaRepository v, CertificadoRepository c, HistorialMedicoRepository h, CitaRepository ci, MascotaService s, AuditService a){ this.mascotas=m; this.usuarios=u; this.vacunas=v; this.certificados=c; this.historiales=h; this.citas=ci; this.service=s; this.audit=a; }
  @GetMapping public ResponseEntity<?> list(Authentication auth){
    var userId=UUID.fromString((String)auth.getPrincipal()); var user=usuarios.findById(userId).orElseThrow();
    // Visualización abierta para todos los usuarios autenticados
    return ResponseEntity.ok(java.util.Map.of("success",true,"data",mascotas.findAll()));
  }
  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody MascotaRequest req, Authentication auth){
    var userId=UUID.fromString((String)auth.getPrincipal());
    var dueñoId = req.getDueñoId()!=null && !req.getDueñoId().isBlank() ? UUID.fromString(req.getDueñoId()) : userId;
    try {
      var created=service.crear(dueñoId, req.getNombre(), req.getEspecie(), req.getRaza(), req.getEdadAños(), req.getPesoKg(), req.getSexo(), req.getMicrochip(), req.getFechaNacimiento());
      audit.log("mascota","CREATE", created.getId(), userId, null);
      return ResponseEntity.status(201).body(java.util.Map.of("success",true,"data",created));
    } catch (IllegalArgumentException e){
      return ResponseEntity.status(409).body(java.util.Map.of("error","Mascota ya existe para el dueño"));
    }
  }
  @Data static class MascotaRequest {
    @NotBlank @Size(min=2,max=100) private String nombre; @NotBlank private String especie; @NotBlank @Size(min=2,max=100) private String raza;
    @NotNull @Min(0) @Max(50) private Integer edadAños; @NotNull @jakarta.validation.constraints.DecimalMin("0.1") @jakarta.validation.constraints.DecimalMax("150") private Double pesoKg; @NotBlank private String sexo;
    @Pattern(regexp="^[0-9A-Fa-f]{15}$") private String microchip; @NotBlank private String fechaNacimiento; @Pattern(regexp="(^$)|(^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$)") private String dueñoId;
  }

  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @org.springframework.transaction.annotation.Transactional
  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable String id, Authentication auth){
    var actorId = UUID.fromString((String)auth.getPrincipal());
    var m = mascotas.findById(UUID.fromString(id)).orElse(null);
    if (m==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Mascota no encontrada"));
    var vacs = vacunas.findByPetOrderByAppliedDateDesc(m); if (!vacs.isEmpty()) vacunas.deleteAll(vacs);
    var certs = certificados.findByPet(m); if (!certs.isEmpty()) certificados.deleteAll(certs);
    var hist = historiales.findByPetOrderByDateDesc(m); if (!hist.isEmpty()) historiales.deleteAll(hist);
    var appts = citas.findByPet(m); if (!appts.isEmpty()) citas.deleteAll(appts);
    mascotas.deleteById(m.getId());
    audit.log("mascota","DELETE", m.getId(), actorId, null);
    return ResponseEntity.ok(java.util.Map.of("success",true));
  }
}
