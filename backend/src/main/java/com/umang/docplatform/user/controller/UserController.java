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

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userRepository.findAll();
        
        List<UserResponse> response = users.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getRole(),
                        user.getDesignation(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
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
        
        // Return response with temporary password
        var response = new java.util.HashMap<String, Object>();
        response.put("id", savedUser.getId());
        response.put("email", savedUser.getEmail());
        response.put("role", savedUser.getRole());
        response.put("designation", savedUser.getDesignation());
        response.put("createdAt", savedUser.getCreatedAt());
        response.put("temporaryPassword", tempPassword);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    private String generateTempPassword() {
        return UUID.randomUUID().toString().substring(0, 12);
    }
    
}
