package com.roamrush.backend.features.user.service;

import com.roamrush.backend.exception.ResourceNotFoundException;
import com.roamrush.backend.features.auth.model.User;
import com.roamrush.backend.features.auth.repository.UserRepository;
import com.roamrush.backend.features.user.dto.UserProfileDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new UserProfileDto(
            user.getId(),
            user.getEmail(),
            user.getDisplayName(),
            user.getStatus(),
            user.isEmailVerified()
        );
    }
}