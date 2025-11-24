package com.sophie.veterinaria.repository;

import com.sophie.veterinaria.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
  Optional<Usuario> findByEmailIgnoreCase(String email);
  Optional<Usuario> findByUsernameIgnoreCase(String username);
  boolean existsByUsernameIgnoreCase(String username);
}
