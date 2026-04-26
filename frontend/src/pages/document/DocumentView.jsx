import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/authApi";
import "./DocumentView.css";

const DocumentView = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/documents/${id}`);
        setDocument(response.data);
      } catch (err) {
        console.error("Error fetching document:", err);
        if (err.response?.status === 403) {
          setError(
            "Access denied. You don't have permission to view this document.",
          );
        } else if (err.response?.status === 404) {
          setError("Document not found.");
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load document",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="document-view-container">
        <div className="document-view-card">
          <div className="loading">Loading document...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="document-view-container">
        <div className="document-view-card">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="document-view-container">
      <div className="document-view-card">
        <h1 className="document-title">{document.title}</h1>

        <div className="document-meta">
          <span className="meta-item">
            <strong>Owner:</strong> {document.ownerEmail}
          </span>
          <span className="meta-item">
            <strong>Visibility:</strong> {document.visibilityType}
          </span>
          <span className="meta-item">
            <strong>Created:</strong>{" "}
            {new Date(document.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="document-description">
          <h3>Description</h3>
          <p>{document.description}</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
