package com.umang.docplatform.audit.service;

import com.umang.docplatform.audit.entity.AuditLog;
import com.umang.docplatform.common.enums.AuditAction;
import com.umang.docplatform.audit.repository.AuditLogRepository;
import com.umang.docplatform.document.entity.Document;
import com.umang.docplatform.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditSevice {
    
    private final AuditLogRepository auditLogRepository;
    
    /**
     * Log an audit event. Failures will not break the main flow.
     * 
     * @param user User performing the action
     * @param action Type of action performed
     * @param document Document involved (can be null for non-document actions)
     */
    public void log(User user, AuditAction action, Document document) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUser(user);
            auditLog.setAction(action);
            auditLog.setDocument(document);
            
            auditLogRepository.save(auditLog);
            
            log.debug("Audit log created: user={}, action={}, document={}", 
                     user.getEmail(), action, document != null ? document.getId() : null);
        } catch (Exception e) {
            // Log error but do NOT throw exception to avoid breaking main flow
            log.error("Failed to create audit log: user={}, action={}, document={}", 
                     user.getEmail(), action, document != null ? document.getId() : null, e);
        }
    }
    
    /**
     * Convenience method for logging actions without a document
     */
    public void log(User user, AuditAction action) {
        log(user, action, null);
    }
}
