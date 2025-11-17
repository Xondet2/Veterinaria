package com.sophie.veterinaria.controller;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api") public class HealthController {
  @GetMapping("/health") public java.util.Map<String,Object> health(){
    return java.util.Map.of("status","ok","time",java.time.Instant.now().toString());
  }
}