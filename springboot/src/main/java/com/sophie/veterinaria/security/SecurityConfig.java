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
  public SecurityFilterChain filterChain(HttpSecurity http, com.sophie.veterinaria.service.AuditService audit) throws Exception {
    http.csrf(csrf->csrf.disable()).cors(c->c.configurationSource(corsSource))
      .sessionManagement(sm->sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth->auth
        .requestMatchers("/api/**", "/api/health", "/api/sync/**").permitAll()
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .anyRequest().permitAll())
      .exceptionHandling(eh -> eh
        .authenticationEntryPoint((req,res,ex) -> { res.setStatus(401); res.setContentType("application/json"); res.getWriter().write("{\"error\":\"unauthorized\"}"); })
        .accessDeniedHandler((req,res,ex) -> { res.setStatus(403); res.setContentType("application/json"); res.getWriter().write("{\"error\":\"forbidden\"}"); })
      )
      .addFilterAfter(new AuditLoggingFilter(audit), BasicAuthenticationFilter.class);
    return http.build();
  }
}
