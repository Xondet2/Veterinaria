package com.sophie.veterinaria.service;
import com.sophie.veterinaria.entity.*; import com.sophie.veterinaria.repository.*; import org.springframework.stereotype.Service; import java.time.LocalDate; import java.util.UUID;
@Service public class MascotaService {
  private final MascotaRepository mascotas; private final UsuarioRepository usuarios;
  public MascotaService(MascotaRepository m, UsuarioRepository u){ this.mascotas=m; this.usuarios=u; }
  public Mascota crear(UUID dueñoId, String nombre, String especie, String raza, Integer edad, Double peso, String sexo, String microchip, String fecha){
    var dueño=usuarios.findById(dueñoId).orElseThrow();
    var m=new Mascota(); m.setDueño(dueño); m.setNombre(nombre); m.setEspecie(Mascota.Especie.valueOf(especie)); m.setRaza(raza);
    m.setEdadAños(edad); m.setPesoKg(peso); m.setSexo(Mascota.Sexo.valueOf(sexo)); m.setMicrochip(microchip); m.setFechaNacimiento(LocalDate.parse(fecha)); m.setEstado(Mascota.Estado.activo);
    return mascotas.save(m);
  }
}
