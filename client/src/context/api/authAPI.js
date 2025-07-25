// src/api/authAPI.js
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;
console.log("Base API URL:", API);


// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally add token to each request (if needed in future)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login user
const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

// Register user
const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  register,
};
