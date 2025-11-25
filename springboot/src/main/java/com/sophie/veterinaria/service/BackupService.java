package com.sophie.veterinaria.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class BackupService {
  public Map<String, Object> runBackup() {
    return Map.of("success", true, "message", "backup simulated");
  }
}