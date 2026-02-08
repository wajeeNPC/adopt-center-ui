import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import AdminLayout from './components/layout/AdminLayout';
import Toast from './components/common/Toast';
import Login from './pages/Login';
import { authAPI } from './services/api';

// Pages
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import PetDetail from './pages/PetDetail';
import Settings from './pages/Settings';

// Page Router Component
const PageRouter = () => {
  const { currentPage } = useAppContext();

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard />;
    case 'inventory':
      return <Inventory />;
    case 'add-pet':
      return <AddPet />;
    case 'pet-detail':
      return <PetDetail />;
    case 'edit-pet':
      return <EditPet />;
    case 'settings':
      return <Settings />;
    default:
      return <Dashboard />;
  }
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
      <ToastContainer />
    </AppProvider>
  );
}

// Toast Consumer Component
const ToastContainer = () => {
  const { toast } = useAppContext();
  return <Toast message={toast?.message} type={toast?.type} />;
};

export default App;