// API Configuration - Fixed to point to port 5001
const API_BASE = 'http://localhost:5001/api';

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  }
};

// Students API
export const studentsAPI = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  create: async (studentData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });
    return await response.json();
  },

  update: async (id, studentData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });
    return await response.json();
  },

  delete: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  getParents: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/students/parents`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }
};

// Programs API
export const programsAPI = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/programs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  create: async (programData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(programData)
    });
    return await response.json();
  },

  update: async (id, programData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/programs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(programData)
    });
    return await response.json();
  },

  delete: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/programs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  getTutors: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/programs/tutors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }
};

// Resources API
export const resourcesAPI = {
  getAll: async (params = {}) => {
    const token = localStorage.getItem('token');
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE}/resources?${queryString}` : `${API_BASE}/resources`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  create: async (resourceData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(resourceData)
    });
    return await response.json();
  },

  update: async (id, resourceData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/resources/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(resourceData)
    });
    return await response.json();
  },

  delete: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/resources/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  getAnalytics: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/resources/analytics/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  },

  createTest: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/resources/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  }
};

// Session Management API
export const sessionsAPI = {
  // Get all sessions
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/sessions${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Create new session
  create: async (sessionData) => {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    return response.json();
  },

  // Update session
  update: async (id, sessionData) => {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    return response.json();
  },

  // Delete session
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Get session attendance
  getAttendance: async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/attendance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
};

// Attendance Management API
export const attendanceAPI = {
  // Mark attendance
  markAttendance: async (sessionId, attendanceData) => {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, attendanceData }),
    });
    return response.json();
  },

  // Get attendance records
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/attendance${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
};
