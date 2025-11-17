import axios from 'axios';

// Update this to match the port your backend is actually using
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// ---- Interceptors ----
// Add token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData (browser will set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token on 401 response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if it's already a retry or if it's a login/register request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to avoid infinite loops
      if (originalRequest.url?.includes('/login') || 
          originalRequest.url?.includes('/register') ||
          originalRequest.url?.includes('/refresh_access_token')) {
        localStorage.removeItem('accessToken');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await axios.get(`${API_BASE_URL}/user/refresh_access_token`, {
          withCredentials: true,
        });

        const { accessToken } = response.data.data;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ---- Auth APIs ----
export const authAPI = {
  register: (userData) => api.post('/user/register_user', userData),
  login: (credentials) => api.post('/user/login_user', credentials),
  logout: () => api.get('/user/logout_user'),
  getProfile: () => api.get('/user/get_user_profile'),
  updateProfile: (formData) => api.put('/user/update_user_profile', formData),
  getAllUsers: () => api.get('/user/get_all_users'),
};

// ---- Post APIs ----
export const postAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/posts/all?page=${page}&limit=${limit}`),
  getById: (postId) => api.get(`/posts/${postId}`),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  create: (formData) => 
    api.post('/posts/create', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    }),
  update: (postId, formData) => 
    api.put(`/posts/${postId}`, formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    }),
  delete: (postId) => api.delete(`/posts/${postId}`),
  like: (postId) => api.post(`/posts/${postId}/like`),
  getByTag: (tag) => api.get(`/posts/tag/${tag}`),
};

// ---- Comment APIs ----
export const commentAPI = {
  getByPost: (postId) => api.get(`/comments/post/${postId}`),
  create: (postId, text) => api.post(`/comments/post/${postId}`, { text }),
  update: (commentId, text) => api.put(`/comments/${commentId}`, { text }),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
};

// ---- Event APIs ----
export const eventAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/events/all?page=${page}&limit=${limit}`),
  getUpcoming: () => api.get('/events/upcoming'),
  getById: (eventId) => api.get(`/events/${eventId}`),
  create: (eventData) => api.post('/events/create', eventData),
  update: (eventId, eventData) => api.put(`/events/${eventId}`, eventData),
  delete: (eventId) => api.delete(`/events/${eventId}`),
  attend: (eventId) => api.post(`/events/${eventId}/attend`),
};

// ---- Resource APIs (final and fixed) ----
export const resourceAPI = {
  upload: (formData) => {
    const token = localStorage.getItem('accessToken');
    return api.post('/resources/upload', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
  },
  getAll: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters });
    return api.get(`/resources/all?${params}`);
  },
  getById: (resourceId) => api.get(`/resources/${resourceId}`),
  getByCourse: (courseId) => api.get(`/resources/course/${courseId}`),
  getUserResources: (userId) => api.get(`/resources/user/${userId}`),
  update: (resourceId, data) => api.put(`/resources/${resourceId}`, data),
  delete: (resourceId) => api.delete(`/resources/${resourceId}`),
};

// ---- Poll APIs ----
export const pollAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/polls/all?page=${page}&limit=${limit}`),
  getActive: () => api.get('/polls/active'),
  getById: (pollId) => api.get(`/polls/${pollId}`),
  create: (pollData) => api.post('/polls/create', pollData),
  update: (pollId, pollData) => api.put(`/polls/${pollId}`, pollData),
  delete: (pollId) => api.delete(`/polls/${pollId}`),
  vote: (pollId, optionIndex) => api.post(`/polls/${pollId}/vote`, { optionIndex }),
};

export default api;
