package com.sophie.veterinaria.service;

import com.sophie.veterinaria.entity.Mascota;
import com.sophie.veterinaria.repository.MascotaRepository;
import com.sophie.veterinaria.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class MascotaService {
  private final MascotaRepository mascotas;
  private final UsuarioRepository usuarios;

  public MascotaService(MascotaRepository m, UsuarioRepository u) {
    this.mascotas = m;
    this.usuarios = u;
  }

  public Mascota create(
      UUID ownerId,
      String name,
      String species,
      String breed,
      Integer ageYears,
      Double weightKg,
      String sex,
      String microchip,
      String birthDate
  ) {
    var owner = usuarios.findById(ownerId).orElseThrow();
    var m = new Mascota();
    m.setOwner(owner);
    m.setName(name);
    m.setSpecies(Mascota.Especie.valueOf(species.trim().toLowerCase()));
    m.setBreed(breed);
    m.setAgeYears(ageYears);
    m.setWeightKg(weightKg);
    m.setSex(Mascota.Sexo.valueOf(sex.trim().toLowerCase()));
    m.setMicrochip(microchip);
    try {
      m.setBirthDate(LocalDate.parse(birthDate));
    } catch (java.time.format.DateTimeParseException ex) {
      var fmt = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
      m.setBirthDate(LocalDate.parse(birthDate, fmt));
    }
    m.setStatus(Mascota.Estado.activo);
    return mascotas.save(m);
  }
}
