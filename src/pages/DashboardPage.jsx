
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
// import ActivitySummary from '../components/dashboard/ActivitySummary';
// import RecentWorkouts from '../components/dashboard/RecentWorkouts';
// import NutritionSummary from '../components/dashboard/NutritionSummary';
// import LoadingSpinner from '../components/common/LoadingSpinner';
import { workoutsAPI } from '../api/workoutsAPI.js';
import { mealsAPI } from '../api/mealsAPI.js'
import { progressAPI } from '../api/progressAPI.js';
import { toast } from 'react-toastify';
// import './DashboardPage.css';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    recentWorkouts: [],
    upcomingWorkouts: [],
    todaysMeals: [],
    weightProgress: [],
    stats: {
      completedWorkouts: 0,
      streak: 0,
      caloriesBurned: 0,
      caloriesConsumed: 0,
      waterIntake: 0
    }
  });

  // Get date ranges for API calls
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const formatDate = (date) => date.toISOString().split('T')[0];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch recent workouts
        const workouts = await workoutsAPI.getWorkouts();
        const recentWorkouts = workouts
          .filter(w => w.isCompleted)
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
          .slice(0, 5);
          
        const upcomingWorkouts = workouts
          .filter(w => !w.isCompleted && new Date(w.scheduledDate) >= new Date())
          .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
          .slice(0, 3);

        // Fetch today's meals
        const mealPlans = await mealsAPI.getMealPlans();
        let todaysMeals = [];
        
        if (mealPlans.length > 0) {
          const activePlan = mealPlans.find(mp => 
            new Date(mp.startDate) <= today && 
            (!mp.endDate || new Date(mp.endDate) >= today)
          ) || mealPlans[0];
          
          const planDetails = await mealsAPI.getMealPlan(activePlan.planId);
          todaysMeals = planDetails.meals.filter(meal => {
            if (!meal.scheduleTime) return false;
            const mealDate = new Date(meal.scheduleTime);
            return formatDate(mealDate) === formatDate(today);
          });
        }

        // Fetch weight progress
        const progressRecords = await progressAPI.getProgressRecords({
          startDate: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())),
          endDate: formatDate(today)
        });
        
        const weightProgress = progressRecords
          .filter(record => record.weight)
          .map(record => ({
            date: new Date(record.recordDate),
            weight: record.weight
          }))
          .sort((a, b) => a.date - b.date);

        // Fetch stats
        const statsSummary = await progressAPI.getStatsSummary(
          formatDate(startOfWeek), 
          formatDate(today)
        );

        setDashboardData({
          recentWorkouts,
          upcomingWorkouts,
          todaysMeals,
          weightProgress,
          stats: {
            completedWorkouts: statsSummary.completedWorkouts || 0,
            streak: statsSummary.currentStreak || 0,
            caloriesBurned: statsSummary.totalCaloriesBurned || 0,
            caloriesConsumed: statsSummary.avgDailyCalories || 0,
            waterIntake: statsSummary.avgWaterIntake || 0
          }
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }






  return <>
   <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {currentUser.username}!</h1>
        <p className="date">{today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="dashboard-grid">
        <ActivitySummary stats={dashboardData.stats} />
        
        <div className="dashboard-card upcoming-workouts">
          <div className="card-header">
            <h2>Upcoming Workouts</h2>
            <Link to="/workouts" className="view-all-link">View All</Link>
          </div>
          {dashboardData.upcomingWorkouts.length > 0 ? (
            <ul className="upcoming-list">
              {dashboardData.upcomingWorkouts.map(workout => (
                <li key={workout.workoutId} className="upcoming-item">
                  <div className="upcoming-date">
                    <span className="day">{new Date(workout.scheduledDate).getDate()}</span>
                    <span className="month">{new Date(workout.scheduledDate).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="upcoming-details">
                    <h3>{workout.name}</h3>
                    <p>{workout.type} • {workout.duration} min</p>
                  </div>
                  <Link to={`/workouts/${workout.workoutId}`} className="btn-small">
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <i className="fas fa-calendar-plus"></i>
              <p>No upcoming workouts scheduled</p>
              <Link to="/workouts/new" className="btn btn-outline">Schedule Workout</Link>
            </div>
          )}
        </div>
        
        <div className="dashboard-card today-meals">
          <div className="card-header">
            <h2>Today's Meals</h2>
            <Link to="/meals" className="view-all-link">View All</Link>
          </div>
          {dashboardData.todaysMeals.length > 0 ? (
            <ul className="meal-list">
              {dashboardData.todaysMeals.map(meal => (
                <li key={meal.mealId} className="meal-item">
                  <div className="meal-icon">
                    <i className={`fas fa-${getMealIcon(meal.type)}`}></i>
                    <span className="meal-time">
                      {meal.scheduleTime ? new Date(meal.scheduleTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Any time'}
                    </span>
                  </div>
                  <div className="meal-details">
                    <h3>{meal.name}</h3>
                    <p>
                      <span className="nutrition-stat">{meal.totalCalories} kcal</span>
                      <span className="nutrition-stat">{meal.totalProtein}g protein</span>
                    </p>
                  </div>
                  <div className="meal-status">
                    {meal.isCompleted ? (
                      <span className="status-completed"><i className="fas fa-check-circle"></i></span>
                    ) : (
                      <Link to={`/meals/${meal.mealId}`} className="btn-small">
                        <i className="fas fa-utensils"></i>
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <i className="fas fa-utensils"></i>
              <p>No meals planned for today</p>
              <Link to="/meals/new" className="btn btn-outline">Add Meal</Link>
            </div>
          )}
        </div>
        
        <RecentWorkouts workouts={dashboardData.recentWorkouts} />
        
        <NutritionSummary 
          caloriesConsumed={dashboardData.stats.caloriesConsumed}
          caloriesBurned={dashboardData.stats.caloriesBurned}
          waterIntake={dashboardData.stats.waterIntake}
        />
      </div>
    </div>
  
  
  </>
   
  
}
