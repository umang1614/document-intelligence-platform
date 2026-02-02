import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import DocumentUpload from "./pages/document/DocumentUpload";
import DocumentView from "./pages/document/DocumentView";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddUser from "./pages/admin/AddUser";
import UserList from "./pages/admin/UserList";
import AuditLogs from "./pages/admin/AuditLogs";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents/upload" element={<DocumentUpload />} />
        <Route path="/documents/:id" element={<DocumentView />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
