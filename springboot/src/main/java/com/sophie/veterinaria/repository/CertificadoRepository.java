package com.sophie.veterinaria.repository;
import com.sophie.veterinaria.entity.Certificado; import com.sophie.veterinaria.entity.Mascota; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*; import java.util.UUID;
public interface CertificadoRepository extends JpaRepository<Certificado, UUID> { List<Certificado> findByPet(Mascota pet); }