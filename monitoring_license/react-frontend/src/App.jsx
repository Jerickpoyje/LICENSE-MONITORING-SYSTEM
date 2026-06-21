import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LicenseRenewalPage from './pages/LicenseRenewalPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/app.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/licenses" element={<LicenseRenewalPage />} />
        </Route>

        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
