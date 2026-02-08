import React, { useState, useEffect } from 'react';
import { Dog, Cat, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const EditPet = () => {
  const { pets, updatePet, navigate, selectedPetId } = useAppContext();
  const pet = pets.find((p) => p._id === selectedPetId);
  const [formData, setFormData] = useState(pet || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pet) {
      setFormData(pet);
    }
  }, [pet]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.breed.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updatePet(selectedPetId, {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        gender: formData.gender,
        size: formData.size,
        color: formData.color,
        age: parseInt(formData.age) || 0,
        description: formData.description,
        adoptionFee: parseFloat(formData.adoptionFee) || 0,
        adoptionStatus: formData.adoptionStatus,
        goodWithKids: formData.goodWithKids,
        goodWithPets: formData.goodWithPets,
        vaccinated: formData.vaccinated,
        neutered: formData.neutered,
        energyLevel: formData.energyLevel
      });
    } catch (error) {
      console.error('Error updating pet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <button
        onClick={() => navigate('pet-detail', selectedPetId)}
        className="text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Pet Details
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Pet</h1>
        <p className="text-sm text-gray-500">Update {formData.name}'s information</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pet Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pet Name <span className="text-pink-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Species */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Species <span className="text-pink-600">*</span>
            </label>
            <div className="flex gap-4 mt-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="species"
                  value="Dog"
                  checked={formData.species === 'Dog'}
                  onChange={handleChange}
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                />
                <Dog className="w-4 h-4 ml-2 mr-1 text-gray-600" />
                <span className="text-sm text-gray-700">Dog</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="species"
                  value="Cat"
                  checked={formData.species === 'Cat'}
                  onChange={handleChange}
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                />
                <Cat className="w-4 h-4 ml-2 mr-1 text-gray-600" />
                <span className="text-sm text-gray-700">Cat</span>
              </label>
            </div>
          </div>

          {/* Breed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breed <span className="text-pink-600">*</span>
            </label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-pink-600">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size <span className="text-pink-600">*</span>
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color <span className="text-pink-600">*</span>
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age (years) <span className="text-pink-600">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adoption Status <span className="text-pink-600">*</span>
            </label>
            <select
              name="adoptionStatus"
              value={formData.adoptionStatus}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option>Available</option>
              <option>Pending</option>
              <option>Adopted</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-pink-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-pink-600 text-white px-6 py-2.5 rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Pet'}
          </button>
          <button
            onClick={() => navigate('pet-detail', selectedPetId)}
            type="button"
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPet;