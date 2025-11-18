package com.roamrush.backend.features.auth.repository;

import com.roamrush.backend.features.auth.model.OtpPurpose;
import com.roamrush.backend.features.auth.model.OtpToken;
import com.roamrush.backend.features.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    Optional<OtpToken> findByUserAndTokenAndPurpose(User user, String token, OtpPurpose purpose);

    void deleteByUserAndTokenAndPurpose(User user, String token, OtpPurpose purpose);

    Optional<OtpToken> findFirstByUserAndPurposeAndExpiresAtAfter(User user, OtpPurpose purpose, Instant now);

    void deleteByUserAndPurposeAndExpiresAtBefore(User user, OtpPurpose purpose, Instant now);
}