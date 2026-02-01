package com.umang.docplatform.user.controller;

import com.umang.docplatform.user.dto.CreateUserRequest;
import com.umang.docplatform.user.dto.UserResponse;
import com.umang.docplatform.user.entity.User;
import com.umang.docplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        // Generate temporary password
        String tempPassword = generateTempPassword();
        
        // Hash password
        String hashedPassword = passwordEncoder.encode(tempPassword);
        
        // Create and save user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(hashedPassword);
        user.setRole(request.getRole());
        user.setDesignation(request.getDesignation());
        
        User savedUser = userRepository.save(user);
        
        // Return response without password
        UserResponse response = new UserResponse(
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getRole(),
            savedUser.getDesignation(),
            savedUser.getCreatedAt()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    private String generateTempPassword() {
        return UUID.randomUUID().toString().substring(0, 12);
    }
    
}
