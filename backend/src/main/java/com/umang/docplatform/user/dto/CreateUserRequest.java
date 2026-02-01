package com.umang.docplatform.user.dto;

import com.umang.docplatform.common.enums.Designation;
import com.umang.docplatform.common.enums.Role;
import lombok.Data;

@Data
public class CreateUserRequest {
    private String email;
    private Role role;
    private Designation designation;
}
