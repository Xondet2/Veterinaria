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
  public boolean hayConflicto(UUID vetId, OffsetDateTime inicio, int durMin){
    var v=usuarios.findById(vetId).orElseThrow(); var fin=inicio.plusMinutes(durMin);
    for (var c: citas.findByVeterinario(v)){ var ci=c.getFechaHoraInicio(); var cf=ci.plusMinutes(c.getDuracionMinutos()); if (ci.isBefore(fin) && cf.isAfter(inicio) && c.getEstado()!= Cita.Estado.cancelada) return true; }
    return false;
  }
  public Cita crear(UUID mascotaId, UUID vetId, UUID dueñoId, OffsetDateTime inicio, int durMin, String motivo){
    var m=mascotas.findById(mascotaId).orElseThrow(); var v=usuarios.findById(vetId).orElseThrow(); var d=usuarios.findById(dueñoId).orElseThrow();
    var c=new Cita(); c.setMascota(m); c.setVeterinario(v); c.setDueño(d); c.setFechaHoraInicio(inicio); c.setDuracionMinutos(durMin); c.setMotivo(motivo); c.setEstado(Cita.Estado.agendada);
    return citas.save(c);
  }
}
