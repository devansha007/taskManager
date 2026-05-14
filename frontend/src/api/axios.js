import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
  // 'http://127.0.0.1:8000/api',  // your Django backend
});

// Before every request — automatically attach the token
// so you never have to manually add Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a response comes back as 401 (token expired)
// automatically get a new token and retry the request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh');
        const res = await axios.post(
             `${process.env.REACT_APP_API_URL}/auth/refresh/`,
              { refresh }

        );
        localStorage.setItem('access', res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);  // retry the original request
      } catch {
        // refresh also failed — log out
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Clean API functions — import and call these anywhere in your app
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login:    (data) => api.post('/auth/login/', data),
  me:       ()     => api.get('/auth/me/'),
};

export const tasksAPI = {
  list:     (params) => api.get('/tasks/', { params }),
  create:   (data)   => api.post('/tasks/', data),
  update:   (id, data) => api.patch(`/tasks/${id}/`, data),
  delete:   (id)     => api.delete(`/tasks/${id}/`),
  complete: (id)     => api.post(`/tasks/${id}/complete/`),
  urgent:   ()       => api.get('/tasks/urgent/'),
  stats:    ()       => api.get('/tasks/stats/'),
};

export default api;