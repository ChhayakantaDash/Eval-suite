import axios from 'axios';
import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';



// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // if backend uses credentials
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// API functions

// Juries
export const juriesAPI = {
  getAll: () => api.get('/api/juries'),
  create: (data) => api.post('/api/juries', data),
  getByName: (name) => api.get(`/api/juries/${encodeURIComponent(name)}`),
  updateStatus: (name, data) => api.put(`/api/juries/${encodeURIComponent(name)}`, data),
  delete: (name) => api.delete(`/api/juries/${encodeURIComponent(name)}`),
};

// Teams
export const teamsAPI = {
  getAll: () => api.get('/api/teams'),
  create: (data) => api.post('/api/teams', data),
  update: (id, data) => api.put(`/api/teams/${id}`, data),
  delete: (id) => api.delete(`/api/teams/${id}`),
  getByName: (name) => api.get(`/api/teams/name/${encodeURIComponent(name)}`),
};

// Marks
export const marksAPI = {
  save: (juryName, data) => api.post(`/api/marks/${encodeURIComponent(juryName)}`, data),
  getByJury: (juryName) => api.get(`/api/marks/${encodeURIComponent(juryName)}`),
  getAll: () => api.get('/api/marks/all'),
  getLeaderboard: () => api.get('/api/marks/leaderboard'),
  getStatus: () => api.get('/api/marks/status'),
};

// Export
export const exportAPI = {
  juryExcel: (juryName) => {
    window.open(`${API_BASE_URL}/api/export/jury/${encodeURIComponent(juryName)}`, '_blank');
  },
  leaderboardExcel: () => {
    window.open(`${API_BASE_URL}/api/export/leaderboard`, '_blank');
  },
};

// Config
export const configAPI = {
  get: () => api.get('/api/config'),
  update: (data) => api.post('/api/config', data),
  reset: () => api.post('/api/config/reset'),
};

const API_BASE = '/api/config';

// After
export const getCriteria = () => api.get('/api/config/criteria');
export const addCriteria = (criterion) => api.post('/api/config/criteria', { criterion });
export const removeCriteria = (index) => api.delete('/api/config/criteria', { data: { index } });


export default api;
