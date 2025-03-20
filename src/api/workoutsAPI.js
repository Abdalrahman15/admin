import api from '../authAPI';

export const workoutsAPI = {
  // Workout Plans
  getWorkoutPlans: async () => {
    try {
      const response = await api.get('/workoutplans');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getWorkoutPlan: async (planId) => {
    try {
      const response = await api.get(`/workoutplans/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  createWorkoutPlan: async (planData) => {
    try {
      const response = await api.post('/workoutplans', planData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  updateWorkoutPlan: async (planId, planData) => {
    try {
      const response = await api.put(`/workoutplans/${planId}`, planData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  deleteWorkoutPlan: async (planId) => {
    try {
      const response = await api.delete(`/workoutplans/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Workouts
  getWorkouts: async () => {
    try {
      const response = await api.get('/workouts');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getWorkout: async (workoutId) => {
    try {
      const response = await api.get(`/workouts/${workoutId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const response = await api.post('/workouts', workoutData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  updateWorkout: async (workoutId, workoutData) => {
    try {
      const response = await api.put(`/workouts/${workoutId}`, workoutData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  deleteWorkout: async (workoutId) => {
    try {
      const response = await api.delete(`/workouts/${workoutId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  completeWorkout: async (workoutId, completionData) => {
    try {
      const response = await api.post(`/workouts/${workoutId}/complete`, completionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Exercises
  getExercises: async (params = {}) => {
    try {
      const response = await api.get('/exercises', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getExercise: async (exerciseId) => {
    try {
      const response = await api.get(`/exercises/${exerciseId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getExerciseCategories: async () => {
    try {
      const response = await api.get('/exercises/categories');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getMuscleGroups: async () => {
    try {
      const response = await api.get('/exercises/musclegroups');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  }
};

export default workoutsAPI;