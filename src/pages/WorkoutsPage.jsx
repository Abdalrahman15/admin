import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import WorkoutList from '../components/workouts/WorkoutList.jsx';
import WorkoutDetail from '../components/workouts/WorkoutDetails.jsx';
import WorkoutForm from '../components/workouts/WorkoutForm.jsx';
import ExerciseDetail from '../components/workouts/ExerciseDetail.jsx';
// import ExerciseList from '../components/workouts/ExerciseList.jsx';
import { workoutsAPI } from '../api/workoutsAPI.js';
import { toast } from 'react-toastify';
export default function WorkoutsPage() {
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [activePlan, setActivePlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchWorkoutPlans = async () => {
        try {
          setLoading(true);
          const plans = await workoutsAPI.getWorkoutPlans();
          setWorkoutPlans(plans);
          
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
          toast.error('Failed to load workout plans');
          console.error('Error fetching workout plans:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchWorkoutPlans();
    }, []);
  
    const handleCreateWorkoutPlan = () => {
      navigate('/workouts/plan/new');
    };
  
    const handleSelectPlan = (planId) => {
      const selected = workoutPlans.find(plan => plan.planId === planId);
      setActivePlan(selected);
    };
  return <>
  <div className="workouts-page">
        <div className="workouts-header">
          <h1>Workout Tracking</h1>
          <div className="workouts-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleCreateWorkoutPlan}
            >
              <i className="fas fa-plus"></i> New Workout Plan
            </button>
          </div>
        </div>
  
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading workout plans...</p>
          </div>
        ) : (
          <>
            {workoutPlans.length > 0 ? (
              <div className="workout-plan-selector">
                <label htmlFor="workout-plan-select">Select Workout Plan:</label>
                <select 
                  id="workout-plan-select"
                  value={activePlan?.planId || ''}
                  onChange={(e) => handleSelectPlan(Number(e.target.value))}
                >
                  {workoutPlans.map(plan => (
                    <option key={plan.planId} value={plan.planId}>
                      {plan.name} ({plan.startDate ? new Date(plan.startDate).toLocaleDateString() : 'No start date'})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-dumbbell"></i>
                <h2>No Workout Plans Yet</h2>
                <p>Create your first workout plan to start tracking your fitness journey</p>
                <button 
                  className="btn btn-primary" 
                  onClick={handleCreateWorkoutPlan}
                >
                  Create Workout Plan
                </button>
              </div>
            )}
  
            {activePlan && (
              <div className="workout-plan-summary">
                <h2>{activePlan.name}</h2>
                <div className="workout-plan-details">
                  <p>{activePlan.description}</p>
                  <div className="workout-plan-meta">
                    <div className="meta-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>
                        {activePlan.startDate ? new Date(activePlan.startDate).toLocaleDateString() : 'No start date'}
                        {activePlan.endDate ? ` - ${new Date(activePlan.endDate).toLocaleDateString()}` : ''}
                      </span>
                    </div>
                    {activePlan.difficulty && (
                      <div className="meta-item">
                        <i className="fas fa-signal"></i>
                        <span>Difficulty: {activePlan.difficulty}</span>
                      </div>
                    )}
                    {activePlan.estimatedDuration && (
                      <div className="meta-item">
                        <i className="fas fa-clock"></i>
                        <span>Est. Duration: {activePlan.estimatedDuration} min</span>
                      </div>
                    )}
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
              <WorkoutList 
                activePlanId={activePlan?.planId} 
                isLoading={loading}
              />
            } 
          />
          <Route path="/plan/new" element={<WorkoutForm isNewPlan={true} />} />
          <Route path="/plan/:planId/edit" element={<WorkoutForm isNewPlan={false} />} />
          <Route path="/:workoutId" element={<WorkoutDetail />} />
          <Route path="/new" element={<WorkoutForm planId={activePlan?.planId} />} />
          <Route path="/:workoutId/edit" element={<WorkoutForm />} />
          <Route path="/exercises" element={<ExerciseList />} />
          <Route path="/exercises/:exerciseId" element={<ExerciseDetail />} />
        </Routes>
      </div>
  </>
  
}
