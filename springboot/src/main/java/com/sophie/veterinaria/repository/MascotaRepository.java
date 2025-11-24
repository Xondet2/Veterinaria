package com.sophie.veterinaria.repository;

import com.sophie.veterinaria.entity.Mascota;
import com.sophie.veterinaria.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MascotaRepository extends JpaRepository<Mascota, UUID> {
  List<Mascota> findByOwnerAndStatus(Usuario owner, Mascota.Estado estado);
  List<Mascota> findByOwner(Usuario owner);
  boolean existsByOwnerAndNameIgnoreCase(Usuario owner, String name);
}
