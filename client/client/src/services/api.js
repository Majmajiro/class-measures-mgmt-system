// Working API service - replace your current api.js with this
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

console.log('🔧 API_BASE_URL configured as:', API_BASE_URL);

// Simple request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  console.log(`🔄 API Request: ${config.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, config);
    
    console.log(`📊 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error Response:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Success Response:`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Request Failed:`, error);
    throw error;
  }
};

// Students API
export const studentsAPI = {
  async getAll(filters = {}) {
    try {
      console.log('🔄 studentsAPI.getAll called');
      
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const endpoint = `/students${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiRequest(endpoint);
      
      console.log('✅ studentsAPI.getAll success:', {
        studentsCount: response.students?.length || 0,
        success: response.success
      });
      
      return {
        students: response.students || [],
        pagination: response.pagination,
        success: response.success
      };
    } catch (error) {
      console.error('❌ studentsAPI.getAll error:', error);
      throw error;
    }
  },

  async create(studentData) {
    try {
      console.log('🔄 studentsAPI.create called');
      
      const response = await apiRequest('/students', {
        method: 'POST',
        body: JSON.stringify(studentData)
      });
      
      console.log('✅ studentsAPI.create success');
      
      return {
        student: response.student,
        message: response.message,
        success: response.success
      };
    } catch (error) {
      console.error('❌ studentsAPI.create error:', error);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      console.log('🔄 studentsAPI.update called');
      
      const response = await apiRequest(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(studentData)
      });
      
      console.log('✅ studentsAPI.update success');
      
      return {
        student: response.student,
        message: response.message,
        success: response.success
      };
    } catch (error) {
      console.error('❌ studentsAPI.update error:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      console.log('🔄 studentsAPI.delete called');
      
      const response = await apiRequest(`/students/${id}`, {
        method: 'DELETE'
      });
      
      console.log('✅ studentsAPI.delete success');
      
      return {
        message: response.message,
        success: response.success
      };
    } catch (error) {
      console.error('❌ studentsAPI.delete error:', error);
      throw error;
    }
  }
};

// Simplified auth for testing
export const authAPI = {
  async login(credentials) {
    console.log('🔄 authAPI.login (fake)');
    
    const fakeUser = {
      _id: 'test123',
      name: 'Test User',
      email: credentials.email,
      role: 'admin'
    };
    
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(fakeUser));
    
    return {
      user: fakeUser,
      token: 'fake-token',
      message: 'Login successful',
      success: true
    };
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { message: 'Logout successful', success: true };
  },

  async register(userData) {
    return {
      user: { ...userData, _id: 'test123' },
      message: 'Registration successful',
      success: true
    };
  }
};

// Keep localStorage for other APIs temporarily
export const programsAPI = {
  async getAll() {
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    return { programs };
  },
  async create(programData) {
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    const newProgram = {
      ...programData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    programs.push(newProgram);
    localStorage.setItem('programs', JSON.stringify(programs));
    return { program: newProgram, message: 'Program created successfully' };
  },
  async update(id, programData) {
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    const index = programs.findIndex(p => p._id === id);
    if (index === -1) throw new Error('Program not found');
    programs[index] = { ...programs[index], ...programData };
    localStorage.setItem('programs', JSON.stringify(programs));
    return { program: programs[index], message: 'Program updated successfully' };
  },
  async delete(id) {
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    const filtered = programs.filter(p => p._id !== id);
    localStorage.setItem('programs', JSON.stringify(filtered));
    return { message: 'Program deleted successfully' };
  }
};

export const sessionsAPI = {
  async getAll() {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    return { sessions };
  },
  async create(sessionData) {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const newSession = { ...sessionData, _id: Date.now().toString() };
    sessions.push(newSession);
    localStorage.setItem('sessions', JSON.stringify(sessions));
    return { session: newSession, message: 'Session created successfully' };
  },
  async update(id, sessionData) {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const index = sessions.findIndex(s => s._id === id);
    if (index === -1) throw new Error('Session not found');
    sessions[index] = { ...sessions[index], ...sessionData };
    localStorage.setItem('sessions', JSON.stringify(sessions));
    return { session: sessions[index], message: 'Session updated successfully' };
  },
  async delete(id) {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const filtered = sessions.filter(s => s._id !== id);
    localStorage.setItem('sessions', JSON.stringify(filtered));
    return { message: 'Session deleted successfully' };
  }
};

export const resourcesAPI = {
  async getAll() {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    return { resources };
  },
  async create(resourceData) {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const newResource = { ...resourceData, _id: Date.now().toString() };
    resources.push(newResource);
    localStorage.setItem('resources', JSON.stringify(resources));
    return { resource: newResource, message: 'Resource created successfully' };
  },
  async update(id, resourceData) {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const index = resources.findIndex(r => r._id === id);
    if (index === -1) throw new Error('Resource not found');
    resources[index] = { ...resources[index], ...resourceData };
    localStorage.setItem('resources', JSON.stringify(resources));
    return { resource: resources[index], message: 'Resource updated successfully' };
  },
  async delete(id) {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const filtered = resources.filter(r => r._id !== id);
    localStorage.setItem('resources', JSON.stringify(filtered));
    return { message: 'Resource deleted successfully' };
  }
};

export const dataUtils = {
  clearAllData() {
    localStorage.clear();
    console.log('🧹 Cleared all data');
  },
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },
  isAuthenticated() {
    return !!(localStorage.getItem('token') && this.getCurrentUser());
  }
};