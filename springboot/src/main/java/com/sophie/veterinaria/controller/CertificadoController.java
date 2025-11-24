package com.sophie.veterinaria.controller;

import com.sophie.veterinaria.entity.*;
import com.sophie.veterinaria.repository.*;
import com.sophie.veterinaria.service.SseService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/certificados")
public class CertificadoController {
  private final CertificadoRepository certificados;
  private final MascotaRepository mascotas;
  private final UsuarioRepository usuarios;
  private final SseService sse;

  public CertificadoController(CertificadoRepository c, MascotaRepository m, UsuarioRepository u, SseService sse) {
    this.certificados = c;
    this.mascotas = m;
    this.usuarios = u;
    this.sse = sse;
  }

  @GetMapping
  public ResponseEntity<?> list(@RequestParam(required = false) String pet, Authentication auth) {
    var userId = UUID.fromString((String) auth.getPrincipal());
    var user = usuarios.findById(userId).orElseThrow();
    List<Certificado> res;
    if (pet != null) {
      var m = mascotas.findById(UUID.fromString(pet)).orElseThrow();
      res = certificados.findByPet(m);
    } else {
      res = certificados.findAll();
    }
    if (user.getRole() == Usuario.Rol.dueño)
      res = res.stream().filter(c -> c.getPet().getOwner().getId().equals(user.getId())).toList();
    return ResponseEntity.ok(Map.of("success", true, "data", res));
  }

  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @PostMapping
  public ResponseEntity<?> create(@Validated @RequestBody CreateCertificado req, Authentication auth) {
    var vetId = UUID.fromString((String) auth.getPrincipal());
    var vet = usuarios.findById(vetId).orElseThrow();
    var m = mascotas.findById(UUID.fromString(req.getPetId())).orElseThrow();
    var c = new Certificado();
    c.setPet(m);
    c.setVeterinarian(vet);
    c.setType(req.getType());
    c.setDescription(req.getDescription());
    c.setIssuedDate(LocalDate.parse(req.getIssuedDate()));
    c.setStatus(Certificado.Estado.vigente);
    var saved = certificados.save(c);
    sse.publish("certificados:created",
        Map.of("id", saved.getId().toString(), "petId", saved.getPet().getId().toString()));
    return ResponseEntity.status(201).body(Map.of("success", true, "data", saved));
  }

  @Data
  static class CreateCertificado {
    @NotNull
    private String petId;
    @NotBlank
    private String type;
    @NotBlank
    @Size(min = 5, max = 500)
    private String description;
    @NotBlank
    private String issuedDate;
  }
}
