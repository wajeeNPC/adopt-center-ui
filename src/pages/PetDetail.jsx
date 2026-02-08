import React from 'react';
import { ArrowLeft, Edit } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const PetDetail = () => {
  const { pets, navigate, selectedPetId } = useAppContext();
  const pet = pets.find((p) => p._id === selectedPetId);

  if (!pet) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pet Not Found</h2>
        <button
          onClick={() => navigate('inventory')}
          className="text-pink-600 hover:text-pink-700 font-medium text-sm"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <button
        onClick={() => navigate('inventory')}
        className="text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Inventory
      </button>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Pet Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {pet.imageUrl ? (
                <img 
                  src={pet.imageUrl} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl">
                  {pet.species === 'Dog' ? '🐕' : '🐱'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">{pet.breed || 'Mixed Breed'}</p>
                </div>
                <span
                  className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                    pet.adoptionStatus === 'Available'
                      ? 'bg-green-100 text-green-700'
                      : pet.adoptionStatus === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {pet.adoptionStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pet Details */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Species</p>
              <p className="font-semibold text-gray-900">{pet.species}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Gender</p>
              <p className="font-semibold text-gray-900">{pet.gender}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Age</p>
              <p className="font-semibold text-gray-900">{pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Size</p>
              <p className="font-semibold text-gray-900">{pet.size || 'N/A'}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Color</h3>
              <p className="text-gray-900">{pet.color}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Views</h3>
              <p className="text-gray-900">{pet.views || 0} views</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-900 mb-3">About {pet.name}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{pet.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('edit-pet', pet._id)}
              className="bg-pink-600 text-white px-6 py-2.5 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit Pet Information
            </button>
            <button
              onClick={() => navigate('inventory')}
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Back to Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;