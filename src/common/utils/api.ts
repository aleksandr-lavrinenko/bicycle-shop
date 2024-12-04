import axios from 'axios';

const API_BASE = '/api'; // Replace with your actual API base URL

export const api = axios.create({
  baseURL: API_BASE,
});

export default api;
