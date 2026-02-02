import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/authApi";
import "./DocumentList.css";

const DocumentList = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const size = 10;

  const fetchDocuments = async (query = "", pageNum = 0) => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: pageNum,
        size: size,
      };

      if (query) {
        params.query = query;
      }

      const response = await api.get("/documents", { params });

      setDocuments(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setPage(response.data.number);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(searchQuery, page);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchDocuments(searchQuery, 0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchDocuments(searchQuery, newPage);
  };

  const handleViewDocument = (documentId) => {
    navigate(`/documents/${documentId}`);
  };

  return (
    <div className="document-list-container">
      <div className="document-list-card">
        <h2>My Documents</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setPage(0);
                fetchDocuments("", 0);
              }}
              className="clear-btn"
            >
              Clear
            </button>
          )}
        </form>

        {/* Results Info */}
        {!loading && (
          <div className="results-info">
            Found {totalElements} document{totalElements !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Loading State */}
        {loading && <div className="loading">Loading documents...</div>}

        {/* Documents List */}
        {!loading && documents.length > 0 && (
          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc.id} className="document-card">
                <h3 className="doc-title">{doc.title}</h3>
                <p className="doc-description">{doc.description}</p>
                <div className="doc-meta">
                  <span className="meta-badge">{doc.visibilityType}</span>
                  <span className="meta-text">
                    Version {doc.latestVersionNumber || "N/A"}
                  </span>
                </div>
                <div className="doc-footer">
                  <span className="owner-text">By: {doc.ownerEmail}</span>
                  <button
                    onClick={() => handleViewDocument(doc.id)}
                    className="view-doc-btn"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && documents.length === 0 && !error && (
          <div className="no-results">
            {searchQuery
              ? `No documents found matching "${searchQuery}"`
              : "No documents available"}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className="page-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
