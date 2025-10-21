// src/utils/axiosAuth.js
import axios from 'axios';

const BASE_URL = '/api'; // Update to your backend

export const axiosAuth = () => {
  const token = localStorage.getItem('authToken');

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

    
  if (token) {
  
    instance.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(token)}`;
  
  }


  return instance;
};

export const axiosPublic = axios.create({
    baseURL: BASE_URL, // Use the same base URL as axiosAuth()
    headers: {
        'Content-Type': 'application/json',
    },
});