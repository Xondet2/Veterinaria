package com.sophie.veterinaria.service;
import com.sophie.veterinaria.entity.Cita;
import com.sophie.veterinaria.repository.CitaRepository;
import com.sophie.veterinaria.repository.MascotaRepository;
import com.sophie.veterinaria.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;
import java.util.UUID;
@Service public class CitaService {
  private final CitaRepository citas; private final UsuarioRepository usuarios; private final MascotaRepository mascotas;
  public CitaService(CitaRepository c, UsuarioRepository u, MascotaRepository m){ this.citas=c; this.usuarios=u; this.mascotas=m; }
  public boolean hasConflict(UUID vetId, OffsetDateTime inicio, int durMin){
    var v=usuarios.findById(vetId).orElseThrow(); var fin=inicio.plusMinutes(durMin);
    for (var c: citas.findByVeterinarian(v)){ var ci=c.getStartDateTime(); var cf=ci.plusMinutes(c.getDurationMinutes()); if (ci.isBefore(fin) && cf.isAfter(inicio) && c.getStatus()!= Cita.Estado.cancelada) return true; }
    return false;
  }
  public Cita create(UUID petId, UUID vetId, UUID ownerId, OffsetDateTime inicio, int durMin, String motivo){
    var m=mascotas.findById(petId).orElseThrow(); var v=usuarios.findById(vetId).orElseThrow(); var d=usuarios.findById(ownerId).orElseThrow();
    var c=new Cita(); c.setPet(m); c.setVeterinarian(v); c.setOwner(d); c.setStartDateTime(inicio); c.setDurationMinutes(durMin); c.setReason(motivo); c.setStatus(Cita.Estado.agendada);
    return citas.save(c);
  }
}
