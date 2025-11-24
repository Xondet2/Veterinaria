package com.sophie.veterinaria.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class SseService {
  public void publish(String event, Map<String, ?> payload) {
    // no-op en local
  }
}