package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Usuario;
import com.sophie.veterinaria.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final UsuarioRepository usuarios;
  public AdminController(UsuarioRepository u){ this.usuarios=u; }

  @PreAuthorize("hasRole('admin')")
  @GetMapping("/usuarios")
  public ResponseEntity<?> listUsers(){
    var data = usuarios.findAll().stream().map(u -> java.util.Map.of(
      "id", u.getId().toString(),
      "email", u.getEmail(),
      "nombre", u.getNombre(),
      "apellido", u.getApellido(),
      "rol", u.getRol().name()
    )).toList();
    return ResponseEntity.ok(java.util.Map.of("success",true,"data",data));
  }

  @PreAuthorize("hasRole('admin')")
  @PostMapping("/usuarios")
  public ResponseEntity<?> createUser(@RequestBody java.util.Map<String,Object> body){
    var u=new com.sophie.veterinaria.entity.Usuario();
    u.setEmail((String)body.getOrDefault("email",""));
    u.setNombre((String)body.getOrDefault("nombre",""));
    u.setApellido((String)body.getOrDefault("apellido",""));
    u.setContraseñaHash((String)body.getOrDefault("contraseña","demo123"));
    u.setTelefono((String)body.getOrDefault("telefono",""));
    try {
      var rolStr = (String)body.getOrDefault("rol","dueño");
      u.setRol(com.sophie.veterinaria.entity.Usuario.Rol.valueOf(rolStr));
    } catch(Exception e) {
      u.setRol(com.sophie.veterinaria.entity.Usuario.Rol.dueño);
    }
    u.setEstado(com.sophie.veterinaria.entity.Usuario.Estado.activo);
    var saved = usuarios.save(u);
    return ResponseEntity.status(201).body(java.util.Map.of("success",true,"usuarioId",saved.getId()));
  }

  @PreAuthorize("hasRole('admin')")
  @PatchMapping("/usuarios/{id}/rol")
  public ResponseEntity<?> assignRole(@PathVariable String id, @RequestBody java.util.Map<String,String> body){
    var user=usuarios.findById(java.util.UUID.fromString(id)).orElse(null);
    if (user==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Usuario no encontrado"));
    try {
      var nuevoRol = Usuario.Rol.valueOf(body.getOrDefault("rol","dueño"));
      user.setRol(nuevoRol);
      usuarios.save(user);
      return ResponseEntity.ok(java.util.Map.of("success",true,"usuarioId",user.getId(),"rol",user.getRol().name()));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(java.util.Map.of("error","Rol inválido"));
    }
  }
}