package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.service.AuthService; import org.springframework.http.ResponseEntity; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import org.springframework.security.access.prepost.PreAuthorize; import jakarta.validation.constraints.*; import lombok.Data;
@RestController @RequestMapping("/api/auth") public class AuthController {
  private final AuthService auth; public AuthController(AuthService a){ this.auth=a; }
  @PostMapping("/login") public ResponseEntity<?> login(@Validated @RequestBody LoginRequest req){
    var token=auth.login(req.getEmail(), req.getContraseña()); if (token==null) return ResponseEntity.status(401).body(java.util.Map.of("error","Email o contraseña incorrectos"));
    var usuario=java.util.Map.of("email",req.getEmail()); return ResponseEntity.ok(java.util.Map.of("success",true,"token",token,"usuario",usuario));
  }
  @PreAuthorize("hasRole('admin')")
  @PostMapping("/register") public ResponseEntity<?> register(@Validated @RequestBody RegisterRequest req){
    var u=new Usuario(); u.setEmail(req.getEmail()); u.setNombre(req.getNombre()); u.setApellido(req.getApellido()); u.setContraseñaHash(req.getContraseña()); u.setTelefono(req.getTelefono()); u.setRol(Usuario.Rol.valueOf(req.getRol())); u.setEstado(Usuario.Estado.activo);
    var saved=auth.register(u); return ResponseEntity.status(201).body(java.util.Map.of("success",true,"usuarioId",saved.getId()));
  }
  @Data static class LoginRequest { @Email @Size(max=255) private String email; @NotBlank @Size(min=6) private String contraseña; }
  @Data static class RegisterRequest { @Email @Size(max=255) private String email; @NotBlank @Size(min=2,max=100) private String nombre; @NotBlank @Size(min=2,max=100) private String apellido; @NotBlank @Size(min=8) private String contraseña; @Size(max=20) private String telefono; @NotNull private String rol; }
}
