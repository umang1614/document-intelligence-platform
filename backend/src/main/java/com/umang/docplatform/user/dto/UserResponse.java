package com.umang.docplatform.user.dto;

import com.umang.docplatform.common.enums.Designation;
import com.umang.docplatform.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private Role role;
    private Designation designation;
    private LocalDateTime createdAt;
}
