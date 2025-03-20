import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mealsAPI } from '../../api/mealsAPI';
import { toast } from 'react-toastify';
export default function MealDetail() {
     const { mealId } = useParams();
      const [meal, setMeal] = useState(null);
      const [loading, setLoading] = useState(true);
      const navigate = useNavigate();
    
      useEffect(() => {
        const fetchMeal = async () => {
          try {
            setLoading(true);
            const mealData = await mealsAPI.getMeal(mealId);
            setMeal(mealData);
          } catch (error) {
            toast.error('Failed to load meal details');
            console.error('Error fetching meal:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchMeal();
      }, [mealId]);
    
      const handleEditMeal = () => {
        navigate(`/meals/${mealId}/edit`);
      };
    
      const handleDeleteMeal = async () => {
        if (window.confirm('Are you sure you want to delete this meal?')) {
          try {
            await mealsAPI.deleteMeal(mealId);
            toast.success('Meal deleted successfully');
            navigate('/meals');
          } catch (error) {
            toast.error('Failed to delete meal');
            console.error('Error deleting meal:', error);
          }
        }
      };
    
      const handleToggleComplete = async () => {
        try {
          if (!meal.isCompleted) {
            await mealsAPI.completeMeal(mealId);
            setMeal({ ...meal, isCompleted: true, completedAt: new Date().toISOString() });
            toast.success('Meal marked as completed');
          } else {
            // If API supports undoing completion
            await mealsAPI.updateMeal(mealId, { isCompleted: false });
            setMeal({ ...meal, isCompleted: false, completedAt: null });
            toast.success('Meal marked as not completed');
          }
        } catch (error) {
          toast.error('Failed to update meal status');
          console.error('Error updating meal status:', error);
        }
      };
    
      if (loading) {
        return (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading meal details...</p>
          </div>
        );
      }
    
      if (!meal) {
        return (
          <div className="error-container">
            <p>Meal not found</p>
            <Link to="/meals" className="btn btn-primary">Return to Meals</Link>
          </div>
        );
      }
    
      const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'Not scheduled';
        const date = new Date(dateTimeString);
        return date.toLocaleString(undefined, { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };
  return <>
   
    <div className="meal-detail-container mt-[100px]">
      <div className="meal-detail-header">
        <div className="meal-header-content">
          <h2>{meal.name}</h2>
          <div className="meal-meta">
            <span className="meal-type">
              <i className={`fas fa-${getMealIcon(meal.type)}`}></i> {meal.type || 'Meal'}
            </span>
            <span className="meal-time">
              <i className="far fa-clock"></i> {formatDateTime(meal.scheduleTime)}
            </span>
            {meal.isCompleted && (
              <span className="meal-completed">
                <i className="fas fa-check-circle"></i> Completed
              </span>
            )}
          </div>
        </div>
        <div className="meal-actions">
          <button 
            className="btn btn-primary"
            onClick={handleToggleComplete}
          >
            {meal.isCompleted ? (
              <><i className="fas fa-undo"></i> Mark as Not Completed</>
            ) : (
              <><i className="fas fa-check"></i> Mark as Completed</>
            )}
          </button>
          <button 
            className="btn btn-outline"
            onClick={handleEditMeal}
          >
            <i className="fas fa-edit"></i> Edit
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleDeleteMeal}
          >
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>

      <div className="meal-nutrition-summary">
        <div className="nutrition-card">
          <div className="nutrition-value">{meal.totalCalories || 0}</div>
          <div className="nutrition-label">Calories</div>
        </div>
        <div className="nutrition-card">
          <div className="nutrition-value">{meal.totalProtein || 0}g</div>
          <div className="nutrition-label">Protein</div>
        </div>
        <div className="nutrition-card">
          <div className="nutrition-value">{meal.totalCarbs || 0}g</div>
          <div className="nutrition-label">Carbs</div>
        </div>
        <div className="nutrition-card">
          <div className="nutrition-value">{meal.totalFat || 0}g</div>
          <div className="nutrition-label">Fat</div>
        </div>
      </div>

      {meal.notes && (
        <div className="meal-notes">
          <h3>Notes</h3>
          <p>{meal.notes}</p>
        </div>
      )}

      <div className="meal-foods">
        <h3>Foods</h3>
        {meal.foods && meal.foods.length > 0 ? (
          <div className="foods-table">
            <div className="foods-header">
              <div className="food-name-col">Food</div>
              <div className="food-quantity-col">Quantity</div>
              <div className="food-calories-col">Calories</div>
              <div className="food-protein-col">Protein</div>
              <div className="food-carbs-col">Carbs</div>
              <div className="food-fat-col">Fat</div>
            </div>
            {meal.foods.map(food => (
              <div className="food-row" key={food.mealFoodId}>
                <div className="food-name-col">{food.foodName}</div>
                <div className="food-quantity-col">
                  {food.quantity} {food.quantity === 1 ? 'serving' : 'servings'}
                  <div className="serving-info">
                    {food.servingSize} {food.servingUnit}
                  </div>
                </div>
                <div className="food-calories-col">
                  {Math.round(food.caloriesPerServing * food.quantity)}
                </div>
                <div className="food-protein-col">
                  {food.protein ? (food.protein * food.quantity).toFixed(1) + 'g' : '-'}
                </div>
                <div className="food-carbs-col">
                  {food.carbs ? (food.carbs * food.quantity).toFixed(1) + 'g' : '-'}
                </div>
                <div className="food-fat-col">
                  {food.fat ? (food.fat * food.quantity).toFixed(1) + 'g' : '-'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-foods">
            <p>No foods added to this meal</p>
            <button className="btn btn-outline" onClick={handleEditMeal}>
              Add Foods
            </button>
          </div>
        )}
      </div>

      {meal.imageUrl && (
        <div className="meal-image">
          <img src={meal.imageUrl} alt={meal.name} />
        </div>
      )}
    </div>
  
  </>
    
}


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
  