package com.roamrush.backend.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.persistence.GenerationType;
import java.util.Collection;
import java.util.List;

@Data // Lombok: auto-creates getters, setters, toString, etc.
@Builder // Lombok: for easy object creation
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user") // This will be our table in PostgreSQL
public class User implements UserDetails { // Implement UserDetails for Spring Security

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // This will be the HASHED password

    // --- UserDetails Methods ---
    // We can add roles later, for now we return an empty list
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    // We use email as the "username" for login
    @Override
    public String getUsername() {
        return email;
    }
    
    // For now, we'll keep these simple
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}