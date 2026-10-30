import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://staging.fastor.ai/v1';

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// Request Interceptor: Attach Bearer Token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fastor_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Unauthorized handling & error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('fastor_auth_token');
      localStorage.removeItem('fastor_user_phone');
      // Dispatch custom event for AuthContext to pick up immediately without window reload
      window.dispatchEvent(new Event('fastor_auth_unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
