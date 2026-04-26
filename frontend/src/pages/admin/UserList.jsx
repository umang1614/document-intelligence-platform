import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/authApi";
import "./UserList.css";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load users",
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
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "ADMIN":
        return "role-badge role-admin";
      case "EDITOR":
        return "role-badge role-editor";
      case "VIEWER":
        return "role-badge role-viewer";
      default:
        return "role-badge";
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-content">
        <div className="page-header">
          <button onClick={() => navigate("/admin")} className="back-btn">
            ← Back to Admin
          </button>
          <div className="header-actions">
            <h2>User Management</h2>
            <button
              onClick={() => navigate("/admin/users/add")}
              className="add-user-btn"
            >
              + Add User
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Designation</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td className="email-cell">{user.email}</td>
                      <td>
                        <span className={getRoleBadgeClass(user.role)}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className="designation-badge">
                          {user.designation}
                        </span>
                      </td>
                      <td className="date-cell">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="table-footer">
            <p>Total Users: {users.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
