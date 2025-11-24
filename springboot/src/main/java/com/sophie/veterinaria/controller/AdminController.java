package com.sophie.veterinaria.controller;

import com.sophie.veterinaria.entity.Usuario;
import com.sophie.veterinaria.repository.UsuarioRepository;
import com.sophie.veterinaria.repository.AuditLogRepository;
import com.sophie.veterinaria.service.BackupService;
import com.sophie.veterinaria.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@org.springframework.security.access.prepost.PreAuthorize("hasRole('admin')")
@RequestMapping("/api/admin")
public class AdminController {
  private final UsuarioRepository usuarios;
  private final AuditService audit;
  private final AuditLogRepository auditRepo;
  private final BackupService backup;

  public AdminController(UsuarioRepository u, AuditService a, AuditLogRepository ar, BackupService b) {
    this.usuarios = u;
    this.audit = a;
    this.auditRepo = ar;
    this.backup = b;
  }

  @GetMapping("/ping")
  public ResponseEntity<?> ping(org.springframework.security.core.Authentication auth){
    var authorities = auth==null? java.util.List.of() : auth.getAuthorities().stream().map(a->a.getAuthority()).toList();
    return ResponseEntity.ok(java.util.Map.of("success",true,"actor", auth==null? null : auth.getPrincipal(), "authorities", authorities));
  }


  @GetMapping("/usuarios/search")
  public ResponseEntity<?> searchUsers(@RequestParam("q") String q) {
    var qq = q == null ? "" : q.trim().toLowerCase();
    var data = usuarios.findAll().stream().filter(u -> u.getEmail().toLowerCase().contains(qq) ||
        u.getFirstName().toLowerCase().contains(qq) ||
        u.getLastName().toLowerCase().contains(qq)).map(u -> java.util.Map.of(
            "id", u.getId().toString(),
            "email", u.getEmail(),
            "firstName", u.getFirstName(),
            "lastName", u.getLastName(),
            "role", u.getRole().name()))
        .toList();
    return ResponseEntity.ok(java.util.Map.of("success", true, "data", data));
  }

  @DeleteMapping("/usuarios/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable String id, org.springframework.security.core.Authentication auth) {
    var actorId = java.util.UUID.fromString((String) auth.getPrincipal());
    var uid = java.util.UUID.fromString(id);
    var user = usuarios.findById(uid).orElse(null);
    if (user == null)
      return ResponseEntity.status(404).body(java.util.Map.of("error", "Usuario no encontrado"));
    if (actorId.equals(uid))
      return ResponseEntity.status(400).body(java.util.Map.of("error", "No puedes eliminar tu propia cuenta"));
    usuarios.deleteById(uid);
    return ResponseEntity.ok(java.util.Map.of("success", true));
  }

  // El administrador no crea usuarios; solo aprueba/rechaza roles
  @PatchMapping("/usuarios/{id}/rol")
  public ResponseEntity<?> assignRole(@PathVariable String id, @RequestBody java.util.Map<String, String> body) {
    var user = usuarios.findById(java.util.UUID.fromString(id)).orElse(null);
    if (user == null)
      return ResponseEntity.status(404).body(java.util.Map.of("error", "Usuario no encontrado"));
    try {
      var nuevoRol = Usuario.Rol.valueOf(body.getOrDefault("role", "dueño"));
      user.setRole(nuevoRol);
      usuarios.save(user);
      return ResponseEntity
          .ok(java.util.Map.of("success", true, "usuarioId", user.getId(), "role", user.getRole().name()));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(java.util.Map.of("error", "Rol inválido"));
    }
  }

  @GetMapping("/audit")
  public ResponseEntity<?> auditLogs() {
    var list = auditRepo.findAll();
    list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
    if (list.size() > 100)
      list = list.subList(0, 100);
    return ResponseEntity.ok(java.util.Map.of("success", true, "data", list));
  }

  @PostMapping("/backup/run")
  public ResponseEntity<?> runBackup() {
    var res = backup.runBackup();
    return ResponseEntity.ok(res);
  }

  // Gestión de roles solicitados no implementada en el modelo actual

  // Aprobación de rol no implementada en el modelo actual

  // Rechazo de rol no implementado en el modelo actual
}
