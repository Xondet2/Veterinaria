package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.service.AuthService; import com.sophie.veterinaria.service.SseService; import org.springframework.http.ResponseEntity; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import org.springframework.security.access.prepost.PreAuthorize; import jakarta.validation.constraints.*; import lombok.Data;
@RestController @RequestMapping("/api/auth") public class AuthController {
  private final AuthService auth; private final SseService sse; public AuthController(AuthService a, SseService s){ this.auth=a; this.sse=s; }
  @PostMapping("/login") public ResponseEntity<?> login(@Validated @RequestBody LoginRequest req){
    var token=auth.login(req.getEmail(), req.getPassword()); if (token==null) return ResponseEntity.status(401).body(java.util.Map.of("error","Email o contraseña incorrectos"));
    var usuario=java.util.Map.of("email",req.getEmail()); return ResponseEntity.ok(java.util.Map.of("success",true,"token",token,"usuario",usuario));
  }
  @PostMapping("/register") public ResponseEntity<?> register(@Validated @RequestBody RegisterRequest req){
    var u=new Usuario(); u.setEmail(req.getEmail()); u.setUsername(req.getUsername()); u.setFirstName(req.getFirstName()); u.setLastName(req.getLastName()); u.setPasswordHash(req.getPassword()); u.setPhone(req.getPhone());
    u.setRole(Usuario.Rol.dueño);
    if (req.getRole()!=null) u.setRequestedRole(Usuario.Rol.valueOf(req.getRole()));
    u.setStatus(Usuario.Estado.activo);
    var saved=auth.register(u); sse.publish("usuarios:created", java.util.Map.of("id", saved.getId().toString(), "email", saved.getEmail(), "username", saved.getUsername(), "role", saved.getRole().name(), "requestedRole", saved.getRequestedRole()==null? null : saved.getRequestedRole().name())); return ResponseEntity.status(201).body(java.util.Map.of("success",true,"usuarioId",saved.getId()));
  }
  @GetMapping("/me") public ResponseEntity<?> me(org.springframework.security.core.Authentication auth){
    if (auth==null) return ResponseEntity.ok(java.util.Map.of("authenticated",false));
    var authorities = auth.getAuthorities().stream().map(a->a.getAuthority()).toList();
    return ResponseEntity.ok(java.util.Map.of("authenticated",true,"principal",auth.getPrincipal(),"authorities",authorities));
  }
  @Data static class LoginRequest { @Email @Size(max=255) private String email; @NotBlank @Size(min=6) private String password; }
  @Data static class RegisterRequest { @Email @Size(max=255) private String email; @NotBlank @Size(min=4,max=20) @Pattern(regexp="^[a-zA-Z0-9_\\-]+$") private String username; @NotBlank @Size(min=2,max=100) private String firstName; @NotBlank @Size(min=2,max=100) private String lastName; @NotBlank @Size(min=8) private String password; @Size(max=20) private String phone; @NotNull private String role; }
}
