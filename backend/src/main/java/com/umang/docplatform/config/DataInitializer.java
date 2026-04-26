package com.umang.docplatform.config;

import com.umang.docplatform.common.enums.Designation;
import com.umang.docplatform.common.enums.Role;
import com.umang.docplatform.user.entity.User;
import com.umang.docplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (userRepository.findByEmail("admin@company.com").isEmpty()) {
            // Create admin user
            User admin = new User();
            admin.setEmail("admin@company.com");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setDesignation(Designation.TM);
            
            userRepository.save(admin);
            System.out.println("✅ Default admin user created: admin@company.com / Admin@123");
        } else {
            System.out.println("ℹ️ Admin user already exists. Skipping initialization.");
        }
    }
    
}
