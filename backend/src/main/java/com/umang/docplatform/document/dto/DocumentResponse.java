package com.umang.docplatform.document.dto;

import com.umang.docplatform.common.enums.VisibilityType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private Long id;
    private String title;
    private String description;
    private VisibilityType visibilityType;
    private Long ownerId;
    private String ownerEmail;
    private LocalDateTime createdAt;
    private Integer latestVersionNumber;
    private String fileDownloadUrl;
}
