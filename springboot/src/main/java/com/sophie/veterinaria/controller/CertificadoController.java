package com.sophie.veterinaria.controller;
import com.sophie.veterinaria.entity.*; import com.sophie.veterinaria.repository.*; import org.springframework.http.ResponseEntity; import org.springframework.validation.annotation.Validated; import org.springframework.web.bind.annotation.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import jakarta.validation.constraints.*; import lombok.Data; import java.time.LocalDate; import java.util.*; import java.util.UUID;
@RestController @RequestMapping("/api/certificados") public class CertificadoController {
  private final CertificadoRepository certificados; private final MascotaRepository mascotas; private final UsuarioRepository usuarios;
  public CertificadoController(CertificadoRepository c, MascotaRepository m, UsuarioRepository u){ this.certificados=c; this.mascotas=m; this.usuarios=u; }
  @GetMapping public ResponseEntity<?> list(@RequestParam(required=false) String mascota, Authentication auth){
    var userId=UUID.fromString((String)auth.getPrincipal()); var user=usuarios.findById(userId).orElseThrow(); List<Certificado> res;
    if (mascota!=null){ var m=mascotas.findById(UUID.fromString(mascota)).orElseThrow(); res=certificados.findByMascota(m);
    } else { res=certificados.findAll(); }
    if (user.getRol()== Usuario.Rol.dueño) res=res.stream().filter(c->c.getMascota().getDueño().getId().equals(user.getId())).toList();
    return ResponseEntity.ok(Map.of("success",true,"data",res));
  }
  @PreAuthorize("hasAnyRole('admin','veterinario')")
  @PostMapping public ResponseEntity<?> create(@Validated @RequestBody CreateCertificado req, Authentication auth){
    var vetId=UUID.fromString((String)auth.getPrincipal()); var vet=usuarios.findById(vetId).orElseThrow(); var m=mascotas.findById(UUID.fromString(req.getMascotaId())).orElseThrow();
    var c=new Certificado(); c.setMascota(m); c.setVeterinario(vet); c.setTipo(req.getTipo()); c.setDescripcion(req.getDescripcion()); c.setFechaEmision(LocalDate.parse(req.getFechaEmision())); c.setEstado(Certificado.Estado.vigente);
    var saved=certificados.save(c); return ResponseEntity.status(201).body(Map.of("success",true,"data",saved));
  }
  @Data static class CreateCertificado { @NotNull private String mascotaId; @NotBlank private String tipo; @NotBlank @Size(min=5,max=500) private String descripcion; @NotBlank private String fechaEmision; }
}