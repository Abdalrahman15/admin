import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mealsAPI } from '../../api/mealsAPI';
import { toast } from 'react-toastify';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
export default function MealsList({ activePlanId, isLoading }) {
    const [meals, setMeals] = useState([]);
      const [selectedDate, setSelectedDate] = useState(new Date());
      const [loading, setLoading] = useState(true);
      const [waterIntake, setWaterIntake] = useState(0);
      const [waterIntakeId, setWaterIntakeId] = useState(null);
      const navigate = useNavigate();
    
      useEffect(() => {
        if (activePlanId) {
          fetchMeals();
          fetchWaterIntake();
        } else {
          setLoading(false);
        }
      }, [activePlanId, selectedDate]);
    
      const fetchMeals = async () => {
        try {
          setLoading(true);
          const mealPlan = await mealsAPI.getMealPlan(activePlanId);
          
          // Filter meals for the selected date
          const filteredMeals = mealPlan.meals.filter(meal => {
            if (!meal.scheduleTime) return false;
            const mealDate = new Date(meal.scheduleTime);
            return (
              mealDate.getDate() === selectedDate.getDate() &&
              mealDate.getMonth() === selectedDate.getMonth() &&
              mealDate.getFullYear() === selectedDate.getFullYear()
            );
          });
          
          // Sort by schedule time
          filteredMeals.sort((a, b) => {
            if (!a.scheduleTime) return 1;
            if (!b.scheduleTime) return -1;
            return new Date(a.scheduleTime) - new Date(b.scheduleTime);
          });
          
          setMeals(filteredMeals);
        } catch (error) {
          toast.error('Failed to load meals');
          console.error('Error fetching meals:', error);
        } finally {
          setLoading(false);
        }
      };
    
      const fetchWaterIntake = async () => {
        try {
          const dateString = selectedDate.toISOString().split('T')[0];
          const waterData = await mealsAPI.getWaterIntake(dateString);
          
          if (waterData && waterData.length > 0) {
            const totalWater = waterData.reduce((total, record) => total + record.amount, 0);
            setWaterIntake(totalWater);
            setWaterIntakeId(waterData[0].intakeId); // Store ID of first record for updates
          } else {
            setWaterIntake(0);
            setWaterIntakeId(null);
          }
        } catch (error) {
          console.error('Error fetching water intake:', error);
          setWaterIntake(0);
        }
      };
    
      const handleAddMeal = () => {
        navigate('/meals/new');
      };
    
      const handleAddWater = async (amount) => {
        try {
          if (waterIntakeId) {
            // Update existing record
            await mealsAPI.updateWaterIntake(waterIntakeId, {
              amount: waterIntake + amount,
              date: selectedDate.toISOString().split('T')[0],
              unit: 'ml'
            });
          } else {
            // Create new record
            await mealsAPI.addWaterIntake({
              amount: amount,
              date: selectedDate.toISOString().split('T')[0],
              unit: 'ml'
            });
          }
          
          setWaterIntake(prev => prev + amount);
          toast.success(`Added ${amount}ml of water`);
        } catch (error) {
          toast.error('Failed to update water intake');
          console.error('Error updating water intake:', error);
        }
      };
    
      const handleDateChange = (date) => {
        setSelectedDate(date);
      };
    
      const handleMealComplete = async (mealId, isCompleted) => {
        try {
          if (isCompleted) {
            await mealsAPI.completeMeal(mealId);
            toast.success('Meal marked as completed');
            
            // Update the meal in the local state
            setMeals(prevMeals => 
              prevMeals.map(meal => 
                meal.mealId === mealId 
                  ? { ...meal, isCompleted: true, completedAt: new Date().toISOString() } 
                  : meal
              )
            );
          }
        } catch (error) {
          toast.error('Failed to update meal status');
          console.error('Error updating meal status:', error);
        }
      };
    
      const formatMealTime = (dateTimeString) => {
        if (!dateTimeString) return 'Any time';
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
    
      // Calculate daily nutrition totals
      const dailyTotals = meals.reduce((totals, meal) => {
        if (meal.isCompleted) {
          totals.calories += meal.totalCalories || 0;
          totals.protein += meal.totalProtein || 0;
          totals.carbs += meal.totalCarbs || 0;
          totals.fat += meal.totalFat || 0;
        }
        return totals;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
      if (isLoading || loading) {
        return (
          <div className="loading-container flex justify-center items-center mt-[200px]">
            <div className="spinner"></div>
            <p>Loading meals...</p>
          </div>
        );
      }
    
      if (!activePlanId) {
        return null;
      }



  return <>
    <div className="meals-list-container mt-[100px]">
        <div className="meals-list-header">
          <h2>Daily Meals</h2>
          <button 
            className="btn btn-primary"
            onClick={handleAddMeal}
          >
            <i className="fas fa-plus"></i> Add Meal
          </button>
        </div>
  
        <div className="meals-content mt-[100px]">
          <div className="meals-calendar-container">
            <Calendar 
              onChange={handleDateChange}
              value={selectedDate}
              className="meals-calendar"
            />
            
            <div className="water-tracker">
              <h3>Water Intake</h3>
              <div className="water-progress">
                <div 
                  className="water-progress-bar" 
                  style={{ width: `${Math.min((waterIntake / 2500) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="water-info">
                <span className="water-amount">{waterIntake}ml</span>
                <span className="water-target">of 2500ml daily goal</span>
              </div>
              <div className="water-actions">
                <button onClick={() => handleAddWater(250)}>+250ml</button>
                <button onClick={() => handleAddWater(500)}>+500ml</button>
              </div>
            </div>
  
            <div className="daily-nutrition-summary">
              <h3>Daily Nutrition</h3>
              <div className="nutrition-item">
                <span className="nutrition-label">Calories</span>
                <span className="nutrition-value">{dailyTotals.calories} kcal</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Protein</span>
                <span className="nutrition-value">{dailyTotals.protein.toFixed(1)}g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Carbs</span>
                <span className="nutrition-value">{dailyTotals.carbs.toFixed(1)}g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Fat</span>
                <span className="nutrition-value">{dailyTotals.fat.toFixed(1)}g</span>
              </div>
            </div>
          </div>
  
          <div className="meals-list">
            <h3 className="date-header">
              {selectedDate.toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            {meals.length > 0 ? (
              <div className="meals-timeline">
                {meals.map(meal => (
                  <div 
                    key={meal.mealId} 
                    className={`meal-card ${meal.isCompleted ? 'completed' : ''}`}
                  >
                    <div className="meal-time">
                      <i className={`fas fa-${getMealIcon(meal.type)}`}></i>
                      <span>{formatMealTime(meal.scheduleTime)}</span>
                    </div>
                    <div className="meal-info">
                      <h4>
                        <Link to={`/meals/${meal.mealId}`}>{meal.name}</Link>
                      </h4>
                      <div className="meal-type">{meal.type || 'Meal'}</div>
                      <div className="meal-nutrition">
                        <span>{meal.totalCalories || 0} kcal</span>
                        <span>{meal.totalProtein || 0}g protein</span>
                      </div>
                    </div>
                    <div className="meal-actions">
                      {meal.isCompleted ? (
                        <div className="completed-badge">
                          <i className="fas fa-check-circle"></i> Completed
                        </div>
                      ) : (
                        <button 
                          className="btn-complete"
                          onClick={() => handleMealComplete(meal.mealId, true)}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-meals">
                <i className="fas fa-utensils"></i>
                <p>No meals planned for this day</p>
                <button 
                  className="btn btn-outline"
                  onClick={handleAddMeal}
                >
                  Add Meal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

  
  
  </>

    
}

// Helper function to get meal icon
const getMealIcon = (type) => {
    const mealIcons = {
      'Breakfast': 'coffee',
      'Lunch': 'hamburger',
      'Dinner': 'utensils',
      'Snack': 'apple-alt',
      'Pre-workout': 'drumstick-bite',
      'Post-workout': 'blender'
    };
    
    return mealIcons[type] || 'utensils';
  };
