package com.roamrush.backend.features.auth.repository;

import com.roamrush.backend.features.auth.model.PersistentLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional; // <-- Make sure this is imported

import java.util.Optional;

public interface PersistentLoginRepository extends JpaRepository<PersistentLogin, Long> {

    Optional<PersistentLogin> findByTokenHash(String tokenHash);
    @Transactional
    void deleteByTokenHash(String tokenHash);
}