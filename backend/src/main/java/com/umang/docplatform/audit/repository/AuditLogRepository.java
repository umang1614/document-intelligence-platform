package com.umang.docplatform.audit.repository;

import com.umang.docplatform.audit.entity.AuditLog;
import com.umang.docplatform.common.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    Page<AuditLog> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);
    
    Page<AuditLog> findByDocumentIdOrderByTimestampDesc(Long documentId, Pageable pageable);
    
    Page<AuditLog> findByActionOrderByTimestampDesc(AuditAction action, Pageable pageable);
    
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);
}
