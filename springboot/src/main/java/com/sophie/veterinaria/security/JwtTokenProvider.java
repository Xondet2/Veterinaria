package com.sophie.veterinaria.security;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Component; import java.security.Key; import java.util.Date;
@Component public class JwtTokenProvider {
  private final Key key; private final long expirationMs;
  public JwtTokenProvider(@Value("${jwt.secret}") String secret, @Value("${jwt.expirationSeconds}") long expSec){ this.key=Keys.hmacShaKeyFor(secret.getBytes()); this.expirationMs=expSec*1000; }
  public String create(String id, String email, String rol){ long now=System.currentTimeMillis(); return Jwts.builder().setSubject(id).claim("email",email).claim("rol",rol).setIssuedAt(new Date(now)).setExpiration(new Date(now+expirationMs)).signWith(key, SignatureAlgorithm.HS256).compact(); }
  public Jws<Claims> parse(String token){ return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token); }
}
