package com.roamrush.backend.features.auth.dto;

public record AuthResponse(
    String accessToken
    // The Refresh Token is sent in an httpOnly cookie, not in this body.
) {}