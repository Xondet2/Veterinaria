package com.sophie.veterinaria.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
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
  public SecurityFilterChain filterChain(HttpSecurity http, JwtTokenProvider jwt) throws Exception {
    http.csrf(csrf->csrf.disable()).cors(c->c.configurationSource(corsSource))
      .sessionManagement(sm->sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth->auth.requestMatchers("/api/auth/login","/api/health").permitAll().anyRequest().authenticated())
      .addFilterBefore(new JwtAuthenticationFilter(jwt), BasicAuthenticationFilter.class);
    return http.build();
  }
}
