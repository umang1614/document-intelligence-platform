package com.umang.docplatform.document.dto;

import com.umang.docplatform.common.enums.Designation;
import com.umang.docplatform.common.enums.VisibilityType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDocumentRequest {
    private String title;
    private String description;
    private VisibilityType visibilityType;
    private List<Designation> allowedDesignations;
}
