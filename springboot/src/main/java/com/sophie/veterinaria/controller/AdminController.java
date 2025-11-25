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
        u.getLastName().toLowerCase().contains(qq)).map(u -> {
          var m = new java.util.HashMap<String,Object>();
          m.put("id", u.getId().toString());
          m.put("email", u.getEmail());
          m.put("nombre", u.getFirstName());
          m.put("apellido", u.getLastName());
          m.put("rol", u.getRole().name());
          return m;
        })
        .toList();
    return ResponseEntity.ok(java.util.Map.of("success", true, "data", data));
  }

  @GetMapping("/usuarios/veterinarios")
  public ResponseEntity<?> listVeterinarios() {
    var data = usuarios.findAll().stream()
        .filter(u -> u.getRole() == Usuario.Rol.veterinario)
        .map(u -> java.util.Map.of(
            "id", u.getId().toString(),
            "nombre", u.getFirstName(),
            "apellido", u.getLastName()
        ))
        .toList();
    return ResponseEntity.ok(java.util.Map.of("success", true, "data", data));
  }

  @PreAuthorize("hasRole('admin')")
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
  public ResponseEntity<?> assignRole(
      @PathVariable String id,
      @RequestBody java.util.Map<String, String> body,
      @RequestParam(required=false, name="actorId") String actorIdParam,
      @RequestHeader(value="X-Actor-Id", required=false) String actorIdHeader,
      org.springframework.security.core.Authentication auth
  ) {
    java.util.UUID actorUuid = null;
    try { if (auth != null && auth.getPrincipal() != null) actorUuid = java.util.UUID.fromString((String) auth.getPrincipal()); } catch (Exception ignored) {}
    String actorStr = actorIdParam;
    if (actorStr == null || actorStr.isBlank()) actorStr = actorIdHeader;
    if (actorStr == null || actorStr.isBlank()) actorStr = body.getOrDefault("actorId", "");
    if ((actorUuid == null) && (actorStr != null && !actorStr.isBlank())) {
      try { actorUuid = java.util.UUID.fromString(actorStr); } catch (Exception e) { return ResponseEntity.badRequest().body(java.util.Map.of("error","ID de actor inválido")); }
    }
    if (actorUuid != null) {
      var actor = usuarios.findById(actorUuid).orElse(null);
      if (actor == null) return ResponseEntity.status(404).body(java.util.Map.of("error","Actor no encontrado"));
      if (actor.getRole() != Usuario.Rol.admin) return ResponseEntity.status(403).body(java.util.Map.of("error","Solo admin puede cambiar roles"));
    }

    var user = usuarios.findById(java.util.UUID.fromString(id)).orElse(null);
    if (user == null) return ResponseEntity.status(404).body(java.util.Map.of("error", "Usuario no encontrado"));
    try {
      var nuevoRol = Usuario.Rol.valueOf(body.getOrDefault("role", "dueño"));
      user.setRole(nuevoRol);
      usuarios.save(user);
      return ResponseEntity.ok(java.util.Map.of("success", true, "usuarioId", user.getId(), "role", user.getRole().name()));
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

  @PreAuthorize("hasRole('admin')")
  @PostMapping("/backup/run")
  public ResponseEntity<?> runBackup() {
    var res = backup.runBackup();
    return ResponseEntity.ok(res);
  }

  // Gestión de roles solicitados no implementada en el modelo actual

  // Aprobación de rol no implementada en el modelo actual

  // Rechazo de rol no implementado en el modelo actual
}
