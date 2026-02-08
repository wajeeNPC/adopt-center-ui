import React, { createContext, useState, useContext, useEffect } from 'react';
import { petAPI } from '../services/api';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const navigate = (page, petId = null) => {
    setCurrentPage(page);
    setSelectedPetId(petId);
    window.scrollTo(0, 0);
  };

  // Fetch all pets from API
  const fetchPets = async () => {
    try {
      setLoading(true);
      const result = await petAPI.getAll();
      setPets(result.data || []);
    } catch (error) {
      showToast(error.message || 'Failed to load pets', 'error');
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load pets on mount
  useEffect(() => {
    fetchPets();
  }, []);

  const addPet = async (petData) => {
    try {
      setLoading(true);
      const result = await petAPI.create(petData);
      setPets(prev => [...prev, result.data]);
      showToast(`${petData.name} has been added to the system!`);
      navigate('inventory');
      return result.data;
    } catch (error) {
      showToast(error.message || 'Failed to add pet', 'error');
      console.error('Error adding pet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (id) => {
    try {
      setLoading(true);
      const pet = pets.find(p => p._id === id);
      await petAPI.delete(id);
      setPets(prev => prev.filter(p => p._id !== id));
      showToast(`${pet?.name || 'Pet'} has been removed from the system.`, 'info');
    } catch (error) {
      showToast(error.message || 'Failed to delete pet', 'error');
      console.error('Error deleting pet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePet = async (id, updatedData) => {
    try {
      setLoading(true);
      const result = await petAPI.update(id, updatedData);
      setPets(prev => prev.map(p => (p._id === id ? result.data : p)));
      showToast(`${updatedData.name} has been updated!`);
      navigate('inventory');
      return result.data;
    } catch (error) {
      showToast(error.message || 'Failed to update pet', 'error');
      console.error('Error updating pet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    pets,
    addPet,
    deletePet,
    updatePet,
    fetchPets,
    toast,
    currentPage,
    navigate,
    selectedPetId,
    loading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};