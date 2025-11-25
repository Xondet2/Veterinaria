package com.sophie.veterinaria.controller;

import com.sophie.veterinaria.service.SseService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/sync")
public class SyncController {
  private final SseService sse;
  public SyncController(SseService sse){ this.sse=sse; }

  @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter stream(){
    return sse.subscribe();
  }
}