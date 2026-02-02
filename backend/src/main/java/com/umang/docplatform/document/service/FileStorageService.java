package com.umang.docplatform.document.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    /**
     * Store uploaded file to disk
     * @param file MultipartFile to store
     * @param documentId Document ID for organizing files
     * @return Relative file path
     * @throws RuntimeException if file storage fails
     */
    public String storeFile(MultipartFile file, Long documentId) {
        try {
            // Validate file
            if (file.isEmpty()) {
                throw new RuntimeException("Cannot store empty file");
            }
            
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.contains("..")) {
                throw new RuntimeException("Invalid file name: " + originalFilename);
            }
            
            // Create directory structure: uploads/document_{id}/
            Path documentDir = Paths.get(uploadDir, "document_" + documentId);
            Files.createDirectories(documentDir);
            
            // Generate unique filename to avoid conflicts
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Resolve target location
            Path targetLocation = documentDir.resolve(uniqueFilename);
            
            // Copy file to target location
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            log.info("File stored successfully: {}", targetLocation);
            
            // Return relative path
            return documentDir.getFileName() + "/" + uniqueFilename;
            
        } catch (IOException ex) {
            log.error("Failed to store file", ex);
            throw new RuntimeException("Failed to store file: " + ex.getMessage(), ex);
        }
    }
    
    /**
     * Delete file from disk
     * @param filePath Relative file path
     */
    public void deleteFile(String filePath) {
        try {
            Path path = Paths.get(uploadDir, filePath);
            Files.deleteIfExists(path);
            log.info("File deleted: {}", path);
        } catch (IOException ex) {
            log.error("Failed to delete file: {}", filePath, ex);
            throw new RuntimeException("Failed to delete file: " + ex.getMessage(), ex);
        }
    }
    
    /**
     * Get absolute path for a stored file
     * @param filePath Relative file path
     * @return Absolute path
     */
    public Path getFilePath(String filePath) {
        return Paths.get(uploadDir, filePath).normalize();
    }
    
    /**
     * Extract file extension from filename
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex);
    }
}
