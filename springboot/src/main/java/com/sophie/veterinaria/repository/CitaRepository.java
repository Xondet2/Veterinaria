package com.sophie.veterinaria.repository;

import com.sophie.veterinaria.entity.Cita;
import com.sophie.veterinaria.entity.Usuario;
import com.sophie.veterinaria.entity.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CitaRepository extends JpaRepository<Cita, UUID> {
  List<Cita> findByVeterinarian(Usuario v);
  List<Cita> findByOwnerOrderByStartDateTimeDesc(Usuario owner);
  List<Cita> findByPet(Mascota m);
}
