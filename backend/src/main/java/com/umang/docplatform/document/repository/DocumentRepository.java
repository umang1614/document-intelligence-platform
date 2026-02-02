package com.umang.docplatform.document.repository;

import com.umang.docplatform.common.enums.Designation;
import com.umang.docplatform.common.enums.VisibilityType;
import com.umang.docplatform.document.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    Optional<Document> findById(Long id);
    
    @Query("SELECT DISTINCT d FROM Document d " +
           "LEFT JOIN DocumentAllowedDesignation dad ON d.id = dad.document.id " +
           "WHERE (d.owner.id = :userId OR " +
           "      (d.visibilityType = :designationBased AND dad.designation = :userDesignation)) " +
           "AND (:query IS NULL OR " +
           "     LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "     LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Document> findAccessibleDocuments(
            @Param("userId") Long userId,
            @Param("userDesignation") Designation userDesignation,
            @Param("designationBased") VisibilityType designationBased,
            @Param("query") String query,
            Pageable pageable
    );
}
