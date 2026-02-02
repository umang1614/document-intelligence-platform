package com.umang.docplatform.document.repository;

import com.umang.docplatform.common.enums.Designation;
import com.umang.docplatform.document.entity.DocumentAllowedDesignation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentAllowedDesignationRepository extends JpaRepository<DocumentAllowedDesignation, Long> {
    
    boolean existsByDocumentIdAndDesignation(Long documentId, Designation designation);
}
