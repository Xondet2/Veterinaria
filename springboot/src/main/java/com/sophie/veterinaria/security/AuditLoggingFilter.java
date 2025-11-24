package com.sophie.veterinaria.security;

import com.sophie.veterinaria.service.AuditService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuditLoggingFilter extends OncePerRequestFilter {
  private final AuditService audit;

  public AuditLoggingFilter(AuditService audit) { this.audit = audit; }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      filterChain.doFilter(request, response);
    } finally {
      String user = request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "anonymous";
      String action = request.getMethod();
      String resource = request.getRequestURI();
      audit.log(user, action, resource, "status=" + response.getStatus());
    }
  }
}