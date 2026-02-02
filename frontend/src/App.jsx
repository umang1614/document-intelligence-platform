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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents/upload" element={<DocumentUpload />} />
        <Route path="/documents/:id" element={<DocumentView />} />
      </Routes>
    </Router>
  );
}

export default App;
