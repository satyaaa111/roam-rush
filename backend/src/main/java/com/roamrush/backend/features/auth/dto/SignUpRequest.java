package com.roamrush.backend.features.auth.dto;

public record SignUpRequest(
    String email,
    String password,
    String displayName
) {}