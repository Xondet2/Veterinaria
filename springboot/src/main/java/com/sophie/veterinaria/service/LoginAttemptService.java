package com.sophie.veterinaria.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {
  private static class Info { int count; Instant first; Instant lockedUntil; }
  private final Map<String, Info> store = new ConcurrentHashMap<>();
  private final int maxAttempts = 5; // intentos
  private final long windowMs = 15 * 60 * 1000; // 15min
  private final long lockMs = 10 * 60 * 1000; // 10min

  public boolean isLocked(String key) {
    Info i = store.get(key);
    return i != null && i.lockedUntil != null && i.lockedUntil.isAfter(Instant.now());
  }

  public void recordFailure(String key){
    Info i = store.computeIfAbsent(key, k -> { Info n = new Info(); n.first = Instant.now(); return n; });
    if (i.lockedUntil != null && i.lockedUntil.isAfter(Instant.now())) return;
    long elapsed = Instant.now().toEpochMilli() - (i.first == null ? Instant.now().toEpochMilli() : i.first.toEpochMilli());
    if (elapsed > windowMs) { i.count = 0; i.first = Instant.now(); }
    i.count++;
    if (i.count >= maxAttempts) { i.lockedUntil = Instant.now().plusMillis(lockMs); i.count = 0; }
  }

  public void recordSuccess(String key){ store.remove(key); }

  public long lockedRemainingMs(String key){
    Info i = store.get(key);
    if (i == null || i.lockedUntil == null) return 0;
    long ms = i.lockedUntil.toEpochMilli() - Instant.now().toEpochMilli();
    return Math.max(ms, 0);
  }
}