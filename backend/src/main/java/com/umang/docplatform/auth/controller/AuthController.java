package com.umang.docplatform.auth.controller;

import com.umang.docplatform.common.enums.AuditAction;
import com.umang.docplatform.audit.service.AuditSevice;
import com.umang.docplatform.auth.dto.LoginRequest;
import com.umang.docplatform.auth.dto.LoginResponse;
import com.umang.docplatform.config.security.JwtTokenProvider;
import com.umang.docplatform.user.entity.User;
import com.umang.docplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {
    
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditSevice auditService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
        
        // Generate JWT
        String token = jwtTokenProvider.generateToken(
                user.getId(),
                user.getRole().name(),
                user.getDesignation().name()
        );
        
        // Log audit event
        auditService.log(user, AuditAction.LOGIN);
        
        // Return response
        LoginResponse response = new LoginResponse(
                token,
                user.getEmail(),
                user.getRole().name(),
                user.getDesignation().name()
        );
        
        return ResponseEntity.ok(response);
    }
    
}
