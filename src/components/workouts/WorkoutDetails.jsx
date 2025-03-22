import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { workoutsAPI } from '../../api/workoutsAPI';
import { toast } from 'react-toastify';
export default function WorkoutDetails() {
     const { workoutId } = useParams();
      const [searchParams] = useSearchParams();
      const logMode = searchParams.get('log') === 'true';
      const [workout, setWorkout] = useState(null);
      const [loading, setLoading] = useState(true);
      const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
      const [timerRunning, setTimerRunning] = useState(false);
      const [elapsedTime, setElapsedTime] = useState(0);
      const [exerciseSets, setExerciseSets] = useState({});
      const timerRef = useRef(null);
      const navigate = useNavigate();
    
      useEffect(() => {
        const fetchWorkout = async () => {
          try {
            setLoading(true);
            const workoutData = await workoutsAPI.getWorkout(workoutId);
            setWorkout(workoutData);
            
            // Initialize exercise sets tracking
            const initialSets = {};
            workoutData.exercises.forEach(exercise => {
              initialSets[exercise.workoutExerciseId] = exercise.sets.map(set => ({
                ...set,
                isCompleted: set.isCompleted || false,
                actualReps: set.reps || set.targetReps || 0,
                actualWeight: set.weight || set.targetWeight || 0
              }));
            });
            setExerciseSets(initialSets);
          } catch (error) {
            toast.error('Failed to load workout details');
            console.error('Error fetching workout:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchWorkout();
    
        // Clean up timer on unmount
        return () => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        };
      }, [workoutId]);
    
      useEffect(() => {
        // Timer logic
        if (timerRunning) {
          timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1);
          }, 1000);
        } else if (timerRef.current) {
          clearInterval(timerRef.current);
        }
    
        return () => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        };
      }, [timerRunning]);
    
      const handleEditWorkout = () => {
        navigate(`/workouts/${workoutId}/edit`);
      };
    
      const handleDeleteWorkout = async () => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
          try {
            await workoutsAPI.deleteWorkout(workoutId);
            toast.success('Workout deleted successfully');
            navigate('/workouts');
          } catch (error) {
            toast.error('Failed to delete workout');
            console.error('Error deleting workout:', error);
          }
        }
      };
    
      const handleStartWorkout = () => {
        setTimerRunning(true);
        toast.success('Workout started!');
      };
    
      const handlePauseWorkout = () => {
        setTimerRunning(false);
        toast.info('Workout paused');
      };
    
      const handleCompleteWorkout = async () => {
        try {
          // Collect all completed set data
          const completedSets = [];
          Object.entries(exerciseSets).forEach(([exerciseId, sets]) => {
            sets.forEach(set => {
              if (set.isCompleted) {
                completedSets.push({
                  setId: set.setId,
                  reps: set.actualReps,
                  weight: set.actualWeight
                });
              }
            });
          });
    
          // Send completion data to API
          await workoutsAPI.completeWorkout(workoutId, {
            duration: Math.ceil(elapsedTime / 60), // Convert seconds to minutes
            caloriesBurned: estimateCaloriesBurned(),
            exerciseSets: completedSets
          });
    
          setTimerRunning(false);
          toast.success('Workout completed successfully!');
          
          // Refresh workout data to show completion status
          const updatedWorkout = await workoutsAPI.getWorkout(workoutId);
          setWorkout(updatedWorkout);
        } catch (error) {
          toast.error('Failed to complete workout');
          console.error('Error completing workout:', error);
        }
      };
    
      const handleSetComplete = (exerciseId, setIndex, completed) => {
        setExerciseSets(prev => {
          const updatedSets = [...prev[exerciseId]];
          updatedSets[setIndex] = {
            ...updatedSets[setIndex],
            isCompleted: completed
          };
          return { ...prev, [exerciseId]: updatedSets };
        });
      };
    
      const handleSetDataChange = (exerciseId, setIndex, field, value) => {
        setExerciseSets(prev => {
          const updatedSets = [...prev[exerciseId]];
          updatedSets[setIndex] = {
            ...updatedSets[setIndex],
            [field]: value
          };
          return { ...prev, [exerciseId]: updatedSets };
        });
      };
    
      const estimateCaloriesBurned = () => {
        // Simple estimation - in a real app this would be more sophisticated
        const minutes = Math.ceil(elapsedTime / 60);
        return minutes * 5; // Very rough estimate of 5 calories per minute
      };
    
      const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        const parts = [];
        if (hrs > 0) parts.push(`${hrs}h`);
        if (mins > 0 || hrs > 0) parts.push(`${mins.toString().padStart(2, '0')}m`);
        parts.push(`${secs.toString().padStart(2, '0')}s`);
        
        return parts.join(' ');
      };
    
      const calculateProgress = () => {
        if (!workout) return 0;
        
        let totalSets = 0;
        let completedSets = 0;
        
        Object.values(exerciseSets).forEach(sets => {
          totalSets += sets.length;
          completedSets += sets.filter(set => set.isCompleted).length;
        });
        
        return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
      };
    
      if (loading) {
        return (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading workout details...</p>
          </div>
        );
      }
    
      if (!workout) {
        return (
          <div className="error-container">
            <p>Workout not found</p>
            <Link to="/workouts" className="btn btn-primary">Return to Workouts</Link>
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
    
      const isWorkoutInProgress = timerRunning;
      const progress = calculateProgress();
      const isComplete = workout.isCompleted || progress === 100;
    
  return <>
  <div className="workout-detail-container">
        <div className="workout-detail-header">
          <div className="workout-header-content">
            <h2>{workout.name}</h2>
            <div className="workout-meta">
              <span className="workout-type">
                <i className="fas fa-running"></i> {workout.type || 'General Workout'}
              </span>
              <span className="workout-schedule">
                <i className="far fa-calendar-alt"></i> {formatDateTime(workout.scheduledDate)}
              </span>
              <span className="workout-duration">
                <i className="far fa-clock"></i> {workout.duration} minutes
              </span>
              {workout.isCompleted && (
                <span className="workout-completed">
                  <i className="fas fa-check-circle"></i> Completed
                </span>
              )}
            </div>
          </div>
          <div className="workout-actions">
            {!workout.isCompleted && !isWorkoutInProgress && (
              <button 
                className="btn btn-primary"
                onClick={handleStartWorkout}
              >
                <i className="fas fa-play"></i> Start Workout
              </button>
            )}
            {isWorkoutInProgress && (
              <>
                <button 
                  className="btn btn-warning"
                  onClick={handlePauseWorkout}
                >
                  <i className="fas fa-pause"></i> Pause
                </button>
                <button 
                  className="btn btn-success"
                  onClick={handleCompleteWorkout}
                >
                  <i className="fas fa-check"></i> Complete Workout
                </button>
              </>
            )}
            <button 
              className="btn btn-outline"
              onClick={handleEditWorkout}
            >
              <i className="fas fa-edit"></i> Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDeleteWorkout}
            >
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
  
        {isWorkoutInProgress && (
          <div className="workout-progress-section">
            <div className="timer-display">
              <div className="timer-label">Elapsed Time</div>
              <div className="timer-value">{formatTime(elapsedTime)}</div>
            </div>
            <div className="workout-progress">
              <div className="progress-bar">
                <div 
                  className="progress-value" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-label">{Math.round(progress)}% Complete</div>
            </div>
            <div className="calories-display">
              <div className="calories-label">Est. Calories</div>
              <div className="calories-value">{estimateCaloriesBurned()} kcal</div>
            </div>
          </div>
        )}
  
        {workout.notes && (
          <div className="workout-notes">
            <h3>Notes</h3>
            <p>{workout.notes}</p>
          </div>
        )}
  
        <div className="workout-exercises">
          <h3>Exercises</h3>
          {workout.exercises && workout.exercises.length > 0 ? (
            <div className="exercises-accordion">
              {workout.exercises.map((exercise, index) => (
                <div 
                  key={exercise.workoutExerciseId} 
                  className={`exercise-item ${index === activeExerciseIndex ? 'active' : ''}`}
                >
                  <div 
                    className="exercise-header"
                    onClick={() => setActiveExerciseIndex(index === activeExerciseIndex ? -1 : index)}
                  >
                    <div className="exercise-title">
                      <h4>{exercise.exerciseName}</h4>
                      <div className="exercise-subtitle">
                        {exercise.exerciseCategory} • {exercise.targetSets} sets
                      </div>
                    </div>
                    <div className="exercise-toggle">
                      <i className={`fas fa-chevron-${index === activeExerciseIndex ? 'up' : 'down'}`}></i>
                    </div>
                  </div>
                  <div className="exercise-content">
                    <div className="exercise-instructions">
                      <Link to={`/workouts/exercises/${exercise.exerciseId}`} className="instructions-link">
                        View Exercise Details
                      </Link>
                    </div>
  
                    <div className="exercise-sets">
                      <div className="sets-header">
                        <div className="set-column">Set</div>
                        <div className="reps-column">Reps</div>
                        <div className="weight-column">Weight</div>
                        <div className="complete-column">Done</div>
                      </div>
                      
                      {exerciseSets[exercise.workoutExerciseId]?.map((set, setIndex) => (
                        <div 
                          key={set.setId || `temp-${setIndex}`} 
                          className={`set-row ${set.isCompleted ? 'completed' : ''}`}
                        >
                          <div className="set-column">{setIndex + 1}</div>
                          <div className="reps-column">
                            {logMode || isWorkoutInProgress ? (
                              <input 
                                type="number" 
                                min="0" 
                                max="999"
                                value={set.actualReps || ''}
                                onChange={(e) => handleSetDataChange(
                                  exercise.workoutExerciseId, 
                                  setIndex, 
                                  'actualReps', 
                                  parseInt(e.target.value) || 0
                                )}
                                className="set-input"
                              />
                            ) : (
                              <span>{set.reps || exercise.targetReps || '-'}</span>
                            )}
                          </div>
                          <div className="weight-column">
                            {logMode || isWorkoutInProgress ? (
                              <div className="weight-input-container">
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="999" 
                                  step="0.5"
                                  value={set.actualWeight || ''}
                                  onChange={(e) => handleSetDataChange(
                                    exercise.workoutExerciseId, 
                                    setIndex, 
                                    'actualWeight', 
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="set-input"
                                />
                                <span className="weight-unit">kg</span>
                              </div>
                            ) : (
                              <span>{set.weight || exercise.targetWeight || '-'} kg</span>
                            )}
                          </div>
                          <div className="complete-column">
                            <input 
                              type="checkbox"
                              checked={set.isCompleted}
                              onChange={(e) => handleSetComplete(
                                exercise.workoutExerciseId, 
                                setIndex, 
                                e.target.checked
                              )}
                              disabled={workout.isCompleted && !logMode}
                            />
                          </div>
                        </div>
                      ))}
                      
                      <div className="set-notes">
                        {exercise.notes && <p>{exercise.notes}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-exercises">
              <p>No exercises added to this workout</p>
              <button className="btn btn-outline" onClick={handleEditWorkout}>
                Add Exercises
              </button>
            </div>
          )}
        </div>
  
        {isWorkoutInProgress && (
          <div className="workout-controls">
            <button 
              className="btn btn-success btn-lg"
              onClick={handleCompleteWorkout}
            >
              <i className="fas fa-check-circle"></i> Complete Workout
            </button>
          </div>
        )}
  
        {logMode && !workout.isCompleted && (
          <div className="workout-controls">
            <button 
              className="btn btn-success btn-lg"
              onClick={handleCompleteWorkout}
            >
              <i className="fas fa-check-circle"></i> Log Completed Workout
            </button>
          </div>
        )}
  
        {isComplete && (
          <div className="workout-summary">
            <h3>Workout Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-value">{workout.duration} min</div>
                <div className="summary-label">Duration</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{workout.caloriesBurned || '-'}</div>
                <div className="summary-label">Calories Burned</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">
                  {workout.exercises?.reduce((total, ex) => total + (ex.sets?.length || 0), 0)}
                </div>
                <div className="summary-label">Total Sets</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">
                  {formatDateTime(workout.completedAt).split(',')[0]}
                </div>
                <div className="summary-label">Completed On</div>
              </div>
            </div>
          </div>
        )}
      </div>

  </>
    
}
