import React, { useState } from 'react';
import { Dog, Cat, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AddPet = () => {
  const { addPet, navigate } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    size: 'Medium',
    color: '',
    age: '',
    description: '',
    adoptionFee: 0,
    goodWithKids: null,
    goodWithPets: null,
    vaccinated: false,
    neutered: false,
    energyLevel: 'Moderate'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await addPet({
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        gender: formData.gender,
        size: formData.size,
        color: formData.color,
        age: parseInt(formData.age) || 0,
        description: formData.description,
        adoptionFee: parseFloat(formData.adoptionFee) || 0,
        goodWithKids: formData.goodWithKids,
        goodWithPets: formData.goodWithPets,
        vaccinated: formData.vaccinated,
        neutered: formData.neutered,
        energyLevel: formData.energyLevel
      });
    } catch (error) {
      console.error('Error submitting pet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Pet</h1>
        <p className="text-sm text-gray-500">Fill in the details to add a new pet</p>
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
              placeholder="e.g., Buddy"
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
              placeholder="e.g., Golden Retriever"
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
              placeholder="e.g., Golden"
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
              placeholder="e.g., 2"
            />
          </div>

          {/* Adoption Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adoption Fee ($)
            </label>
            <input
              type="number"
              name="adoptionFee"
              value={formData.adoptionFee}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., 250"
            />
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
              placeholder="Tell us about this pet's personality and characteristics..."
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
            {isSubmitting ? 'Saving...' : 'Save Pet'}
          </button>
          <button
            onClick={() => navigate('inventory')}
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

export default AddPet;