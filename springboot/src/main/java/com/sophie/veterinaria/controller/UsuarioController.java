package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.repository.UsuarioRepository; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import org.springframework.security.core.Authentication;
@RestController @RequestMapping("/api/usuarios") public class UsuarioController {
  private final UsuarioRepository usuarios; public UsuarioController(UsuarioRepository u){ this.usuarios=u; }
  @GetMapping("/veterinarios") public ResponseEntity<?> veterinarios(Authentication auth){
    var list=usuarios.findAll().stream().filter(u->u.getRole()== Usuario.Rol.veterinario).map(u->java.util.Map.of(
      "id", u.getId().toString(), "firstName", u.getFirstName(), "lastName", u.getLastName()
    )).toList();
    return ResponseEntity.ok(java.util.Map.of("success",true,"data",list));
  }

  @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('admin','veterinario')")
  @GetMapping("/dueños") public ResponseEntity<?> dueños(Authentication auth){
    var list=usuarios.findAll().stream().filter(u->u.getRole()== Usuario.Rol.dueño).map(u->java.util.Map.of(
      "id", u.getId().toString(), "firstName", u.getFirstName(), "lastName", u.getLastName(), "email", u.getEmail()
    )).toList();
    return ResponseEntity.ok(java.util.Map.of("success",true,"data",list));
  }

  

  @GetMapping("/check-username")
  public ResponseEntity<?> checkUsername(@RequestParam("u") String username){
    boolean exists = usuarios.existsByUsernameIgnoreCase(username);
    return ResponseEntity.ok(java.util.Map.of("success",true, "available", !exists));
  }
}