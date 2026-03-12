import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiConfig = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiConfig.interceptors.request.use(
  async(config) => {
    const session = await getSession()
    const token = session?.user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

apiConfig.interceptors.response.use(
  (response) => { 
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Response Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }
    
    if (!error.response) {
      console.error('Network Error: Please check your connection');
    } else {
      const { status } = error.response;
      switch (status) {
        case 401:
          console.warn('Unauthorized access - redirecting to login');
          break;
        case 403:
          console.warn('Access forbidden');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Server error - please try again later');
          break;
        default:
          console.error(`Error ${status}: ${error.message}`);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiConfig;