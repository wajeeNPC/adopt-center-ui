import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Heart, Share2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getImageUrl } from '../lib/utils';

const PetDetail = () => {
  const { petId } = useParams();
  const { pets, navigate } = useAppContext();
  const pet = pets.find((p) => p._id === petId);
  const [activeImage, setActiveImage] = useState(0);

  if (!pet) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pet Not Found</h2>
        <button
          onClick={() => navigate('inventory')}
          className="text-pink-600 hover:text-pink-700 font-medium text-sm cursor-pointer"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  const allPhotos = pet.photos && pet.photos.length > 0 ? pet.photos : [pet.imageUrl || ''];

  return (
    <div>
      {/* Header */}
      <button
        onClick={() => navigate('inventory')}
        className="text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-2 text-sm font-medium cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Inventory
      </button>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Pet Header & Gallery */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Gallery */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden relative">
                {allPhotos[activeImage] ? (
                  <img
                    src={getImageUrl(allPhotos[activeImage])}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {pet.species === 'Dog' ? '🐕' : '🐱'}
                  </div>
                )}
              </div>
              {allPhotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allPhotos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer ${activeImage === index ? 'border-pink-500' : 'border-transparent'}`}
                    >
                      <img src={getImageUrl(photo)} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
                  <p className="text-lg text-gray-500 mt-1">{pet.breed || 'Mixed Breed'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${pet.adoptionStatus === 'Available'
                      ? 'bg-green-100 text-green-700'
                      : pet.adoptionStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {pet.adoptionStatus}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-pink-600 rounded-full hover:bg-pink-50 transition-colors cursor-pointer">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Species</p>
                  <p className="font-semibold text-gray-900">{pet.species}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Gender</p>
                  <p className="font-semibold text-gray-900">{pet.gender}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Age</p>
                  <p className="font-semibold text-gray-900">{pet.age} {pet.age === 1 ? 'Year' : 'Years'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Size</p>
                  <p className="font-semibold text-gray-900">{pet.size || 'N/A'}</p>
                </div>
              </div>

              {/* Characteristics */}
              <div className="flex flex-wrap gap-2 mb-8">
                {pet.goodWithKids && <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">Good with Kids</span>}
                {pet.goodWithPets && <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Good with Pets</span>}
                {pet.vaccinated && <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Vaccinated</span>}
                {pet.houseTrained && <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">House Trained</span>}
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{pet.energyLevel} Energy</span>
              </div>

              <div className="prose prose-sm max-w-none text-gray-600 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About {pet.name}</h3>
                <p>{pet.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('edit-pet', pet._id)}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  Edit Pet Information
                </button>
                {/* Adopt Link - In a real app this might go to a public page, but here we can link to 'applications' or just show a modal? 
                    The plan says: link to adoption application flow (potentially redirecting to /adoption/apply/:petId).
                    Since this is the ADMIN/CENTER view, maybe "Start Application"?
                    Or simply navigate to a new application form pre-filled?
                    For now, I'll add a button that could conceptually launch it.
                 */}
                <button
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium shadow-md shadow-pink-200 cursor-pointer"
                  onClick={() => alert("To start an adoption application, please use the Public Portal or go to Applications > New Application.")}
                >
                  Start Adoption Process
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details (Bottom) */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
          <span>ID: {pet._id}</span>
          <span>Added: {new Date(pet.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;