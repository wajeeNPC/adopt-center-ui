import React, { useState } from 'react';
import { PlusCircle, Dog, Cat, Edit, Trash2, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Inventory = () => {
  const { pets, deletePet, navigate, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deletePet(id);
      } catch (error) {
        console.error('Error deleting pet:', error);
      }
    }
  };

  const handleRowClick = (id) => {
    navigate('pet-detail', id);
  };

  // Filter pets based on search and status
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.species?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pet.adoptionStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading && pets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading pets...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pet Inventory</h1>
          <p className="text-sm text-gray-500">Manage all your pet listings</p>
        </div>
        <button
          onClick={() => navigate('add-pet')}
          className="bg-pink-600 text-white px-4 py-2.5 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          Add Pet
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="Available">Available</option>
          <option value="Pending">Pending</option>
          <option value="Adopted">Adopted</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                    No pets found
                  </td>
                </tr>
              ) : (
                filteredPets.map((pet) => (
                  <tr
                    key={pet._id}
                    onClick={() => handleRowClick(pet._id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {pet.imageUrl ? (
                            <img 
                              src={pet.imageUrl} 
                              alt={pet.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">
                              {pet.species === 'Dog' ? '🐕' : '🐱'}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{pet.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {pet.species === 'Dog' ? (
                          <Dog className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Cat className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="text-sm text-gray-700">{pet.species}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pet.breed || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pet.gender}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          pet.adoptionStatus === 'Available'
                            ? 'bg-green-100 text-green-700'
                            : pet.adoptionStatus === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {pet.adoptionStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pet.views || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('edit-pet', pet._id);
                          }}
                          className="p-1.5 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, pet._id, pet.name)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredPets.length} of {pets.length} pets
      </div>
    </div>
  );
};

export default Inventory;