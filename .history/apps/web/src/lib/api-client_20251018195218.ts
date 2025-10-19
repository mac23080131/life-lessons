import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: async (data: { email: string; password: string; name?: string }) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  
  getMe: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },
};

// Lessons API
export const lessonsApi = {
  getAll: async (params?: {
    q?: string;
    domain?: string;
    tag?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await apiClient.get('/lessons', { params });
    return response.data;
  },
  
  getOne: async (id: string) => {
    const response = await apiClient.get(`/lessons/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/lessons', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await apiClient.patch(`/lessons/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(`/lessons/${id}`);
    return response.data;
  },
  
  analyze: async (id: string) => {
    const response = await apiClient.post(`/ai/lessons/${id}/analyze`);
    return response.data;
  },
  
  createShareLink: async (id: string) => {
    const response = await apiClient.post(`/lessons/${id}/share`);
    return response.data;
  },
};

// Goals API
export const goalsApi = {
  getMy: async () => {
    const response = await apiClient.get('/goals');
    return response.data;
  },
  
  create: async (data?: { target?: number; sprintSize?: number; cadence?: string }) => {
    const response = await apiClient.post('/goals', data || { target: 10000, sprintSize: 100, cadence: 'daily' });
    return response.data;
  },
  
  update: async (id: string, data: { target?: number; sprintSize?: number; cadence?: string; status?: string }) => {
    const response = await apiClient.patch(`/goals/${id}`, data);
    return response.data;
  },
  
  getRoadmap: async (id: string) => {
    const response = await apiClient.get(`/goals/${id}/roadmap`);
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  getOverview: async () => {
    const response = await apiClient.get('/analytics/overview');
    return response.data;
  },
};

// Community API
export const communityApi = {
  getPublicFeed: async (params?: { limit?: number; offset?: number }) => {
    const response = await apiClient.get('/community/feed', { params });
    return response.data;
  },
  
  reactToLesson: async (lessonId: string, type: string) => {
    const response = await apiClient.post(`/community/lessons/${lessonId}/react`, { type });
    return response.data;
  },
  
  reportLesson: async (lessonId: string, reason?: string) => {
    const response = await apiClient.post(`/community/lessons/${lessonId}/report`, { reason });
    return response.data;
  },
  
  getChallenges: async () => {
    const response = await apiClient.get('/community/challenges');
    return response.data;
  },
  
  joinChallenge: async (challengeId: string) => {
    const response = await apiClient.post(`/community/challenges/${challengeId}/join`);
    return response.data;
  },
  
  getMyChallenges: async () => {
    const response = await apiClient.get('/community/my-challenges');
    return response.data;
  },
};

// Groups API
export const groupsApi = {
  getMyGroups: async () => {
    const response = await apiClient.get('/groups');
    return response.data;
  },
  
  createGroup: async (name: string) => {
    const response = await apiClient.post('/groups', { name });
    return response.data;
  },
  
  getGroup: async (id: string) => {
    const response = await apiClient.get(`/groups/${id}`);
    return response.data;
  },
  
  getLeaderboard: async (id: string) => {
    const response = await apiClient.get(`/groups/${id}/leaderboard`);
    return response.data;
  },
  
  joinGroup: async (id: string, code: string) => {
    const response = await apiClient.post(`/groups/${id}/join`, { code });
    return response.data;
  },
  
  leaveGroup: async (id: string) => {
    const response = await apiClient.delete(`/groups/${id}/leave`);
    return response.data;
  },
  
  deleteGroup: async (id: string) => {
    const response = await apiClient.delete(`/groups/${id}`);
    return response.data;
  },
};
