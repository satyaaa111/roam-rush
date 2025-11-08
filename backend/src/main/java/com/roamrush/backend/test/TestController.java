package com.roamrush.backend.test; // Move to its own feature package

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/test") // As per plan
public class TestController {
    
    @GetMapping
    public ResponseEntity<?> getHealthStatus() {
        // Returns {"status": "OK"}
        return ResponseEntity.ok(Map.of("status", "OK"));
    }
}