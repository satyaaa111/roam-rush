package com.roamrush.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/test") // As per plan 
public class test {
    @GetMapping
    public ResponseEntity<?> getHealthStatus() {
        // Returns {"status": "OK"} 
        return ResponseEntity.ok(Map.of("status", "OK"));
    }
}