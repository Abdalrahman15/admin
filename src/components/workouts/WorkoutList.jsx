import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { workoutsAPI } from '../../api/workoutsAPI';
import { toast } from 'react-toastify';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
export default function WorkoutList({ activePlanId, isLoading }) {
    const [workouts, setWorkouts] = useState([]);
      const [selectedDate, setSelectedDate] = useState(new Date());
      const [loading, setLoading] = useState(true);
      const [stats, setStats] = useState({
        completedWorkouts: 0,
        totalMinutes: 0,
        caloriesBurned: 0,
        streak: 0
      });
      const navigate = useNavigate();
    
      useEffect(() => {
        if (activePlanId) {
          fetchWorkouts();
          fetchStats();
        } else {
          setLoading(false);
        }
      }, [activePlanId, selectedDate]);
    
      const fetchWorkouts = async () => {
        try {
          setLoading(true);
          const workoutPlan = await workoutsAPI.getWorkoutPlan(activePlanId);
          
          // Filter workouts for the selected date or upcoming
          let filteredWorkouts = workoutPlan.workouts;
          
          // If viewing today or a future date, show scheduled workouts
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate >= today) {
            // For today or future dates, show scheduled workouts
            filteredWorkouts = workoutPlan.workouts.filter(workout => {
              if (!workout.scheduledDate) return false;
              const workoutDate = new Date(workout.scheduledDate);
              workoutDate.setHours(0, 0, 0, 0);
              return workoutDate.getTime() === selectedDate.getTime();
            });
          } else {
            // For past dates, show completed workouts
            filteredWorkouts = workoutPlan.workouts.filter(workout => {
              if (!workout.completedAt) return false;
              const completedDate = new Date(workout.completedAt);
              completedDate.setHours(0, 0, 0, 0);
              return completedDate.getTime() === selectedDate.getTime();
            });
          }
          
          // Sort by scheduled time
          filteredWorkouts.sort((a, b) => {
            if (!a.scheduledDate) return 1;
            if (!b.scheduledDate) return -1;
            return new Date(a.scheduledDate) - new Date(b.scheduledDate);
          });
          
          setWorkouts(filteredWorkouts);
        } catch (error) {
          toast.error('Failed to load workouts');
          console.error('Error fetching workouts:', error);
        } finally {
          setLoading(false);
        }
      };
    
      const fetchStats = async () => {
        try {
          // Get date range for this week
          const today = new Date();
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          
          const stats = await workoutsAPI.getWorkoutStats(
            startOfWeek.toISOString().split('T')[0], 
            today.toISOString().split('T')[0]
          );
          
          setStats(stats);
        } catch (error) {
          console.error('Error fetching workout stats:', error);
        }
      };
    
      const handleAddWorkout = () => {
        navigate('/workouts/new');
      };
    
      const handleDateChange = (date) => {
        setSelectedDate(date);
      };
    
      const handleStartWorkout = (workoutId) => {
        navigate(`/workouts/${workoutId}`);
      };
    
      const formatWorkoutTime = (dateTimeString) => {
        if (!dateTimeString) return 'Any time';
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
    
      // Function to determine if a date has workouts for calendar highlighting
      const tileClassName = ({ date, view }) => {
        if (view !== 'month') return '';
        
        // This is a simplified check. In a real app, you would check if there are actual workouts on this day
        // For now, we'll just highlight weekdays to simulate workout days
        const day = date.getDay();
        if (day !== 0 && day !== 6) {
          return 'has-workout';
        }
        return '';
      };
    
      if (isLoading || loading) {
        return (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading workouts...</p>
          </div>
        );
      }
    
      if (!activePlanId) {
        return null;
      }
    
      const isSelectedDateToday = selectedDate.toDateString() === new Date().toDateString();
      const isPastDate = selectedDate < new Date().setHours(0, 0, 0, 0);
  return <>
   <div className="workouts-list-container">
        <div className="workouts-list-header">
          <h2>Your Workouts</h2>
          <button 
            className="btn btn-primary"
            onClick={handleAddWorkout}
          >
            <i className="fas fa-plus"></i> Add Workout
          </button>
        </div>
  
        <div className="workouts-content">
          <div className="workouts-sidebar">
            <Calendar 
              onChange={handleDateChange}
              value={selectedDate}
              className="workouts-calendar"
              tileClassName={tileClassName}
            />
            
            <div className="workout-stats">
              <h3>Your Progress</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.completedWorkouts}</div>
                  <div className="stat-label">Workouts this week</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalMinutes}</div>
                  <div className="stat-label">Total minutes</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.caloriesBurned}</div>
                  <div className="stat-label">Calories burned</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.streak}</div>
                  <div className="stat-label">Day streak</div>
                </div>
              </div>
            </div>
            
            <div className="explore-exercises">
              <h3>Explore Exercises</h3>
              <p>Find new exercises to add to your workouts</p>
              <Link to="/workouts/exercises" className="btn btn-outline">
                Browse Exercise Library
              </Link>
            </div>
          </div>
  
          <div className="workouts-main">
            <h3 className="date-header">
              {selectedDate.toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {isSelectedDateToday && <span className="today-badge">TODAY</span>}
            </h3>
            
            {workouts.length > 0 ? (
              <div className="workouts-timeline">
                {workouts.map(workout => (
                  <div 
                    key={workout.workoutId} 
                    className={`workout-card ${workout.isCompleted ? 'completed' : ''}`}
                  >
                    <div className="workout-time">
                      <i className="far fa-clock"></i>
                      <span>{formatWorkoutTime(workout.scheduledDate)}</span>
                    </div>
                    <div className="workout-info">
                      <h4>
                        <Link to={`/workouts/${workout.workoutId}`}>{workout.name}</Link>
                      </h4>
                      <div className="workout-type">{workout.type || 'General'}</div>
                      <div className="workout-details">
                        <span>{workout.duration} minutes</span>
                        {workout.caloriesBurned && (
                          <span>{workout.caloriesBurned} kcal</span>
                        )}
                      </div>
                    </div>
                    <div className="workout-actions">
                      {workout.isCompleted ? (
                        <div className="completed-badge">
                          <i className="fas fa-check-circle"></i> Completed
                        </div>
                      ) : isPastDate ? (
                        <button 
                          className="btn-log"
                          onClick={() => navigate(`/workouts/${workout.workoutId}?log=true`)}
                        >
                          Log Workout
                        </button>
                      ) : (
                        <button 
                          className="btn-start"
                          onClick={() => handleStartWorkout(workout.workoutId)}
                        >
                          Start Workout
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-workouts">
                <i className="fas fa-dumbbell"></i>
                <p>
                  {isPastDate 
                    ? 'No workouts completed on this day' 
                    : 'No workouts planned for this day'}
                </p>
                <button 
                  className="btn btn-outline"
                  onClick={handleAddWorkout}
                >
                  {isPastDate 
                    ? 'Log Past Workout' 
                    : 'Schedule Workout'}
                </button>
              </div>
            )}
  
            {isSelectedDateToday && (
              <div className="quick-start-section">
                <h3>Quick Start Workouts</h3>
                <div className="quick-workout-cards">
                  <div className="quick-workout-card">
                    <i className="fas fa-running"></i>
                    <h4>Cardio</h4>
                    <p>30 min • 300 kcal</p>
                    <button className="btn-start">Start</button>
                  </div>
                  <div className="quick-workout-card">
                    <i className="fas fa-dumbbell"></i>
                    <h4>Upper Body</h4>
                    <p>45 min • 250 kcal</p>
                    <button className="btn-start">Start</button>
                  </div>
                  <div className="quick-workout-card">
                    <i className="fas fa-walking"></i>
                    <h4>Lower Body</h4>
                    <p>40 min • 280 kcal</p>
                    <button className="btn-start">Start</button>
                  </div>
                  <div className="quick-workout-card">
                    <i className="fas fa-heart"></i>
                    <h4>Full Body</h4>
                    <p>60 min • 450 kcal</p>
                    <button className="btn-start">Start</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  
  </>

  
}
