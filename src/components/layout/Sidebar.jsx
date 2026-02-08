import React from 'react';
import { Home, Package, PlusCircle, Settings, X, Heart } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { navigate, currentPage } = useAppContext();

  const navItems = [
    { icon: Home, label: 'Dashboard', page: 'dashboard' },
    { icon: Package, label: 'Inventory', page: 'inventory' },
    { icon: PlusCircle, label: 'Add Pet', page: 'add-pet' },
    { icon: Settings, label: 'Settings', page: 'settings' }
  ];

  const handleNavClick = (page) => {
    navigate(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PetCareHub</h1>
                <p className="text-xs text-gray-400 mt-0.5">Adoption Center Portal</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                currentPage === item.page
                  ? 'bg-slate-800 text-white border-l-4 border-pink-600'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
          <div className="text-xs text-gray-500">
            <p>© 2024 PetCareHub</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;