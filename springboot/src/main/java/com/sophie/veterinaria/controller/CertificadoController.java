package com.sophie.veterinaria.controller;

import com.sophie.veterinaria.entity.*;
import com.sophie.veterinaria.repository.*;
import com.sophie.veterinaria.service.SseService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
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
    List<Certificado> res;
    if (pet != null) {
      UUID petId;
      try { petId = UUID.fromString(pet); } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error","ID de mascota inválido")); }
      var m = mascotas.findById(petId).orElse(null);
      if (m == null) return ResponseEntity.status(404).body(Map.of("error","Mascota no encontrada"));
      res = certificados.findByPet(m);
    } else {
      res = certificados.findAll();
    }
    if (auth != null && auth.getPrincipal() != null) {
      var userId = UUID.fromString((String) auth.getPrincipal());
      var user = usuarios.findById(userId).orElse(null);
      if (user != null && user.getRole() == Usuario.Rol.dueño)
        res = res.stream().filter(c -> c.getPet() != null && c.getPet().getOwner() != null && c.getPet().getOwner().getId().equals(user.getId())).toList();
    }
    var data = res.stream().map(c -> Map.of(
      "id", c.getId().toString(),
      "tipo", c.getType(),
      "descripcion", c.getDescription(),
      "fechaEmision", c.getIssuedDate().toString(),
      "mascota", Map.of("id", c.getPet().getId().toString(), "nombre", c.getPet().getName())
    )).toList();
    return ResponseEntity.ok(Map.of("success", true, "data", data));
  }

  @PostMapping
  public ResponseEntity<?> create(@Validated @RequestBody CreateCertificado req) {
    UUID vetId;
    try { vetId = UUID.fromString(req.getVetId()); } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error","ID de veterinario inválido")); }
    var vet = usuarios.findById(vetId).orElse(null);
    if (vet == null) return ResponseEntity.status(404).body(Map.of("error","Veterinario no encontrado"));
    if (vet.getRole()!= Usuario.Rol.admin && vet.getRole()!= Usuario.Rol.veterinario)
      return ResponseEntity.status(403).body(Map.of("error","Solo admin/veterinario pueden crear certificados"));
    UUID petId;
    try { petId = UUID.fromString(req.getPetId()); } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error","ID de mascota inválido")); }
    var m = mascotas.findById(petId).orElse(null);
    if (m == null) return ResponseEntity.status(404).body(Map.of("error","Mascota no encontrada"));
    var c = new Certificado();
    c.setPet(m);
    c.setVeterinarian(vet);
    c.setType(req.getType());
    c.setDescription(req.getDescription());
    LocalDate issued;
    try { issued = LocalDate.parse(req.getIssuedDate()); }
    catch (Exception ex) {
      try { var fmt = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"); issued = LocalDate.parse(req.getIssuedDate(), fmt); }
      catch (Exception ex2) { return ResponseEntity.badRequest().body(Map.of("error","Fecha de emisión inválida")); }
    }
    c.setIssuedDate(issued);
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
    @NotNull
    private String vetId;
  }
}
