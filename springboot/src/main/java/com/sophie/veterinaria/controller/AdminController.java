package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.Usuario;
import com.sophie.veterinaria.repository.UsuarioRepository;
import com.sophie.veterinaria.repository.MascotaRepository;
import com.sophie.veterinaria.repository.CitaRepository;
 
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final UsuarioRepository usuarios; private final MascotaRepository mascotas; private final CitaRepository citas;
  public AdminController(UsuarioRepository u, MascotaRepository m, CitaRepository c){ this.usuarios=u; this.mascotas=m; this.citas=c; }

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
  @GetMapping("/usuarios/search")
  public ResponseEntity<?> searchUsers(@RequestParam("q") String q){
    var qq = q==null? "" : q.trim().toLowerCase();
    var data = usuarios.findAll().stream().filter(u ->
      u.getEmail().toLowerCase().contains(qq) ||
      u.getNombre().toLowerCase().contains(qq) ||
      u.getApellido().toLowerCase().contains(qq)
    ).map(u -> java.util.Map.of(
      "id", u.getId().toString(),
      "email", u.getEmail(),
      "nombre", u.getNombre(),
      "apellido", u.getApellido(),
      "rol", u.getRol().name()
    )).toList();
    return ResponseEntity.ok(java.util.Map.of("success",true,"data",data));
  }

  @PreAuthorize("hasRole('admin')")
  @org.springframework.transaction.annotation.Transactional
  @DeleteMapping("/usuarios/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable String id, org.springframework.security.core.Authentication auth){
    var actorId = java.util.UUID.fromString((String)auth.getPrincipal());
    var uid = java.util.UUID.fromString(id);
    var user = usuarios.findById(uid).orElse(null);
    if (user==null) return ResponseEntity.status(404).body(java.util.Map.of("error","Usuario no encontrado"));
    if (actorId.equals(uid)) return ResponseEntity.status(400).body(java.util.Map.of("error","No puedes eliminar tu propia cuenta"));
    var tieneMascotas = !mascotas.findByDueñoAndEstado(user, com.sophie.veterinaria.entity.Mascota.Estado.activo).isEmpty();
    var tieneCitasComoDueño = !citas.findByDueñoOrderByFechaHoraInicioDesc(user).isEmpty();
    var tieneCitasComoVet = !citas.findByVeterinario(user).isEmpty();
    if (tieneMascotas || tieneCitasComoDueño || tieneCitasComoVet) {
      return ResponseEntity.status(409).body(java.util.Map.of("error","El usuario tiene registros asociados (mascotas/citas)"));
    }
    usuarios.deleteById(uid);
    return ResponseEntity.ok(java.util.Map.of("success",true));
  }

  // El administrador no crea usuarios; solo aprueba/rechaza roles
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