package com.umang.docplatform.audit.controller;

import com.umang.docplatform.audit.dto.AuditLogResponse;
import com.umang.docplatform.audit.entity.AuditLog;
import com.umang.docplatform.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/audit")
@RequiredArgsConstructor
public class AuditController {
    
    private final AuditLogRepository auditLogRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> auditLogs = auditLogRepository.findAll(pageable);
        
        Page<AuditLogResponse> response = auditLogs.map(log -> new AuditLogResponse(
            log.getId(),
            log.getUser().getEmail(),
            log.getAction(),
            log.getDocument() != null ? log.getDocument().getId() : null,
            log.getDocument() != null ? log.getDocument().getTitle() : null,
            log.getTimestamp()
        ));
        
        return ResponseEntity.ok(response);
    }
}
