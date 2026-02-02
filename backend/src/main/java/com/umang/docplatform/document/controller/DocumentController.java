package com.umang.docplatform.document.controller;

import com.umang.docplatform.common.enums.Designation;
import com.umang.docplatform.common.enums.VisibilityType;
import com.umang.docplatform.config.security.JwtTokenProvider;
import com.umang.docplatform.document.dto.CreateDocumentRequest;
import com.umang.docplatform.document.dto.CreateDocumentResponse;
import com.umang.docplatform.document.dto.DocumentResponse;
import com.umang.docplatform.document.entity.Document;
import com.umang.docplatform.document.entity.DocumentAllowedDesignation;
import com.umang.docplatform.document.entity.DocumentVersion;
import com.umang.docplatform.document.repository.DocumentAllowedDesignationRepository;
import com.umang.docplatform.document.repository.DocumentRepository;
import com.umang.docplatform.document.repository.DocumentVersionRepository;
import com.umang.docplatform.document.service.FileStorageService;
import com.umang.docplatform.user.entity.User;
import com.umang.docplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {
    
    private final DocumentRepository documentRepository;
    private final DocumentAllowedDesignationRepository allowedDesignationRepository;
    private final DocumentVersionRepository documentVersionRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    
    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<CreateDocumentResponse> createDocument(
            @RequestPart("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("visibilityType") VisibilityType visibilityType,
            @RequestParam(value = "allowedDesignations", required = false) List<Designation> allowedDesignations) {
        
        // Validate file
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
        }
        
        // Get logged-in user ID from SecurityContext
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // Fetch user from database
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create and save document metadata
        Document document = new Document();
        document.setTitle(title);
        document.setDescription(description);
        document.setVisibilityType(visibilityType);
        document.setOwner(owner);
        
        Document savedDocument = documentRepository.save(document);
        
        // Save allowed designations if visibility type is DESIGNATION_BASED
        if (visibilityType == VisibilityType.DESIGNATION_BASED 
                && allowedDesignations != null 
                && !allowedDesignations.isEmpty()) {
            
            for (var designation : allowedDesignations) {
                DocumentAllowedDesignation allowedDesignation = new DocumentAllowedDesignation();
                allowedDesignation.setDocument(savedDocument);
                allowedDesignation.setDesignation(designation);
                allowedDesignationRepository.save(allowedDesignation);
            }
        }
        
        // Store file and create first version
        String filePath = fileStorageService.storeFile(file, savedDocument.getId());
        
        DocumentVersion documentVersion = new DocumentVersion();
        documentVersion.setDocument(savedDocument);
        documentVersion.setVersionNumber(1);
        documentVersion.setFilePath(filePath);
        documentVersion.setUploadedBy(owner);
        
        DocumentVersion savedVersion = documentVersionRepository.save(documentVersion);
        
        // Return document id and version number
        CreateDocumentResponse response = new CreateDocumentResponse(
                savedDocument.getId(),
                "Document created successfully with version " + savedVersion.getVersionNumber()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocument(@PathVariable Long id) {
        // Fetch document
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));
        
        // Get logged-in user ID from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        
        // Fetch user from database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user is owner
        boolean hasAccess = false;
        
        if (document.getOwner().getId().equals(userId)) {
            // Owner can always access
            hasAccess = true;
        } else if (document.getVisibilityType() == VisibilityType.DESIGNATION_BASED) {
            // Check if user's designation is allowed
            hasAccess = allowedDesignationRepository
                    .existsByDocumentIdAndDesignation(document.getId(), user.getDesignation());
        }
        
        if (!hasAccess) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to this document");
        }
        
        // Fetch latest version
        DocumentVersion latestVersion = documentVersionRepository
                .findTopByDocumentIdOrderByVersionNumberDesc(document.getId())
                .orElse(null);
        
        return ResponseEntity.ok(mapToDocumentResponse(document, latestVersion));
    }
    
    private DocumentResponse mapToDocumentResponse(Document document, DocumentVersion latestVersion) {
        String fileDownloadUrl = null;
        Integer versionNumber = null;
        
        if (latestVersion != null) {
            versionNumber = latestVersion.getVersionNumber();
            fileDownloadUrl = "/documents/" + document.getId() + "/download/" + versionNumber;
        }
        
        return new DocumentResponse(
                document.getId(),
                document.getTitle(),
                document.getDescription(),
                document.getVisibilityType(),
                document.getOwner().getId(),
                document.getOwner().getEmail(),
                document.getCreatedAt(),
                versionNumber,
                fileDownloadUrl
        );
    }
}
