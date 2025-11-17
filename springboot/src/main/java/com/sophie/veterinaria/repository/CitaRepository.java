package com.sophie.veterinaria.repository;
import com.sophie.veterinaria.entity.Cita; import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.entity.Mascota; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*; import java.util.UUID;
public interface CitaRepository extends JpaRepository<Cita, UUID> {
  List<Cita> findByVeterinario(Usuario v);
  List<Cita> findByDueñoOrderByFechaHoraInicioDesc(Usuario dueño);
  List<Cita> findByMascota(Mascota m);
}
