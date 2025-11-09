package com.roamrush.backend.auth;

import com.roamrush.backend.auth.dto.AuthResponse;
import com.roamrush.backend.auth.dto.LoginRequest;
import com.roamrush.backend.auth.dto.RegisterRequest;
import com.roamrush.backend.security.JwtService;
import com.roamrush.backend.user.User;
import com.roamrush.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * THIS IS THE MODIFIED METHOD
     * It now returns 'void' (nothing) and throws an error if
     * the email is already in use.
     */
    public void register(RegisterRequest request) {
        
        // 1. CHECK IF EMAIL EXISTS
        // We use the new findByEmail method we created
        var existingUser = userRepository.findByEmail(request.getEmail());

        // 2. IF YES, THROW A SPECIFIC ERROR
        if (existingUser.isPresent()) {
            // This error will be caught by our new Exception Handler
            throw new IllegalStateException("Email already in use");
        }
        
        // 3. IF NO, HASH PASSWORD AND CREATE USER
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // HASH the password
                .build();
        
        // 4. SAVE IN DATABASE
        userRepository.save(user);

        // 5. That's it! We don't generate a token.
    }

    /**
     * THIS IS YOUR SEPARATE LOGIN API
     * It is 100% correct and does not need to change.
     */
    public AuthResponse login(LoginRequest request) {
        // 1. This step validates the email/password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        ); // If this fails, it throws an exception

        // 2. If successful, find the user
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(); // We know the user exists

        // 3. Generate a token
        var jwtToken = jwtService.generateToken(user);

        // 4. Return the token
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }
}
