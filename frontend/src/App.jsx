import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Auth/LoginPage.jsx';
import RegisterPage from './Auth/RegisterPage.jsx';
import ProjectsPage from './Project/ProjectsPage.jsx';
import ProjectDetailPage from './Project/ProjectDetailPage.jsx';
import { useAuth } from './Auth/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <ProjectsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/projects/:projectId"
                    element={
                        <ProtectedRoute>
                            <ProjectDetailPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/projects" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
