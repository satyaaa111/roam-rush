package com.roamrush.backend.features.auth.service;

import com.roamrush.backend.exception.AuthException;
import com.roamrush.backend.features.auth.model.OtpPurpose;
import com.roamrush.backend.features.auth.model.OtpToken;
import com.roamrush.backend.features.auth.model.User;
import com.roamrush.backend.features.auth.repository.OtpTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Make sure this is imported
import com.roamrush.backend.features.auth.service.EmailTemplate;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional; // <-- Make sure this is imported

@Service
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(OtpTokenRepository otpTokenRepository, EmailService emailService) {
        this.otpTokenRepository = otpTokenRepository;
        this.emailService = emailService;
    }

    @Transactional 
    public void generateAndSendOtp(User user, OtpPurpose purpose) {
        Instant now = Instant.now();

        // 1. Check if a valid, unexpired token already exists.
        Optional<OtpToken> existingToken = otpTokenRepository.findFirstByUserAndPurposeAndExpiresAtAfter(user, purpose, now);

        if (existingToken.isPresent()) {
            throw new AuthException("An active OTP has already been sent. Please wait a few minutes before trying again.");
        }

        // 2. Clean up any old, expired tokens for this purpose.
        otpTokenRepository.deleteByUserAndPurposeAndExpiresAtBefore(user, purpose, now);

        // 3. Generate new token
        String token = String.format("%06d", secureRandom.nextInt(999999));
        Instant expiresAt = now.plus(10, ChronoUnit.MINUTES);

        OtpToken otpToken = new OtpToken();
        otpToken.setUser(user);
        otpToken.setToken(token);
        otpToken.setPurpose(purpose);
        otpToken.setExpiresAt(expiresAt);
        otpTokenRepository.save(otpToken);

        // 4. Prepare Email Content
        String subject;
        if (purpose == OtpPurpose.EMAIL_VERIFICATION) {
            subject = "Verify your RoamRush Account";
        } else { 
            subject = "RoamRush Login Verification";
        }
        
        // Use the user's name, or default to "Traveller" if null
        String name = (user.getDisplayName() != null && !user.getDisplayName().isBlank()) 
                      ? user.getDisplayName() 
                      : "Traveller";

        // Generate the professional HTML body
        String body = EmailTemplate.getOtpEmail(name, token);
        
        // Send the email (Async)
        emailService.sendEmail(user.getEmail(), subject, body);
    }

    public void validateOtp(User user, String token, OtpPurpose purpose) {
        OtpToken otpToken = otpTokenRepository.findByUserAndTokenAndPurpose(user, token, purpose)
                .orElseThrow(() -> new AuthException("Invalid OTP."));

        if (otpToken.getExpiresAt().isBefore(Instant.now())) {
            // (Optional) Clean up expired token
            otpTokenRepository.delete(otpToken);
            throw new AuthException("OTP has expired.");
        }
        // OTP is valid
    }

    @Transactional
    public void deleteOtp(User user, String token, OtpPurpose purpose) {
        // We delete the token after it's successfully used
        otpTokenRepository.deleteByUserAndTokenAndPurpose(user, token, purpose);
    }
}