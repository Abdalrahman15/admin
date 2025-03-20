import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mealsAPI } from '../../api/mealsAPI';
import FoodSearch from './FoodSearch';
import { toast } from 'react-toastify';
export default function MealForm({ isNewPlan, planId: propPlanId }) {
  const { mealId, planId: paramPlanId } = useParams();
    const navigate = useNavigate();
    const currentPlanId = propPlanId || paramPlanId;
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showFoodSearch, setShowFoodSearch] = useState(false);
    
    // For meal plan form
    const [planForm, setPlanForm] = useState({
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      dailyCalorieTarget: '',
      proteinTarget: '',
      carbTarget: '',
      fatTarget: '',
      dietType: '',
      isPublic: false
    });
  
    // For meal form
    const [mealForm, setMealForm] = useState({
      name: '',
      type: 'Meal',
      scheduleTime: new Date().toISOString().split('T')[0] + 'T12:00',
      notes: '',
      imageUrl: '',
      foods: []
    });
  
    // For editing existing meal or plan
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          if (isNewPlan) {
            // New meal plan - no data to fetch
            setLoading(false);
            return;
          }
          
          if (mealId) {
            // Editing existing meal
            const mealData = await mealsAPI.getMeal(mealId);
            
            setMealForm({
              name: mealData.name || '',
              type: mealData.type || 'Meal',
              scheduleTime: mealData.scheduleTime 
                ? new Date(mealData.scheduleTime).toISOString().slice(0, 16) 
                : new Date().toISOString().split('T')[0] + 'T12:00',
              notes: mealData.notes || '',
              imageUrl: mealData.imageUrl || '',
              foods: mealData.foods || []
            });
          } else if (paramPlanId && !isNewPlan) {
            // Editing existing meal plan
            const planData = await mealsAPI.getMealPlan(paramPlanId);
            
            setPlanForm({
              name: planData.name || '',
              description: planData.description || '',
              startDate: planData.startDate 
                ? new Date(planData.startDate).toISOString().split('T')[0] 
                : new Date().toISOString().split('T')[0],
              endDate: planData.endDate 
                ? new Date(planData.endDate).toISOString().split('T')[0] 
                : '',
              dailyCalorieTarget: planData.dailyCalorieTarget || '',
              proteinTarget: planData.proteinTarget || '',
              carbTarget: planData.carbTarget || '',
              fatTarget: planData.fatTarget || '',
              dietType: planData.dietType || '',
              isPublic: planData.isPublic || false
            });
          }
        } catch (error) {
          toast.error('Failed to load data');
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [mealId, paramPlanId, isNewPlan]);
  
    // Handle plan form changes
    const handlePlanChange = (e) => {
      const { name, value, type, checked } = e.target;
      setPlanForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
  
    // Handle meal form changes
    const handleMealChange = (e) => {
      const { name, value, type, checked } = e.target;
      setMealForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
  
    // Handle submitting meal plan
    const handlePlanSubmit = async (e) => {
      e.preventDefault();
      
      try {
        setSubmitting(true);
        
        const planData = {
          ...planForm,
          dailyCalorieTarget: planForm.dailyCalorieTarget ? parseInt(planForm.dailyCalorieTarget) : null,
          proteinTarget: planForm.proteinTarget ? parseFloat(planForm.proteinTarget) : null,
          carbTarget: planForm.carbTarget ? parseFloat(planForm.carbTarget) : null,
          fatTarget: planForm.fatTarget ? parseFloat(planForm.fatTarget) : null
        };
        
        if (isNewPlan) {
          // Create new plan
          const newPlan = await mealsAPI.createMealPlan(planData);
          toast.success('Meal plan created successfully');
          navigate(`/meals`);
        } else {
          // Update existing plan
          await mealsAPI.updateMealPlan(paramPlanId, planData);
          toast.success('Meal plan updated successfully');
          navigate(`/meals`);
        }
      } catch (error) {
        toast.error('Failed to save meal plan');
        console.error('Error saving meal plan:', error);
      } finally {
        setSubmitting(false);
      }
    };
  
    // Handle submitting meal
    const handleMealSubmit = async (e) => {
      e.preventDefault();
      
      if (!currentPlanId) {
        toast.error('No meal plan selected');
        return;
      }
      
      try {
        setSubmitting(true);
        
        const mealData = {
          ...mealForm,
          planId: parseInt(currentPlanId)
        };
        
        if (mealId) {
          // Update existing meal
          await mealsAPI.updateMeal(mealId, mealData);
          toast.success('Meal updated successfully');
          navigate(`/meals/${mealId}`);
        } else {
          // Create new meal
          const newMeal = await mealsAPI.createMeal(currentPlanId, mealData);
          toast.success('Meal added successfully');
          navigate(`/meals/${newMeal.mealId}`);
        }
      } catch (error) {
        toast.error('Failed to save meal');
        console.error('Error saving meal:', error);
      } finally {
        setSubmitting(false);
      }
    };
  
    // Add food to meal
    const handleAddFood = (food) => {
      setMealForm(prev => ({
        ...prev,
        foods: [...prev.foods, {
          ...food,
          quantity: 1,
          mealFoodId: Date.now() // Temporary ID for tracking in the UI
        }]
      }));
      setShowFoodSearch(false);
    };
  
    // Remove food from meal
    const handleRemoveFood = (mealFoodId) => {
      setMealForm(prev => ({
        ...prev,
        foods: prev.foods.filter(food => food.mealFoodId !== mealFoodId)
      }));
    };
  
    // Update food quantity
    const handleUpdateFoodQuantity = (mealFoodId, quantity) => {
      const validQuantity = Math.max(0.1, Math.min(10, parseFloat(quantity) || 0.1));
      
      setMealForm(prev => ({
        ...prev,
        foods: prev.foods.map(food => 
          food.mealFoodId === mealFoodId
            ? { ...food, quantity: validQuantity }
            : food
        )
      }));
    };
  
    // Calculate total nutrition values
    const calculateTotals = () => {
      return mealForm.foods.reduce((totals, food) => {
        const quantity = parseFloat(food.quantity) || 0;
        totals.calories += (food.caloriesPerServing || 0) * quantity;
        totals.protein += (food.protein || 0) * quantity;
        totals.carbs += (food.carbs || 0) * quantity;
        totals.fat += (food.fat || 0) * quantity;
        return totals;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    };
  
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }
  
    // Conditional rendering based on form type
    if (isNewPlan || (!mealId && paramPlanId)) {
      // Render meal plan form
      return (
        <div className="form-container">
          <h2>{isNewPlan ? 'Create New Meal Plan' : 'Edit Meal Plan'}</h2>
          
          <form onSubmit={handlePlanSubmit} className="meal-plan-form">
            <div className="form-group">
              <label htmlFor="name">Plan Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={planForm.name}
                onChange={handlePlanChange}
                required
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={planForm.description}
                onChange={handlePlanChange}
                rows="3"
              />
            </div>
  
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date*</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={planForm.startDate}
                  onChange={handlePlanChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={planForm.endDate}
                  onChange={handlePlanChange}
                />
              </div>
            </div>
  
            <div className="form-group">
              <label htmlFor="dietType">Diet Type</label>
              <select
                id="dietType"
                name="dietType"
                value={planForm.dietType}
                onChange={handlePlanChange}
              >
                <option value="">Select Diet Type</option>
                <option value="Standard">Standard</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
                <option value="Paleo">Paleo</option>
                <option value="Low Carb">Low Carb</option>
                <option value="Low Fat">Low Fat</option>
                <option value="Mediterranean">Mediterranean</option>
              </select>
            </div>
  
            <div className="form-group">
              <label htmlFor="dailyCalorieTarget">Daily Calorie Target</label>
              <input
                type="number"
                id="dailyCalorieTarget"
                name="dailyCalorieTarget"
                value={planForm.dailyCalorieTarget}
                onChange={handlePlanChange}
                min="0"
                max="10000"
              />
            </div>
  
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="proteinTarget">Protein Target (g)</label>
                <input
                  type="number"
                  id="proteinTarget"
                  name="proteinTarget"
                  value={planForm.proteinTarget}
                  onChange={handlePlanChange}
                  min="0"
                  max="1000"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="carbTarget">Carb Target (g)</label>
                <input
                  type="number"
                  id="carbTarget"
                  name="carbTarget"
                  value={planForm.carbTarget}
                  onChange={handlePlanChange}
                  min="0"
                  max="1000"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fatTarget">Fat Target (g)</label>
                <input
                  type="number"
                  id="fatTarget"
                  name="fatTarget"
                  value={planForm.fatTarget}
                  onChange={handlePlanChange}
                  min="0"
                  max="1000"
                />
              </div>
            </div>
  
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={planForm.isPublic}
                onChange={handlePlanChange}
              />
              <label htmlFor="isPublic">Make this plan public</label>
            </div>
  
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/meals')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : (isNewPlan ? 'Create Plan' : 'Update Plan')}
              </button>
            </div>
          </form>
        </div>
      );
    }
  return<>
   <div className="form-container mt-[100px]">
        <h2>{mealId ? 'Edit Meal' : 'Add New Meal'}</h2>
        
        {showFoodSearch ? (
          <div className="food-search-container">
            <div className="food-search-header">
              <h3>Add Food to Meal</h3>
              <button 
                className="btn btn-outline"
                onClick={() => setShowFoodSearch(false)}
              >
                <i className="fas fa-times"></i> Close
              </button>
            </div>
            <FoodSearch onSelectFood={handleAddFood} />
          </div>
        ) : (
          <form onSubmit={handleMealSubmit} className="meal-form">
            <div className="form-group">
              <label htmlFor="name">Meal Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={mealForm.name}
                onChange={handleMealChange}
                required
              />
            </div>
  
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Meal Type</label>
                <select
                  id="type"
                  name="type"
                  value={mealForm.type}
                  onChange={handleMealChange}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                  <option value="Pre-workout">Pre-workout</option>
                  <option value="Post-workout">Post-workout</option>
                  <option value="Meal">Other Meal</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="scheduleTime">Scheduled Time</label>
                <input
                  type="datetime-local"
                  id="scheduleTime"
                  name="scheduleTime"
                  value={mealForm.scheduleTime}
                  onChange={handleMealChange}
                />
              </div>
            </div>
  
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={mealForm.notes}
                onChange={handleMealChange}
                rows="2"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={mealForm.imageUrl}
                onChange={handleMealChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
  
            <div className="foods-section">
              <div className="foods-header">
                <h3>Foods in this Meal</h3>
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowFoodSearch(true)}
                >
                  <i className="fas fa-plus"></i> Add Food
                </button>
              </div>
              
              {mealForm.foods.length > 0 ? (
                <>
                  <div className="foods-list">
                    {mealForm.foods.map(food => (
                      <div className="food-item" key={food.mealFoodId}>
                        <div className="food-info">
                          <div className="food-name">{food.foodName}</div>
                          <div className="food-details">
                            <span>{food.caloriesPerServing} kcal per serving</span>
                            <span>{food.servingSize} {food.servingUnit}</span>
                          </div>
                        </div>
                        <div className="food-quantity">
                          <label>Servings</label>
                          <input
                            type="number"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={food.quantity}
                            onChange={(e) => handleUpdateFoodQuantity(food.mealFoodId, e.target.value)}
                          />
                        </div>
                        <div className="food-totals">
                          <div>{Math.round(food.caloriesPerServing * food.quantity)} kcal</div>
                        </div>
                        <button 
                          type="button"
                          className="btn-remove"
                          onClick={() => handleRemoveFood(food.mealFoodId)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="meal-totals">
                    <h4>Meal Totals</h4>
                    <div className="totals-grid">
                      <div className="total-item">
                        <div className="total-value">{Math.round(calculateTotals().calories)}</div>
                        <div className="total-label">Calories</div>
                      </div>
                      <div className="total-item">
                        <div className="total-value">{calculateTotals().protein.toFixed(1)}g</div>
                        <div className="total-label">Protein</div>
                      </div>
                      <div className="total-item">
                        <div className="total-value">{calculateTotals().carbs.toFixed(1)}g</div>
                        <div className="total-label">Carbs</div>
                      </div>
                      <div className="total-item">
                        <div className="total-value">{calculateTotals().fat.toFixed(1)}g</div>
                        <div className="total-label">Fat</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-foods">
                  <p>No foods added to this meal yet</p>
                  <button 
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowFoodSearch(true)}
                  >
                    <i className="fas fa-search"></i> Search for Foods
                  </button>
                </div>
              )}
            </div>
  
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate(mealId ? `/meals/${mealId}` : '/meals')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : (mealId ? 'Update Meal' : 'Add Meal')}
              </button>
            </div>
          </form>
        )}
      </div>
  
  </>
}
