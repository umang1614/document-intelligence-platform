import { useState } from "react";
import api from "../../api/authApi";
import "./DocumentUpload.css";

const DocumentUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibilityType: "PRIVATE",
    allowedDesignations: [],
  });
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const designations = ["TM", "LEAD", "SE", "JE"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDesignationChange = (designation) => {
    setFormData((prev) => {
      const isChecked = prev.allowedDesignations.includes(designation);
      return {
        ...prev,
        allowedDesignations: isChecked
          ? prev.allowedDesignations.filter((d) => d !== designation)
          : [...prev.allowedDesignations, designation],
      };
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate file is selected
      if (!file) {
        setError("Please select a PDF file");
        setLoading(false);
        return;
      }

      // Create FormData for multipart/form-data request
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("visibilityType", formData.visibilityType);

      // Append allowed designations if DESIGNATION_BASED
      if (formData.visibilityType === "DESIGNATION_BASED") {
        formData.allowedDesignations.forEach((designation) => {
          formDataToSend.append("allowedDesignations", designation);
        });
      }

      const response = await api.post("/documents", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(
        `Document created successfully! Document ID: ${response.data.id}`,
      );
      // Reset form
      setFormData({
        title: "",
        description: "",
        visibilityType: "PRIVATE",
        allowedDesignations: [],
      });
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("pdfFile");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Error creating document:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create document",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-upload-container">
      <div className="document-upload-card">
        <h2>Create Document</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pdfFile">
              PDF File (Optional - for future use)
            </label>
            <input
              type="file"
              id="pdfFile"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            {file && <p className="file-info">Selected: {file.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter document title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter document description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="visibilityType">Visibility Type *</label>
            <select
              id="visibilityType"
              name="visibilityType"
              value={formData.visibilityType}
              onChange={handleInputChange}
              required
            >
              <option value="PRIVATE">Private</option>
              <option value="DESIGNATION_BASED">Designation Based</option>
            </select>
          </div>

          {formData.visibilityType === "DESIGNATION_BASED" && (
            <div className="form-group">
              <label>Allowed Designations *</label>
              <div className="checkbox-group">
                {designations.map((designation) => (
                  <label key={designation} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.allowedDesignations.includes(
                        designation,
                      )}
                      onChange={() => handleDesignationChange(designation)}
                    />
                    <span>{designation}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Document"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
