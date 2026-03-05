import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AdminLayout from './components/layout/AdminLayout';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { authAPI } from './services/api';
import { Spinner } from './components/ui/Spinner';

// Adoption Center Pages
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import PetDetail from './pages/PetDetail';
import Settings from './pages/Settings';
import Applications from './pages/Applications';
import Vaccinations from './pages/Vaccinations';
import Reports from './pages/Reports';
import ApplyForAdoption from './pages/ApplyForAdoption';
import UserManagement from './pages/UserManagement';
import EditUser from './pages/EditUser';
import InviteUser from './pages/InviteUser';
import ApplicationDetail from './pages/ApplicationDetail';

// Adoption Center Page Router Component
const AdoptionCenterRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/add-pet" element={<AddPet />} />
      <Route path="/pet/:petId" element={<PetDetail />} />
      <Route path="/edit-pet/:petId" element={<EditPet />} />
      <Route path="/apply/:petId" element={<ApplyForAdoption />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/applications/:applicationId" element={<ApplicationDetail />} />
      <Route path="/vaccinations" element={<Vaccinations />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/user-management" element={<Navigate to="/users" replace />} />
      <Route path="/edit-user/:userId" element={<EditUser />} />
      <Route path="/invite-user" element={<InviteUser />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component with Authentication
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authAPI.isAuthenticated();
      const storedUser = authAPI.getStoredUser();

      if (isAuth && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // Show login/signup pages if not authenticated
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Show adoption center dashboard if authenticated
  return (
    <AppProvider>
      <AdminLayout user={user} onLogout={handleLogout}>
        <AdoptionCenterRouter />
      </AdminLayout>
      <Toaster richColors position="bottom-right" />
    </AppProvider>
  );
}

export default App;