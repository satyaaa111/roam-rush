package com.roamrush.backend.features.auth.service;

import com.roamrush.backend.exception.AuthException;
import com.roamrush.backend.features.auth.dto.*;
import com.roamrush.backend.features.auth.model.User;
import com.roamrush.backend.features.auth.model.UserCredential;
import com.roamrush.backend.features.auth.model.OtpPurpose;
import com.roamrush.backend.features.auth.repository.UserCredentialRepository;
import com.roamrush.backend.features.auth.repository.UserRepository;
import com.roamrush.backend.security.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Duration;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserCredentialRepository userCredentialRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService; 

    // Constructor (no changes)
    public AuthService(UserRepository userRepository, UserCredentialRepository userCredentialRepository, 
                           OtpService otpService, PasswordEncoder passwordEncoder, 
                           JwtTokenProvider jwtTokenProvider, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.userCredentialRepository = userCredentialRepository;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenService = refreshTokenService;
    }

    // registerUser (no changes)
    @Transactional
    public void registerUser(SignUpRequest request) {
        if (userRepository.existsByEmail(request.email().toLowerCase())) {
            throw new AuthException("Email is already in use.");
        }
        User user = new User();
        user.setEmail(request.email().toLowerCase());
        user.setDisplayName(request.displayName());
        user.setStatus("pending_verification");
        user.setEmailVerified(false);
        User savedUser = userRepository.save(user);

        UserCredential credential = new UserCredential();
        credential.setUser(savedUser);
        credential.setPasswordHash(passwordEncoder.encode(request.password()));
        userCredentialRepository.save(credential);

        otpService.generateAndSendOtp(savedUser, OtpPurpose.EMAIL_VERIFICATION);
    }

    // verifyEmail (no changes)
    @Transactional
    public AuthResponse verifyEmail(OtpRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new AuthException("User not found."));
        otpService.validateOtp(user, request.otp(), OtpPurpose.EMAIL_VERIFICATION);
        user.setEmailVerified(true);
        user.setStatus("active");
        userRepository.save(user);
        otpService.deleteOtp(user, request.otp(), OtpPurpose.EMAIL_VERIFICATION);
        String accessToken = jwtTokenProvider.generateToken(user);
        String rawRefreshToken = refreshTokenService.createRefreshToken(user);
        setRefreshTokenCookie(response, rawRefreshToken);
        return new AuthResponse(accessToken);
    }

    // ---
    // --- THIS IS THE NEW METHOD ---
    // ---
    @Transactional
    public void resendVerificationOtp(ResendOtpRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new AuthException("User not found with that email."));

        // Security check: Only allow resend if the user is not already verified
        if (user.isEmailVerified()) {
            throw new AuthException("This account is already verified. Please log in.");
        }

        // We can re-use the same "generate" logic. It will create a new, valid OTP
        // and send it. The old, expired one will be ignored.
        otpService.generateAndSendOtp(user, OtpPurpose.EMAIL_VERIFICATION);
    }
    // ---
    // --- END OF NEW METHOD ---
    // ---


    // initiateLogin (no changes)
    @Transactional
    public void initiateLogin(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new AuthException("Invalid credentials."));
        if (!user.isEmailVerified()) {
            throw new AuthException("Please verify your email before logging in.");
        }
        UserCredential credential = userCredentialRepository.findById(user.getId())
                .orElseThrow(() -> new AuthException("Invalid credentials."));
        if (!passwordEncoder.matches(request.password(), credential.getPasswordHash())) {
            throw new AuthException("Invalid credentials.");
        }
        otpService.generateAndSendOtp(user, OtpPurpose.LOGIN_2FA);
    }

    // completeLogin (no changes)
    @Transactional
    public AuthResponse completeLogin(OtpRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new AuthException("User not found."));
        otpService.validateOtp(user, request.otp(), OtpPurpose.LOGIN_2FA);
        String accessToken = jwtTokenProvider.generateToken(user);
        String rawRefreshToken = refreshTokenService.createRefreshToken(user);
        setRefreshTokenCookie(response, rawRefreshToken);
        otpService.deleteOtp(user, request.otp(), OtpPurpose.LOGIN_2FA);
        return new AuthResponse(accessToken);
    }
    
    // refreshToken (no changes)
    @Transactional
    public AuthResponse refreshToken(String rawRefreshToken, HttpServletResponse response) {
        User user = refreshTokenService.validateAndGetUser(rawRefreshToken);
        refreshTokenService.deleteToken(rawRefreshToken);
        String newRawRefreshToken = refreshTokenService.createRefreshToken(user);
        setRefreshTokenCookie(response, newRawRefreshToken);
        String newAccessToken = jwtTokenProvider.generateToken(user);
        return new AuthResponse(newAccessToken);
    }
    
    // setRefreshTokenCookie (no changes)
    private void setRefreshTokenCookie(HttpServletResponse response, String rawRefreshToken) {
        Cookie cookie = new Cookie("refreshToken", rawRefreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge((int) Duration.ofDays(7).getSeconds());
        response.addCookie(cookie);
    }
}