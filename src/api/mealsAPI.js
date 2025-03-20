import api from '../authAPI';

export const mealsAPI = {
  // Meal Plans
  getMealPlans: async () => {
    try {
      const response = await api.get('/mealplans');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getMealPlan: async (planId) => {
    try {
      const response = await api.get(`/mealplans/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  createMealPlan: async (planData) => {
    try {
      const response = await api.post('/mealplans', planData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  updateMealPlan: async (planId, planData) => {
    try {
      const response = await api.put(`/mealplans/${planId}`, planData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  deleteMealPlan: async (planId) => {
    try {
      const response = await api.delete(`/mealplans/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Meals
  getMeals: async (planId) => {
    try {
      const response = await api.get(`/mealplans/${planId}/meals`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getMeal: async (mealId) => {
    try {
      const response = await api.get(`/meals/${mealId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  createMeal: async (planId, mealData) => {
    try {
      const response = await api.post(`/mealplans/${planId}/meals`, mealData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  updateMeal: async (mealId, mealData) => {
    try {
      const response = await api.put(`/meals/${mealId}`, mealData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  deleteMeal: async (mealId) => {
    try {
      const response = await api.delete(`/meals/${mealId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  completeMeal: async (mealId) => {
    try {
      const response = await api.post(`/meals/${mealId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Foods
  getFoods: async (params = {}) => {
    try {
      const response = await api.get('/foods', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getFood: async (foodId) => {
    try {
      const response = await api.get(`/foods/${foodId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  searchFoods: async (query) => {
    try {
      const response = await api.get(`/foods/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  getFoodCategories: async () => {
    try {
      const response = await api.get('/foods/categories');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  // Water Intake
  getWaterIntake: async (date) => {
    try {
      const response = await api.get(`/waterintake?date=${date}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  addWaterIntake: async (intakeData) => {
    try {
      const response = await api.post('/waterintake', intakeData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  updateWaterIntake: async (intakeId, intakeData) => {
    try {
      const response = await api.put(`/waterintake/${intakeId}`, intakeData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  },

  deleteWaterIntake: async (intakeId) => {
    try {
      const response = await api.delete(`/waterintake/${intakeId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Network error';
    }
  }
};

export default mealsAPI;