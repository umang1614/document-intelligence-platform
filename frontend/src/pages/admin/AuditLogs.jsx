import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/authApi";
import "./AuditLogs.css";

const AuditLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchAuditLogs();
  }, [currentPage]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/audit", {
        params: {
          page: currentPage,
          size: pageSize,
        },
      });
      setLogs(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load audit logs",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionBadgeClass = (action) => {
    switch (action) {
      case "LOGIN":
        return "action-badge action-login";
      case "DOCUMENT_CREATED":
        return "action-badge action-created";
      case "DOCUMENT_VIEWED":
        return "action-badge action-viewed";
      case "DOCUMENT_UPDATED":
        return "action-badge action-updated";
      case "DOCUMENT_DELETED":
        return "action-badge action-deleted";
      default:
        return "action-badge";
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="audit-logs-container">
      <div className="audit-logs-content">
        <div className="page-header">
          <button onClick={() => navigate("/admin")} className="back-btn">
            ← Back to Admin
          </button>
          <div className="header-info">
            <h2>Audit Logs</h2>
            <p className="subtitle">System activity log for all users</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading audit logs...</div>
        ) : (
          <>
            <div className="table-container">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Document</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No audit logs found
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <td>{log.id}</td>
                        <td className="user-cell">{log.userEmail}</td>
                        <td>
                          <span className={getActionBadgeClass(log.action)}>
                            {log.action.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="document-cell">
                          {log.documentId ? (
                            <span>
                              <strong>#{log.documentId}</strong>
                              {log.documentTitle && (
                                <span className="doc-title">
                                  {" "}
                                  - {log.documentTitle}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="no-document">-</span>
                          )}
                        </td>
                        <td className="date-cell">
                          {formatDate(log.timestamp)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage + 1} of {totalPages}
                  <span className="total-records">
                    {" "}
                    (Total: {totalElements} logs)
                  </span>
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
