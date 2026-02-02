import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    // Double check user is admin
    if (userRole !== "ADMIN") {
      navigate("/dashboard");
    }
  }, [userRole, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <div className="header-info">
          <h1>Admin Dashboard</h1>
          <p className="admin-email">{userEmail}</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate("/dashboard")} className="nav-btn">
            Main Dashboard
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-cards">
          <div
            className="admin-card"
            onClick={() => navigate("/admin/users/add")}
          >
            <div className="card-icon">➕</div>
            <h3>Add User</h3>
            <p>Create new user accounts</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/admin/users")}>
            <div className="card-icon">👥</div>
            <h3>View Users</h3>
            <p>Manage all system users</p>
          </div>

          <div
            className="admin-card"
            onClick={() => navigate("/admin/audit-logs")}
          >
            <div className="card-icon">📋</div>
            <h3>Audit Logs</h3>
            <p>View system activity logs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
