package com.sophie.veterinaria.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@Service
public class SseService {
  private final Set<SseEmitter> emitters = new CopyOnWriteArraySet<>();

  public SseEmitter subscribe() {
    SseEmitter emitter = new SseEmitter(0L);
    emitters.add(emitter);
    emitter.onCompletion(() -> emitters.remove(emitter));
    emitter.onTimeout(() -> emitters.remove(emitter));
    return emitter;
  }

  public void publish(String event, Map<String, ?> payload) {
    emitters.forEach(e -> {
      try { e.send(SseEmitter.event().name(event).data(payload)); } catch (IOException ex) { emitters.remove(e); }
    });
  }
}