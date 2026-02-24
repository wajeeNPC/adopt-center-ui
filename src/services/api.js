const API_BASE_URL = 'http://localhost:5000/api/v1/adoption-center';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers
const createHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Auth API
export const authAPI = {
  // Signup adoption center
  signup: async (data) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Signup failed');
    }

    return result;
  },

  // Login adoption center
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get stored user data
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getToken();
  },
};

// Pet API
export const petAPI = {
  // Create a new pet
  create: async (petData) => {
    // Check if petData is FormData (for file uploads)
    const isFormData = petData instanceof FormData;
    
    // For FormData, we need to exclude Content-Type header to let browser set it with boundary
    const token = getToken();
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Only set Content-Type for JSON data
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: headers,
      body: isFormData ? petData : JSON.stringify(petData),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create pet');
    }

    return result;
  },

  // Get all pets
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_BASE_URL}/pets?${queryParams}` : `${API_BASE_URL}/pets`;

    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(true),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch pets');
    }

    return result;
  },

  // Get pet by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch pet');
    }

    return result;
  },

  // Update pet
  update: async (id, petData) => {
    const isFormData = petData instanceof FormData;
    const headers = createHeaders(true);

    if (isFormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'PUT',
      headers: headers,
      body: isFormData ? petData : JSON.stringify(petData),
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', await response.text());
      throw new Error('Server returned non-JSON response');
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update pet');
    }

    return result;
  },

  // Delete pet
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete pet');
    }

    return result;
  },

  // Remove photo from pet
  removePhoto: async (id, photoUrl) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/remove-photo`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ photoUrl }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to remove photo');
    }

    return result;
  },
};

// Application API
export const applicationAPI = {
  // Get center applications
  getCenterApplications: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_BASE_URL}/applications?${queryParams}` : `${API_BASE_URL}/applications`;

    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(true),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch applications');
    }
    return result;
  },

  // Review application
  review: async (id, status, reviewNotes) => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/review`, {
      method: 'PATCH',
      headers: createHeaders(true),
      body: JSON.stringify({ status, reviewNotes }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to review application');
    }
    return result;
  }
};

export const resourcesAPI = {
  getBreeds: async (species = null) => {
    // Resources endpoint is at /api/v1/resources, not under adoption-center
    const baseUrl = 'http://localhost:5000/api/v1/resources';
    const url = species 
      ? `${baseUrl}/breeds?species=${encodeURIComponent(species)}`
      : `${baseUrl}/breeds`;
    const response = await fetch(url, {
      headers: createHeaders(true)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch breeds');
    return result;
  }
};

export default {
  auth: authAPI,
  pet: petAPI,
  applications: applicationAPI,
  resources: resourcesAPI
};
