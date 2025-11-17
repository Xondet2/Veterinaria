package com.sophie.veterinaria.config;
import com.sophie.veterinaria.entity.Usuario; import com.sophie.veterinaria.repository.UsuarioRepository; import org.springframework.boot.CommandLineRunner; import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration; import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration public class DataLoader {
  @Bean CommandLineRunner seed(UsuarioRepository usuarios, PasswordEncoder encoder){
    return args -> {
      if (usuarios.findByEmailIgnoreCase("admin@clinic.com").isEmpty()){
        var admin=new Usuario(); admin.setEmail("admin@clinic.com"); admin.setNombre("Carlos"); admin.setApellido("García"); admin.setContraseñaHash(encoder.encode("demo123")); admin.setRol(Usuario.Rol.admin); admin.setEstado(Usuario.Estado.activo); usuarios.save(admin);
        var vet=new Usuario(); vet.setEmail("vet@clinic.com"); vet.setNombre("Ana"); vet.setApellido("López"); vet.setContraseñaHash(encoder.encode("demo123")); vet.setRol(Usuario.Rol.veterinario); vet.setEspecialidad("Pequeños animales"); vet.setEstado(Usuario.Estado.activo); usuarios.save(vet);
        var owner=new Usuario(); owner.setEmail("owner@example.com"); owner.setNombre("Juan"); owner.setApellido("Pérez"); owner.setContraseñaHash(encoder.encode("demo123")); owner.setRol(Usuario.Rol.dueño); owner.setEstado(Usuario.Estado.activo); usuarios.save(owner);
      }
    };
  }
}
