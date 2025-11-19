package com.roamrush.backend.features.user;

import com.roamrush.backend.features.user.dto.UserProfileDto;
import com.roamrush.backend.features.user.service.UserService;
import com.roamrush.backend.features.auth.model.User;
import com.roamrush.backend.features.auth.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository; // Used to look up ID from email

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        // userDetails.getUsername() actually returns the Email because of how we built UserDetailsServiceImpl
        String email = userDetails.getUsername();
        
        // We need to find the ID associated with this email
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Authenticated user not found in DB"));

        UserProfileDto profile = userService.getUserProfile(user.getId().toString());
        return ResponseEntity.ok(profile);
    }
}