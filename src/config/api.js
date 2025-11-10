// src/config/api.js
export const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8000';

export const AUTH_ENDPOINTS = {
  login:    '/auth/login/',
  register: '/auth/register/',
  refresh:  '/auth/jwt/refresh/',
  me:       '/auth/me/',
  logout:   '/auth/logout/',
};
