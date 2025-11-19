package com.roamrush.backend.features.auth.dto;

// This is a new DTO just for the resend request.
public record ResendOtpRequest(
    String email
) {}