"use client";
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8085/api', // Adjust to your Spring Boot port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;