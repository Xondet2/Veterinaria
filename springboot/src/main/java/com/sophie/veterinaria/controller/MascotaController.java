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
    var userId = UUID.fromString((String)auth.getPrincipal());
    var user = usuarios.findById(userId).orElseThrow();
    List<Mascota> data = mascotas.findAll();
    if (user.getRole() == Usuario.Rol.dueño) {
      data = data.stream().filter(m -> m.getOwner().getId().equals(user.getId())).toList();
    }
    return ResponseEntity.ok(Map.of("success", true, "data", data));
  }

  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @PostMapping
  public ResponseEntity<?> create(@Validated @RequestBody MascotaRequest req, Authentication auth){
    var actorId = UUID.fromString((String)auth.getPrincipal());
    var ownerId = (req.getOwnerId()!=null && !req.getOwnerId().isBlank()) ? UUID.fromString(req.getOwnerId()) : actorId;
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
