package com.umang.docplatform.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @GetMapping("/secure-test")
    public String secureTest() {
        return "You are authenticated";
    }
    
}
