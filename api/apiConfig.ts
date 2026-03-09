import axios from 'axios';

const apiConfig = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
//   timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiConfig.interceptors.request.use(
  (config) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiZW1haWwiOiJwcmVkaWN0YWRtaW5AZ21haWwuY29tIiwicHJvdmlkZXIiOiJlbWFpbCIsInJvbGUiOiJBRE1JTiIsImF2YXRhcl91cmwiOiIiLCJhdmF0YXJfYmdfY29sb3IiOiIiLCJ0ZWFtX2lkIjpudWxsLCJpYXQiOjE3NzI5NjUxOTYsImV4cCI6MTc3ODIzNTU5Nn0.8uRP9Cu7knBoKEO47eYzxSaHqUTr6utxvQc27V_TcGM';
    // const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIiwiZW1haWwiOiJwcmVkaWN0YWRtaW5AZ21haWwuY29tIiwicHJvdmlkZXIiOiJlbWFpbCIsInJvbGUiOiJBRE1JTiIsImF2YXRhcl91cmwiOiIiLCJhdmF0YXJfYmdfY29sb3IiOiIiLCJ0ZWFtX2lkIjpudWxsLCJpYXQiOjE3NzI5NjUxOTYsImV4cCI6MTc3ODIzNTU5Nn0.8uRP9Cu7knBoKEO47eYzxSaHqUTr6utxvQc27V_TcGM";
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

// Response interceptor
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