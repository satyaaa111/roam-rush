package com.roamrush.backend.features.auth.dto;

// Used for both verifying email and verifying login
public record OtpRequest(
    String email,
    String otp
) {}
