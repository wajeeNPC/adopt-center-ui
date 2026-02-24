import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AdminLayout from './components/layout/AdminLayout';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import { authAPI } from './services/api';

// Pages
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import PetDetail from './pages/PetDetail';
import Settings from './pages/Settings';
import Applications from './pages/Applications';
import Vaccinations from './pages/Vaccinations';
import Reports from './pages/Reports';

// Page Router Component
const PageRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/add-pet" element={<AddPet />} />
      <Route path="/pet/:petId" element={<PetDetail />} />
      <Route path="/edit-pet/:petId" element={<EditPet />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/vaccinations" element={<Vaccinations />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show admin dashboard if authenticated
  return (
    <AppProvider>
      <AdminLayout user={user} onLogout={handleLogout}>
        <PageRouter />
      </AdminLayout>
      <Toaster richColors position="bottom-right" />
    </AppProvider>
  );
}

export default App;