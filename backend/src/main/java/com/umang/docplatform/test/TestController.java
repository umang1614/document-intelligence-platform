package com.umang.docplatform.test;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @GetMapping("/secure-test")
    @PreAuthorize("hasRole('ADMIN')")
    public String secureTest() {
        return "You are authenticated";
    }
    
}
