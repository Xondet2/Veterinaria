package com.sophie.veterinaria.config;

import com.sophie.veterinaria.entity.Usuario;
import com.sophie.veterinaria.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {
  @Bean
  CommandLineRunner seed(UsuarioRepository usuarios, PasswordEncoder encoder) {
    return args -> {
      if (usuarios.findByEmailIgnoreCase("admin@clinic.com").isEmpty()) {
        var admin = new Usuario();
        admin.setEmail("admin@clinic.com");
        admin.setUsername("admin");
        admin.setFirstName("Carlos");
        admin.setLastName("García");
        admin.setPasswordHash(encoder.encode("demo123"));
        admin.setRole(Usuario.Rol.admin);
        admin.setStatus(Usuario.Estado.activo);
        usuarios.save(admin);

        var vet = new Usuario();
        vet.setEmail("vet@clinic.com");
        vet.setUsername("vet");
        vet.setFirstName("Ana");
        vet.setLastName("López");
        vet.setPasswordHash(encoder.encode("demo123"));
        vet.setRole(Usuario.Rol.veterinario);
        vet.setSpecialty("Pequeños animales");
        vet.setStatus(Usuario.Estado.activo);
        usuarios.save(vet);

        var owner = new Usuario();
        owner.setEmail("owner@example.com");
        owner.setUsername("owner");
        owner.setFirstName("Juan");
        owner.setLastName("Pérez");
        owner.setPasswordHash(encoder.encode("demo123"));
        owner.setRole(Usuario.Rol.dueño);
        owner.setStatus(Usuario.Estado.activo);
        usuarios.save(owner);
      }
    };
  }
}
