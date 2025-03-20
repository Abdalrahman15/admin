import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import MealDetail from '../components/meals/MealDetail.jsx';
import FoodSearch from '../components/meals/FoodSearch.jsx';
import MealsList from '../components/meals/MealsList.jsx';
import MealForm from '../components/meals/MealForm.jsx';
import { mealsAPI } from '../api/mealsAPI';
import { toast } from 'react-toastify';



export default function MealsPage() {
   const [mealPlans, setMealPlans] = useState([]);
    const [activePlan, setActivePlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchMealPlans = async () => {
        try {
          setLoading(true);
          const plans = await mealsAPI.getMealPlans();
          setMealPlans(plans);
          
          // Set active plan to the most recent or create a default one
          if (plans.length > 0) {
            const currentPlan = plans.find(plan => {
              const now = new Date();
              const startDate = new Date(plan.startDate);
              const endDate = plan.endDate ? new Date(plan.endDate) : null;
              return startDate <= now && (!endDate || endDate >= now);
            }) || plans[0];
            
            setActivePlan(currentPlan);
          }
        } catch (error) {
          toast.error('Failed to load meal plans');
          console.error('Error fetching meal plans:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMealPlans();
    }, []);
  
    const handleCreateMealPlan = () => {
      navigate('/meals/plan/new');
    };
  
    const handleSelectPlan = (planId) => {
      const selected = mealPlans.find(plan => plan.planId === planId);
      setActivePlan(selected);
    };

  return <>
 <div className="meals-page">
      <div className="meals-header">
        <h1>Nutrition Tracking</h1>
        <div className="meals-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleCreateMealPlan}
          >
            <i className="fas fa-plus"></i> New Meal Plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading meal plans...</p>
        </div>
      ) : (
        <>
          {mealPlans.length > 0 ? (
            <div className="meal-plan-selector">
              <label htmlFor="meal-plan-select">Select Meal Plan:</label>
              <select 
                id="meal-plan-select"
                value={activePlan?.planId || ''}
                onChange={(e) => handleSelectPlan(Number(e.target.value))}
              >
                {mealPlans.map(plan => (
                  <option key={plan.planId} value={plan.planId}>
                    {plan.name} ({plan.startDate ? new Date(plan.startDate).toLocaleDateString() : 'No start date'})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-utensils"></i>
              <h2>No Meal Plans Yet</h2>
              <p>Create your first meal plan to start tracking your nutrition</p>
              <button 
                className="btn btn-primary" 
                onClick={handleCreateMealPlan}
              >
                Create Meal Plan
              </button>
            </div>
          )}

          {activePlan && (
            <div className="meal-plan-summary">
              <h2>{activePlan.name}</h2>
              <div className="meal-plan-stats">
                <div className="stat">
                  <span className="label">Daily Calories:</span>
                  <span className="value">{activePlan.dailyCalorieTarget || 'Not set'}</span>
                </div>
                <div className="stat">
                  <span className="label">Diet Type:</span>
                  <span className="value">{activePlan.dietType || 'Not specified'}</span>
                </div>
                <div className="nutrition-targets">
                  <div className="macro-target">
                    <span className="macro-label">Protein</span>
                    <span className="macro-value">{activePlan.proteinTarget || '-'}g</span>
                  </div>
                  <div className="macro-target">
                    <span className="macro-label">Carbs</span>
                    <span className="macro-value">{activePlan.carbTarget || '-'}g</span>
                  </div>
                  <div className="macro-target">
                    <span className="macro-label">Fat</span>
                    <span className="macro-value">{activePlan.fatTarget || '-'}g</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Routes>
        <Route 
          path="/" 
          element={
            <MealsList 
              activePlanId={activePlan?.planId} 
              isLoading={loading}
            />
          } 
        />
        <Route path="/plan/new" element={<MealForm isNewPlan={true} />} />
        <Route path="/plan/:planId/edit" element={<MealForm isNewPlan={false} />} />
        <Route path="/:mealId" element={<MealDetail />} />
        <Route path="/new" element={<MealForm planId={activePlan?.planId} />} />
        <Route path="/:mealId/edit" element={<MealForm />} />
        <Route path="/foods" element={<FoodSearch />} />
      </Routes>
    </div>
  </>
  
}
