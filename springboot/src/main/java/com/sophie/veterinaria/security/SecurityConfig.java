package com.sophie.veterinaria.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.beans.factory.annotation.Qualifier;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
  private final CorsConfigurationSource corsSource;
  public SecurityConfig(@Qualifier("corsConfigurationSource") CorsConfigurationSource corsSource){ this.corsSource=corsSource; }

  @Bean
  public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception { return cfg.getAuthenticationManager(); }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http, JwtTokenProvider jwt, com.sophie.veterinaria.service.AuditService audit) throws Exception {
    http.csrf(csrf->csrf.disable()).cors(c->c.configurationSource(corsSource))
      .sessionManagement(sm->sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth->auth
        .requestMatchers("/api/auth/login","/api/auth/register","/api/health","/api/usuarios/check-username").permitAll()
        .requestMatchers("/api/sync/stream").permitAll()
        .requestMatchers("/api/admin/**").hasRole("admin")
        .requestMatchers("/api/mascotas/**","/api/citas/**","/api/vacunas/**","/api/certificados/**","/api/historial/**").authenticated()
        .anyRequest().authenticated())
      .addFilterBefore(new JwtAuthenticationFilter(jwt), BasicAuthenticationFilter.class)
      .addFilterAfter(new AuditLoggingFilter(audit), JwtAuthenticationFilter.class);
    return http.build();
  }
}
