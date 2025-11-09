package com.roamrush.backend.auth;

import com.roamrush.backend.auth.dto.AuthResponse;
import com.roamrush.backend.auth.dto.LoginRequest;
import com.roamrush.backend.auth.dto.RegisterRequest;
import com.roamrush.backend.user.User;
import com.roamrush.backend.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * NEW ENDPOINT
     * This is the backend for your `checkAuth` function.
     * It's protected by your JwtAuthFilter.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(
            // Spring Security uses the JWT token from the "Authorization" header
            // to find the user in the database and "injects" them here.
            @AuthenticationPrincipal User loggedInUser
    ) {
        // We check if the user is null, which can happen if the token is
        // valid but the user was somehow deleted.
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // We build a "safe" response DTO (without the password) and send it.
        return ResponseEntity.ok(
            UserResponse.builder()
                .id(loggedInUser.getId())
                .username(loggedInUser.getUsername()) // This is the email
                .email(loggedInUser.getEmail())
                .build()
        );
    }

    /**
     * EXISTING REGISTER ENDPOINT
     * This endpoint is public.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @RequestBody RegisterRequest request
    ) {
        authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED) // 201
                .body(Map.of("message", "User registered successfully"));
    }

    /**
     * EXISTING LOGIN ENDPOINT
     * This endpoint is public.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }
}