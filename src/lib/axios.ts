// src/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

// Her istekten önce token'ı güncelleyen request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
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