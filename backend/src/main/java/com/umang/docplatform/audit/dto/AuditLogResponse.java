package com.umang.docplatform.audit.dto;

import com.umang.docplatform.common.enums.AuditAction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private String userEmail;
    private AuditAction action;
    private Long documentId;
    private String documentTitle;
    private LocalDateTime timestamp;
}
