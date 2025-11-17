package com.sophie.veterinaria.repository;
import com.sophie.veterinaria.entity.Vacuna; import com.sophie.veterinaria.entity.Mascota; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*; import java.util.UUID;
public interface VacunaRepository extends JpaRepository<Vacuna, UUID> { List<Vacuna> findByMascotaOrderByFechaAplicacionDesc(Mascota mascota); }