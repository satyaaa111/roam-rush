package com.roamrush.backend.security;

import com.roamrush.backend.features.auth.model.User;
import com.roamrush.backend.features.auth.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // You can add roles/authorities here if you have them
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                "", // We don't store the password in the UserDetails, just the username
                new ArrayList<>() // Empty authorities list for now
        );
    }

    // --- THIS IS THE FIX ---
    // Helper method to load user by ID, used by the JwtAuthFilter
    public UserDetails loadUserById(String id) {
         User user = userRepository.findById(java.util.UUID.fromString(id))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                "",
                new ArrayList<>()
        );
    }
}