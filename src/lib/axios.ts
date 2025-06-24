// src/lib/axios.ts
import axios from 'axios';

console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

// Her istekten önce token'ı güncelleyen request interceptor
api.interceptors.request.use(
    (config) => {
        console.log('Making API request to:', `${config.baseURL || ''}${config.url || ''}`);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.message, error.config?.url);
    if (error.response) {
      console.error('Error details:', error.response.status, error.response.data);
    } else {
      console.error('Network error - backend might be unreachable');
    }
    
    // Eğer 401 hatası alırsak ve bu bir login/register isteği değilse
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      console.warn('Unauthorized request – logging out user and redirecting.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      // Sayfa yönlendirmesi için window.location kullanıyoruz.
      // Daha sonra bunu React Router'ın useNavigate hook'u ile daha temiz hale getirebiliriz.
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;