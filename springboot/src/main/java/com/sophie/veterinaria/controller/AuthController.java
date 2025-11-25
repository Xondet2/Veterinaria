package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.service.AuthService; import com.sophie.veterinaria.service.SseService; import org.springframework.http.ResponseEntity; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import org.springframework.security.access.prepost.PreAuthorize; import jakarta.validation.constraints.*; import lombok.Data;
@RestController @RequestMapping("/api/auth") public class AuthController {
  private final AuthService auth; private final SseService sse; private final com.sophie.veterinaria.service.LoginAttemptService attempts;
  public AuthController(AuthService a, SseService s, com.sophie.veterinaria.service.LoginAttemptService la){ this.auth=a; this.sse=s; this.attempts=la; }
  @PostMapping("/login") public ResponseEntity<?> login(@Validated @RequestBody LoginRequest req){
    var key = req.getEmail().toLowerCase();
    if (attempts.isLocked(key)) {
      long ms = attempts.lockedRemainingMs(key);
      return ResponseEntity.status(429).body(java.util.Map.of("error","Cuenta bloqueada temporalmente","retryAfterMs", ms));
    }
    var user=auth.login(req.getEmail(), req.getPassword());
    if (user==null) { attempts.recordFailure(key); return ResponseEntity.status(401).body(java.util.Map.of("error","Credenciales incorrectas")); }
    attempts.recordSuccess(key);
    var usuario=java.util.Map.of(
      "id", user.getId().toString(),
      "email", user.getEmail(),
      "rol", user.getRole().name(),
      "nombre", user.getFirstName(),
      "apellido", user.getLastName()
    );
    return ResponseEntity.ok(java.util.Map.of("success",true,"usuario",usuario));
  }
  @PostMapping("/register") public ResponseEntity<?> register(@Validated @RequestBody RegisterRequest req){
    var u=new Usuario(); u.setEmail(req.getEmail()); u.setUsername(req.getUsername()); u.setFirstName(req.getFirstName()); u.setLastName(req.getLastName()); u.setPasswordHash(req.getPassword()); u.setPhone(req.getPhone());
    u.setRole(Usuario.Rol.dueño);
    if (req.getRole()!=null) u.setRequestedRole(Usuario.Rol.valueOf(req.getRole()));
    u.setStatus(Usuario.Estado.activo);
    var saved=auth.register(u); sse.publish("usuarios:created", java.util.Map.of("id", saved.getId().toString(), "email", saved.getEmail(), "username", saved.getUsername(), "role", saved.getRole().name(), "requestedRole", saved.getRequestedRole()==null? null : saved.getRequestedRole().name())); return ResponseEntity.status(201).body(java.util.Map.of("success",true,"usuarioId",saved.getId()));
  }
  @GetMapping("/me") public ResponseEntity<?> me(){
    return ResponseEntity.ok(java.util.Map.of("authenticated",false));
  }
  @Data static class LoginRequest { @Email @Size(max=255) private String email; @NotBlank @Size(min=1, max=64) private String password; }
  @Data static class RegisterRequest { @Email @Size(max=255) private String email; @NotBlank @Size(min=4,max=20) @Pattern(regexp="^[a-zA-Z0-9_\\-]+$") private String username; @NotBlank @Size(min=2,max=100) private String firstName; @NotBlank @Size(min=2,max=100) private String lastName; @NotBlank @Size(min=8) @Pattern(regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$") private String password; @Size(max=20) private String phone; @NotNull private String role; }
}
