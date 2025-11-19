package com.roamrush.backend.features.auth.service;

import com.roamrush.backend.config.JwtConfig;
import com.roamrush.backend.exception.AuthException;
import com.roamrush.backend.features.auth.model.PersistentLogin;
import com.roamrush.backend.features.auth.model.User;
import com.roamrush.backend.features.auth.repository.PersistentLoginRepository;
// import org.springframework.security.crypto.password.PasswordEncoder; // <-- REMOVE THIS
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.security.SecureRandom;
import java.util.Optional;

@Service
public class RefreshTokenService {

    private final PersistentLoginRepository persistentLoginRepository;
    private final JwtConfig jwtConfig;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(PersistentLoginRepository persistentLoginRepository,
                               JwtConfig jwtConfig) {
        this.persistentLoginRepository = persistentLoginRepository;
        this.jwtConfig = jwtConfig;
    }

    @Transactional
    public String createRefreshToken(User user) {
        byte[] randoBytes = new byte[64];
        secureRandom.nextBytes(randoBytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randoBytes);

        String tokenHash = hashToken(rawToken);

        PersistentLogin persistentLogin = new PersistentLogin();
        persistentLogin.setUser(user);
        persistentLogin.setTokenHash(tokenHash);
        persistentLogin.setExpiresAt(Instant.now().plusMillis(jwtConfig.getRefreshTokenExpirationMs()));
        persistentLoginRepository.save(persistentLogin);

        return rawToken;
    }

    @Transactional(readOnly = true)
    public User validateAndGetUser(String rawToken) {
        // --- VALIDATION FIX ---
        String tokenHash = hashToken(rawToken);

        Optional<PersistentLogin> token = persistentLoginRepository.findByTokenHash(tokenHash);

        if (token.isEmpty()) {
            throw new AuthException("Invalid refresh token.");
        }

        if (token.get().getExpiresAt().isBefore(Instant.now())) {
            persistentLoginRepository.delete(token.get());
            throw new AuthException("Refresh token expired.");
        }

        return token.get().getUser();
    }
    
    @Transactional
    public void deleteToken(String rawToken) {
        String tokenHash = hashToken(rawToken);
        persistentLoginRepository.deleteByTokenHash(tokenHash);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            // Convert byte array to a hex string
            return new BigInteger(1, hash).toString(16);
        } catch (NoSuchAlgorithmException e) {
            // This should never happen
            throw new RuntimeException("Unable to find SHA-256 algorithm", e);
        }
    }
}