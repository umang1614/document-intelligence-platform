import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/authApi";
import "./AddUser.css";

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    role: "VIEWER",
    designation: "JE",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const roles = ["ADMIN", "EDITOR", "VIEWER"];
  const designations = ["TM", "LEAD", "SE", "JE"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/users", formData);

      setSuccess(`User created successfully! Email: ${response.data.email}`);
      setTempPassword(response.data.temporaryPassword);

      // Reset form
      setFormData({
        email: "",
        role: "VIEWER",
        designation: "JE",
      });
    } catch (err) {
      console.error("Error creating user:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to create user",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-container">
      <div className="add-user-card">
        <div className="page-header">
          <button onClick={() => navigate("/admin")} className="back-btn">
            ← Back to Admin
          </button>
          <h2>Add New User</h2>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            <p>{success}</p>
            {tempPassword && (
              <div className="password-info">
                <p className="password-label">
                  <strong>Temporary Password:</strong>
                </p>
                <div className="password-display">
                  <code>{tempPassword}</code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(tempPassword);
                      alert("Password copied to clipboard!");
                    }}
                    className="copy-btn"
                  >
                    Copy
                  </button>
                </div>
                <p className="password-warning">
                  ⚠️ Save this password! It won't be shown again.
                </p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter user email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <p className="field-hint">
              ADMIN: Full access | EDITOR: Can upload documents | VIEWER:
              Read-only
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation *</label>
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
            >
              {designations.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
            <p className="field-hint">
              TM: Team Member | LEAD: Lead | SE: Senior Engineer | JE: Junior
              Engineer
            </p>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
