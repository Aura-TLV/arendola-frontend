// src/lib/http.js
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const http = axios.create({ baseURL: API_BASE_URL });
