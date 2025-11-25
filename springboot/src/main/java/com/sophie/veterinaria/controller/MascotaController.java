package com.sophie.veterinaria.controller;

import com.sophie.veterinaria.entity.Mascota;
import com.sophie.veterinaria.entity.Usuario;
import com.sophie.veterinaria.repository.CertificadoRepository;
import com.sophie.veterinaria.repository.CitaRepository;
import com.sophie.veterinaria.repository.HistorialMedicoRepository;
import com.sophie.veterinaria.repository.MascotaRepository;
import com.sophie.veterinaria.repository.UsuarioRepository;
import com.sophie.veterinaria.repository.VacunaRepository;
import com.sophie.veterinaria.service.MascotaService;
import com.sophie.veterinaria.service.SseService;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {
  private final MascotaRepository mascotas;
  private final UsuarioRepository usuarios;
  private final VacunaRepository vacunas;
  private final CertificadoRepository certificados;
  private final HistorialMedicoRepository historiales;
  private final CitaRepository citas;
  private final MascotaService service;
  private final SseService sse;

  public MascotaController(
      MascotaRepository m,
      UsuarioRepository u,
      VacunaRepository v,
      CertificadoRepository c,
      HistorialMedicoRepository h,
      CitaRepository ci,
      MascotaService s,
      SseService sse
  ) {
    this.mascotas = m;
    this.usuarios = u;
    this.vacunas = v;
    this.certificados = c;
    this.historiales = h;
    this.citas = ci;
    this.service = s;
    this.sse = sse;
  }

  @GetMapping
  public ResponseEntity<?> list(Authentication auth){
    List<Mascota> list = mascotas.findAll();
    if (auth != null && auth.getPrincipal() != null) {
      try {
        var userId = UUID.fromString((String)auth.getPrincipal());
        var user = usuarios.findById(userId).orElse(null);
        if (user != null && user.getRole() == Usuario.Rol.dueño) {
          list = list.stream().filter(m -> m.getOwner() != null && m.getOwner().getId().equals(user.getId())).toList();
        }
      } catch (Exception ignored) { /* principal no es UUID, continuar sin filtrar */ }
    }
    var data = list.stream().map(m -> Map.of(
      "id", m.getId() == null ? "" : m.getId().toString(),
      "nombre", m.getName() == null ? "" : m.getName(),
      "especie", m.getSpecies() == null ? "" : m.getSpecies().name(),
      "raza", m.getBreed() == null ? "" : m.getBreed(),
      "edadAños", m.getAgeYears() == null ? 0 : m.getAgeYears(),
      "pesoKg", m.getWeightKg() == null ? 0.0 : m.getWeightKg(),
      "sexo", m.getSex() == null ? "" : m.getSex().name(),
      "microchip", m.getMicrochip() == null ? "" : m.getMicrochip()
    )).toList();
    return ResponseEntity.ok(Map.of("success", true, "data", data));
  }

  @PostMapping
  public ResponseEntity<?> create(@Validated @RequestBody MascotaRequest req, Authentication auth){
    UUID actorId = null;
    try { if (auth!=null && auth.getPrincipal()!=null) actorId = UUID.fromString((String)auth.getPrincipal()); } catch (Exception ignored) {}
    if ((actorId==null || actorId.toString().isBlank()) && req.getActorId()!=null && !req.getActorId().isBlank()) {
      try { actorId = UUID.fromString(req.getActorId()); } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error","ID de actor inválido")); }
    }
    var actor = (actorId!=null) ? usuarios.findById(actorId).orElse(null) : null;
    UUID ownerId;
    if (req.getOwnerId()!=null && !req.getOwnerId().isBlank()) {
      try { ownerId = UUID.fromString(req.getOwnerId()); } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error","ID de dueño inválido")); }
    } else { ownerId = actorId; }
    if (actor != null && actor.getRole() == Usuario.Rol.dueño && !ownerId.equals(actorId)) {
      return ResponseEntity.status(403).body(Map.of("error","Dueño solo puede crear mascotas para sí mismo"));
    }
    var owner = usuarios.findById(ownerId).orElse(null);
    if (owner == null) return ResponseEntity.status(404).body(Map.of("error","Dueño no encontrado"));
    var created = service.create(
        ownerId,
        req.getName(),
        req.getSpecies(),
        req.getBreed(),
        req.getAgeYears(),
        req.getWeightKg(),
        req.getSex(),
        req.getMicrochip(),
        req.getBirthDate()
    );
    sse.publish("mascotas:created", Map.of("id", created.getId().toString(), "ownerId", created.getOwner().getId().toString()));
    return ResponseEntity.status(201).body(Map.of("success", true, "data", created));
  }

  @Data
  static class MascotaRequest {
    @NotBlank @Size(min=2,max=100) private String name;
    @NotBlank private String species;
    @NotBlank @Size(min=2,max=100) private String breed;
    @NotNull @Min(0) @Max(50) private Integer ageYears;
    @NotNull @DecimalMin("0.1") private Double weightKg;
    @NotBlank private String sex;
    @Pattern(regexp="(^$)|^[0-9A-Fa-f]{15}$") private String microchip;
    @NotBlank private String birthDate;
    @Pattern(regexp="(^$)|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$") private String ownerId;
    @Pattern(regexp="(^$)|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$") private String actorId;
  }

  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @Transactional
  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable String id, Authentication auth){
    var m = mascotas.findById(UUID.fromString(id)).orElse(null);
    if (m==null) return ResponseEntity.status(404).body(Map.of("error","Mascota no encontrada"));
    var vacs = vacunas.findByPetOrderByAppliedDateDesc(m); if (!vacs.isEmpty()) vacunas.deleteAll(vacs);
    var certs = certificados.findByPet(m); if (!certs.isEmpty()) certificados.deleteAll(certs);
    var hist = historiales.findByPetOrderByDateDesc(m); if (!hist.isEmpty()) historiales.deleteAll(hist);
    var appts = citas.findByPet(m); if (!appts.isEmpty()) citas.deleteAll(appts);
    mascotas.deleteById(m.getId());
    sse.publish("mascotas:deleted", java.util.Map.of("id", m.getId().toString()));
    return ResponseEntity.ok(Map.of("success", true));
  }
}
