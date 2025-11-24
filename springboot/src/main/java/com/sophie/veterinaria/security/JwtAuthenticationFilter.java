package com.sophie.veterinaria.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtTokenProvider jwt;
  public JwtAuthenticationFilter(JwtTokenProvider jwt){ this.jwt=jwt; }

  @Override
  protected void doFilterInternal(HttpServletRequest r, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
    String h=r.getHeader("Authorization");
    if (StringUtils.hasText(h) && h.startsWith("Bearer ")) {
      String token=h.substring(7);
      try {
        Claims c=jwt.parse(token).getBody();
        String id=c.getSubject();
        String role=(String)c.get("role");
        Authentication auth=new UsernamePasswordAuthenticationToken(id, null, List.of(new SimpleGrantedAuthority("ROLE_"+role)));
        System.out.println("JWT parsed: id="+id+" role="+role+" authorities="+auth.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
      } catch(Exception ignored){}
    }
    chain.doFilter(r,res);
  }
}
