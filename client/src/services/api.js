const API_BASE = 'http://localhost:5001/api';

const getToken = () => {
  return localStorage.getItem('token');
};

// Students API
export const studentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/students${queryString ? `?${queryString}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  create: async (studentData) => {
    const response = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return response.json();
  },

  update: async (id, studentData) => {
    const response = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
};

// Programs API
export const programsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/programs`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  create: async (programData) => {
    const response = await fetch(`${API_BASE}/programs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    });
    return response.json();
  },

  createTest: async () => {
    const response = await fetch(`${API_BASE}/programs/create-test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
};

// Resources API
export const resourcesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/resources`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  create: async (resourceData) => {
    const response = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resourceData),
    });
    return response.json();
  },

  createTest: async () => {
    const response = await fetch(`${API_BASE}/resources/create-test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
};

// Sessions API  
export const sessionsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/sessions${queryString ? `?${queryString}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  create: async (sessionData) => {
    const response = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    return response.json();
  },

  update: async (id, sessionData) => {
    const response = await fetch(`${API_BASE}/sessions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/sessions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }
};

