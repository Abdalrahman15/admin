import api from '../authAPI';

export const progressAPI = {
  // Progress records
  getProgressRecords: async (params = {}) => {
    try {
      const response = await api.get('/progress', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getProgressRecord: async (progressId) => {
    try {
      const response = await api.get(`/progress/${progressId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  createProgressRecord: async (progressData) => {
    try {
      const response = await api.post('/progress', progressData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  updateProgressRecord: async (progressId, progressData) => {
    try {
      const response = await api.put(`/progress/${progressId}`, progressData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  deleteProgressRecord: async (progressId) => {
    try {
      const response = await api.delete(`/progress/${progressId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Progress Photos
  getProgressPhotos: async (progressId) => {
    try {
      const response = await api.get(`/progress/${progressId}/photos`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  addProgressPhoto: async (progressId, photoData) => {
    try {
      const response = await api.post(`/progress/${progressId}/photos`, photoData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  deleteProgressPhoto: async (progressId, photoId) => {
    try {
      const response = await api.delete(`/progress/${progressId}/photos/${photoId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Goals
  getGoals: async (params = {}) => {
    try {
      const response = await api.get('/goals', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getGoal: async (goalId) => {
    try {
      const response = await api.get(`/goals/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  createGoal: async (goalData) => {
    try {
      const response = await api.post('/goals', goalData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  updateGoal: async (goalId, goalData) => {
    try {
      const response = await api.put(`/goals/${goalId}`, goalData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  deleteGoal: async (goalId) => {
    try {
      const response = await api.delete(`/goals/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  completeGoal: async (goalId) => {
    try {
      const response = await api.post(`/goals/${goalId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Stats summary
  getStatsSummary: async (startDate, endDate) => {
    try {
      const response = await api.get(`/stats/summary?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Weight history
  getWeightHistory: async (startDate, endDate) => {
    try {
      const response = await api.get(`/stats/weight?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Workout stats
  getWorkoutStats: async (startDate, endDate) => {
    try {
      const response = await api.get(`/stats/workouts?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Nutrition stats
  getNutritionStats: async (startDate, endDate) => {
    try {
      const response = await api.get(`/stats/nutrition?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  }
};

export default progressAPI;