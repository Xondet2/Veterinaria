package com.sophie.veterinaria.repository;

import com.sophie.veterinaria.entity.Mascota;
import com.sophie.veterinaria.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MascotaRepository extends JpaRepository<Mascota, UUID> {
  List<Mascota> findByDueñoAndEstado(Usuario dueño, Mascota.Estado estado);
  List<Mascota> findByDueño(Usuario dueño);
  boolean existsByDueñoAndNombreIgnoreCase(Usuario dueño, String nombre);
}
