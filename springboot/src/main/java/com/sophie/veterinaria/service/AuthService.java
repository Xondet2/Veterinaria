package com.sophie.veterinaria.service;
import com.sophie.veterinaria.entity.Usuario;
import com.sophie.veterinaria.repository.UsuarioRepository;
import com.sophie.veterinaria.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service public class AuthService {
  private final UsuarioRepository usuarios; private final PasswordEncoder encoder; private final JwtTokenProvider jwt;
  public AuthService(UsuarioRepository u, PasswordEncoder e, JwtTokenProvider j){ this.usuarios=u; this.encoder=e; this.jwt=j; }
  public String login(String email, String contraseña){ var user=usuarios.findByEmailIgnoreCase(email).orElse(null); if (user==null) return null; if (!encoder.matches(contraseña, user.getContraseñaHash())) return null; return jwt.create(user.getId().toString(), user.getEmail(), user.getRol().name()); }
  public Usuario register(Usuario u){ u.setContraseñaHash(encoder.encode(u.getContraseñaHash())); return usuarios.save(u); }
}
