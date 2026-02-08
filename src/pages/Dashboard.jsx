import React from 'react';
import { Package, PlusCircle, CheckCircle, Clock, Heart, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { pets, navigate } = useAppContext();

  const stats = {
    total: pets.length,
    available: pets.filter(p => p.adoptionStatus === 'Available').length,
    pending: pets.filter(p => p.adoptionStatus === 'Pending').length,
    adopted: pets.filter(p => p.adoptionStatus === 'Adopted').length
  };

  const statCards = [
    {
      label: 'Total Pets',
      value: stats.total,
      color: 'bg-blue-500',
      icon: Package,
      change: `${stats.available} available`
    },
    {
      label: 'Available',
      value: stats.available,
      color: 'bg-green-500',
      icon: Heart,
      change: 'Ready for adoption'
    },
    {
      label: 'Pending Adoption',
      value: stats.pending,
      color: 'bg-orange-500',
      icon: Clock,
      change: 'In process'
    },
    {
      label: 'Adopted',
      value: stats.adopted,
      color: 'bg-purple-500',
      icon: CheckCircle,
      change: 'Success stories'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your pet adoption center</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('add-pet')}
            className="bg-pink-600 text-white px-6 py-2.5 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Pet
          </button>
          <button
            onClick={() => navigate('inventory')}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Package className="w-4 h-4" />
            View Inventory
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;