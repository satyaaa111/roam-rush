package com.roamrush.backend.features.user.dto;

import java.util.UUID;

public record UserProfileDto(
    UUID id,
    String email,
    String displayName,
    String status,
    boolean isEmailVerified
) {}