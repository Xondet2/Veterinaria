package com.sophie.veterinaria.service;
import com.sophie.veterinaria.entity.Usuario;
import com.sophie.veterinaria.repository.UsuarioRepository;
import com.sophie.veterinaria.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service public class AuthService {
  private final UsuarioRepository usuarios; private final PasswordEncoder encoder; private final JwtTokenProvider jwt;
  public AuthService(UsuarioRepository u, PasswordEncoder e, JwtTokenProvider j){ this.usuarios=u; this.encoder=e; this.jwt=j; }
  public String login(String email, String password){ var user=usuarios.findByEmailIgnoreCase(email).orElse(null); if (user==null) return null; if (!encoder.matches(password, user.getPasswordHash())) return null; return jwt.create(user.getId().toString(), user.getEmail(), user.getRole().name()); }
  public Usuario register(Usuario u){ u.setPasswordHash(encoder.encode(u.getPasswordHash())); return usuarios.save(u); }
}
