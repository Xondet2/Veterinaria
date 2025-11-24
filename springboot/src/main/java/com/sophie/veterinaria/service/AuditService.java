package com.sophie.veterinaria.service;

import org.springframework.stereotype.Service;

@Service
public class AuditService {
  public void log(String userId, String action, String resource, String details) {
    // no-op en local
  }
}