package com.roamrush.backend.features.auth;

import com.roamrush.backend.features.auth.dto.*;
import com.roamrush.backend.features.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody SignUpRequest signUpRequest) {
        authService.registerUser(signUpRequest);
        return ResponseEntity.ok(new ApiResponse("Registration successful. Please check your email to verify your account."));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(@RequestBody OtpRequest otpRequest, HttpServletResponse response) {
        AuthResponse authResponse = authService.verifyEmail(otpRequest, response);
        return ResponseEntity.ok(authResponse);
    }

    // ---
    // --- THIS IS THE NEW ENDPOINT ---
    // ---
    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse> resendVerificationOtp(@RequestBody ResendOtpRequest resendRequest) {
        authService.resendVerificationOtp(resendRequest);
        return ResponseEntity.ok(new ApiResponse("A new OTP has been sent to your email."));
    }
    // ---
    // --- END OF NEW ENDPOINT ---
    // ---

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> initiateLogin(@RequestBody LoginRequest loginRequest) {
        authService.initiateLogin(loginRequest);
        return ResponseEntity.ok(new ApiResponse("OTP sent to your email. Please verify to log in."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> completeLogin(@RequestBody OtpRequest otpRequest, HttpServletResponse response) {
        AuthResponse authResponse = authService.completeLogin(otpRequest, response);
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@CookieValue(name = "refreshToken") String refreshToken, HttpServletResponse response) {
        AuthResponse authResponse = authService.refreshToken(refreshToken, response);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken, HttpServletResponse response) {
        // We pass 'response' so we can clear the cookie
        authService.logout(refreshToken, response);
        return ResponseEntity.ok(new ApiResponse("Logged out successfully."));
    }
}