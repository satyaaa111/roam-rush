package com.roamrush.backend.features.auth.repository;

import com.roamrush.backend.features.auth.model.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface UserCredentialRepository extends JpaRepository<UserCredential, UUID> {
}
