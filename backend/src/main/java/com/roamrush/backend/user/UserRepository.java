package com.roamrush.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // This allows Spring to find a user by their email
    Optional<User> findByEmail(String email);
}