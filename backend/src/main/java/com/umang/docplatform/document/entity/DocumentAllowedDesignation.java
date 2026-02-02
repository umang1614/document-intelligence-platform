package com.umang.docplatform.document.entity;

import com.umang.docplatform.common.enums.Designation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "document_allowed_designations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"document_id", "designation"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentAllowedDesignation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Designation designation;
}
