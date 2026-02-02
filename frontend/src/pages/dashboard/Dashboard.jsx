import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocumentUpload from "../document/DocumentUpload";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [showUpload, setShowUpload] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    setUserRole(role);
    setUserEmail(email);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleViewDocument = () => {
    if (documentId.trim()) {
      navigate(`/documents/${documentId}`);
    }
  };

  const canUpload = userRole === "ADMIN" || userRole === "EDITOR";

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <h2>Dashboard</h2>
          <p>
            Welcome, <strong>{userEmail}</strong> ({userRole})
          </p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        {canUpload && (
          <div className="section">
            <div className="section-tabs">
              <button
                className={showUpload ? "tab active" : "tab"}
                onClick={() => setShowUpload(true)}
              >
                Upload Document
              </button>
              <button
                className={!showUpload ? "tab active" : "tab"}
                onClick={() => setShowUpload(false)}
              >
                View Document
              </button>
            </div>

            {showUpload ? (
              <DocumentUpload />
            ) : (
              <div className="view-document-section">
                <h3>View Document by ID</h3>
                <div className="view-form">
                  <input
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    placeholder="Enter document ID"
                    className="document-id-input"
                  />
                  <button
                    onClick={handleViewDocument}
                    className="view-btn"
                    disabled={!documentId.trim()}
                  >
                    View Document
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!canUpload && (
          <div className="section viewer-section">
            <h3>View Document</h3>
            <p className="info-text">
              Enter a document ID to view documents you have access to.
            </p>
            <div className="view-form">
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Enter document ID"
                className="document-id-input"
              />
              <button
                onClick={handleViewDocument}
                className="view-btn"
                disabled={!documentId.trim()}
              >
                View Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
