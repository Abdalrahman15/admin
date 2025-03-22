import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workoutsAPI } from '../../api/workoutsAPI';
import ExerciseSelector from './ExerciseSelector.jsx';
import { toast } from 'react-toastify';

export default function WorkoutForm() {

     const { workoutId, planId: paramPlanId } = useParams();
      const navigate = useNavigate();
      const currentPlanId = propPlanId || paramPlanId;
      
      const [loading, setLoading] = useState(true);
      const [submitting, setSubmitting] = useState(false);
      const [showExerciseSelector, setShowExerciseSelector] = useState(false);
      
      // For workout plan form
      const [planForm, setPlanForm] = useState({
        name: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        difficulty: 'Beginner',
        estimatedDuration: '',
        tags: '',
        isPublic: false
      });
    
      // For workout form
      const [workoutForm, setWorkoutForm] = useState({
        name: '',
        type: 'Strength',
        scheduledDate: new Date().toISOString().split('T')[0] + 'T12:00',
        duration: 60,
        notes: '',
        exercises: []
      });
    
      // For editing existing workout or plan
      useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            
            if (isNewPlan) {
              // New workout plan - no data to fetch
              setLoading(false);
              return;
            }
            
            if (workoutId) {
              // Editing existing workout
              const workoutData = await workoutsAPI.getWorkout(workoutId);
              
              setWorkoutForm({
                name: workoutData.name || '',
                type: workoutData.type || 'Strength',
                scheduledDate: workoutData.scheduledDate 
                  ? new Date(workoutData.scheduledDate).toISOString().slice(0, 16) 
                  : new Date().toISOString().split('T')[0] + 'T12:00',
                duration: workoutData.duration || 60,
                notes: workoutData.notes || '',
                exercises: workoutData.exercises?.map(exercise => ({
                  workoutExerciseId: exercise.workoutExerciseId,
                  exerciseId: exercise.exerciseId,
                  exerciseName: exercise.exerciseName,
                  exerciseCategory: exercise.exerciseCategory,
                  targetSets: exercise.targetSets || 3,
                  targetReps: exercise.targetReps || 10,
                  targetWeight: exercise.targetWeight || 0,
                  notes: exercise.notes || '',
                  sortOrder: exercise.sortOrder || 0,
                  sets: exercise.sets || Array(exercise.targetSets || 3).fill().map(() => ({
                    setType: 'Standard',
                    reps: exercise.targetReps || 10,
                    weight: exercise.targetWeight || 0,
                    isCompleted: false
                  }))
                })) || []
              });
            } else if (paramPlanId && !isNewPlan) {
              // Editing existing workout plan
              const planData = await workoutsAPI.getWorkoutPlan(paramPlanId);
              
              setPlanForm({
                name: planData.name || '',
                description: planData.description || '',
                startDate: planData.startDate 
                  ? new Date(planData.startDate).toISOString().split('T')[0] 
                  : new Date().toISOString().split('T')[0],
                endDate: planData.endDate 
                  ? new Date(planData.endDate).toISOString().split('T')[0] 
                  : '',
                difficulty: planData.difficulty || 'Beginner',
                estimatedDuration: planData.estimatedDuration || '',
                tags: planData.tags || '',
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
      }, [workoutId, paramPlanId, isNewPlan]);
    
      // Handle plan form changes
      const handlePlanChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPlanForm(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));
      };
    
      // Handle workout form changes
      const handleWorkoutChange = (e) => {
        const { name, value, type, checked } = e.target;
        setWorkoutForm(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));
      };
    
      // Handle submitting workout plan
      const handlePlanSubmit = async (e) => {
        e.preventDefault();
        
        try {
          setSubmitting(true);
          
          const planData = {
            ...planForm,
            estimatedDuration: planForm.estimatedDuration ? parseInt(planForm.estimatedDuration) : null
          };
          
          if (isNewPlan) {
            // Create new plan
            const newPlan = await workoutsAPI.createWorkoutPlan(planData);
            toast.success('Workout plan created successfully');
            navigate(`/workouts`);
          } else {
            // Update existing plan
            await workoutsAPI.updateWorkoutPlan(paramPlanId, planData);
            toast.success('Workout plan updated successfully');
            navigate(`/workouts`);
          }
        } catch (error) {
          toast.error('Failed to save workout plan');
          console.error('Error saving workout plan:', error);
        } finally {
          setSubmitting(false);
        }
      };
    
      // Handle submitting workout
      const handleWorkoutSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentPlanId && !workoutId) {
          toast.error('No workout plan selected');
          return;
        }
        
        try {
          setSubmitting(true);
          
          // Format exercises for API
          const exercises = workoutForm.exercises.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            targetSets: ex.targetSets,
            targetReps: ex.targetReps,
            targetWeight: ex.targetWeight,
            notes: ex.notes,
            sortOrder: index,
            sets: ex.sets.map(set => ({
              setType: set.setType,
              reps: set.reps,
              weight: set.weight
            }))
          }));
          
          const workoutData = {
            ...workoutForm,
            planId: parseInt(currentPlanId),
            exercises: exercises
          };
          
          if (workoutId) {
            // Update existing workout
            await workoutsAPI.updateWorkout(workoutId, workoutData);
            toast.success('Workout updated successfully');
            navigate(`/workouts/${workoutId}`);
          } else {
            // Create new workout
            const newWorkout = await workoutsAPI.createWorkout(workoutData);
            toast.success('Workout added successfully');
            navigate(`/workouts/${newWorkout.workoutId}`);
          }
        } catch (error) {
          toast.error('Failed to save workout');
          console.error('Error saving workout:', error);
        } finally {
          setSubmitting(false);
        }
      };
    
      // Add exercise to workout
      const handleAddExercise = (exercise) => {
        setWorkoutForm(prev => {
          const defaultSets = Array(3).fill().map(() => ({
            setType: 'Standard',
            reps: 10,
            weight: 0,
            isCompleted: false
          }));
          
          return {
            ...prev,
            exercises: [...prev.exercises, {
              exerciseId: exercise.exerciseId,
              exerciseName: exercise.name,
              exerciseCategory: exercise.category,
              targetSets: 3,
              targetReps: 10,
              targetWeight: 0,
              notes: '',
              sortOrder: prev.exercises.length,
              sets: defaultSets
            }]
          };
        });
        setShowExerciseSelector(false);
      };
    
      // Remove exercise from workout
      const handleRemoveExercise = (index) => {
        setWorkoutForm(prev => ({
          ...prev,
          exercises: prev.exercises.filter((_, i) => i !== index)
        }));
      };
    
      // Update exercise sets
      const handleUpdateSets = (index, field, value) => {
        setWorkoutForm(prev => {
          const updatedExercises = [...prev.exercises];
          updatedExercises[index] = {
            ...updatedExercises[index],
            [field]: value
          };
          
          // If targetSets changed, update the sets array
          if (field === 'targetSets') {
            const currentSets = updatedExercises[index].sets || [];
            const targetSets = parseInt(value) || 0;
            
            if (targetSets > currentSets.length) {
              // Add more sets
              const additionalSets = Array(targetSets - currentSets.length).fill().map(() => ({
                setType: 'Standard',
                reps: updatedExercises[index].targetReps || 10,
                weight: updatedExercises[index].targetWeight || 0,
                isCompleted: false
              }));
              updatedExercises[index].sets = [...currentSets, ...additionalSets];
            } else if (targetSets < currentSets.length) {
              // Remove excess sets
              updatedExercises[index].sets = currentSets.slice(0, targetSets);
            }
          }
          
          return {
            ...prev,
            exercises: updatedExercises
          };
        });
      };
    
      // Move exercise up in the order
      const handleMoveExerciseUp = (index) => {
        if (index === 0) return;
        
        setWorkoutForm(prev => {
          const updatedExercises = [...prev.exercises];
          const temp = updatedExercises[index];
          updatedExercises[index] = updatedExercises[index - 1];
          updatedExercises[index - 1] = temp;
          
          return {
            ...prev,
            exercises: updatedExercises
          };
        });
      };
    
      // Move exercise down in the order
      const handleMoveExerciseDown = (index) => {
        setWorkoutForm(prev => {
          if (index === prev.exercises.length - 1) return prev;
          
          const updatedExercises = [...prev.exercises];
          const temp = updatedExercises[index];
          updatedExercises[index] = updatedExercises[index + 1];
          updatedExercises[index + 1] = temp;
          
          return {
            ...prev,
            exercises: updatedExercises
          };
        });
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
      if (isNewPlan || (!workoutId && paramPlanId)) {
        // Render workout plan form
        return (
          <div className="form-container">
            <h2>{isNewPlan ? 'Create New Workout Plan' : 'Edit Workout Plan'}</h2>
            
            <form onSubmit={handlePlanSubmit} className="workout-plan-form">
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
                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={planForm.difficulty}
                  onChange={handlePlanChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
    
              <div className="form-group">
                <label htmlFor="estimatedDuration">Estimated Duration (minutes per workout)</label>
                <input
                  type="number"
                  id="estimatedDuration"
                  name="estimatedDuration"
                  value={planForm.estimatedDuration}
                  onChange={handlePlanChange}
                  min="0"
                  max="300"
                />
              </div>
    
              <div className="form-group">
                <label htmlFor="tags">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={planForm.tags}
                  onChange={handlePlanChange}
                  placeholder="strength, cardio, flexibility, etc."
                />
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
                  onClick={() => navigate('/workouts')}
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
  return <>
   <div className="form-container">
        <h2>{workoutId ? 'Edit Workout' : 'Add New Workout'}</h2>
        
        {showExerciseSelector ? (
          <div className="exercise-selector-container">
            <div className="exercise-selector-header">
              <h3>Add Exercise to Workout</h3>
              <button 
                className="btn btn-outline"
                onClick={() => setShowExerciseSelector(false)}
              >
                <i className="fas fa-times"></i> Close
              </button>
            </div>
            <ExerciseSelector onSelectExercise={handleAddExercise} />
          </div>
        ) : (
          <form onSubmit={handleWorkoutSubmit} className="workout-form">
            <div className="form-group">
              <label htmlFor="name">Workout Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={workoutForm.name}
                onChange={handleWorkoutChange}
                required
              />
            </div>
  
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Workout Type</label>
                <select
                  id="type"
                  name="type"
                  value={workoutForm.type}
                  onChange={handleWorkoutChange}
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="Balance">Balance</option>
                  <option value="Sport">Sport Specific</option>
                  <option value="CrossFit">CrossFit</option>
                  <option value="Circuit">Circuit Training</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="scheduledDate">Scheduled Time</label>
                <input
                  type="datetime-local"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={workoutForm.scheduledDate}
                  onChange={handleWorkoutChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={workoutForm.duration}
                  onChange={handleWorkoutChange}
                  min="1"
                  max="300"
                />
              </div>
            </div>
  
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={workoutForm.notes}
                onChange={handleWorkoutChange}
                rows="2"
              />
            </div>
  
            <div className="exercises-section">
              <div className="exercises-header">
                <h3>Exercises</h3>
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowExerciseSelector(true)}
                >
                  <i className="fas fa-plus"></i> Add Exercise
                </button>
              </div>
              
              {workoutForm.exercises.length > 0 ? (
                <div className="exercises-list">
                  {workoutForm.exercises.map((exercise, index) => (
                    <div className="exercise-item" key={index}>
                      <div className="exercise-header">
                        <h4>{exercise.exerciseName}</h4>
                        <div className="exercise-actions">
                          <button 
                            type="button" 
                            className="btn-icon"
                            onClick={() => handleMoveExerciseUp(index)}
                            disabled={index === 0}
                          >
                            <i className="fas fa-arrow-up"></i>
                          </button>
                          <button 
                            type="button" 
                            className="btn-icon"
                            onClick={() => handleMoveExerciseDown(index)}
                            disabled={index === workoutForm.exercises.length - 1}
                          >
                            <i className="fas fa-arrow-down"></i>
                          </button>
                          <button 
                            type="button" 
                            className="btn-icon btn-remove"
                            onClick={() => handleRemoveExercise(index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="exercise-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Category</label>
                            <div className="static-value">{exercise.exerciseCategory || 'N/A'}</div>
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor={`targetSets-${index}`}>Sets</label>
                            <input
                              type="number"
                              id={`targetSets-${index}`}
                              value={exercise.targetSets}
                              onChange={(e) => handleUpdateSets(index, 'targetSets', parseInt(e.target.value) || 0)}
                              min="1"
                              max="20"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor={`targetReps-${index}`}>Target Reps</label>
                            <input
                              type="number"
                              id={`targetReps-${index}`}
                              value={exercise.targetReps}
                              onChange={(e) => handleUpdateSets(index, 'targetReps', parseInt(e.target.value) || 0)}
                              min="0"
                              max="100"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor={`targetWeight-${index}`}>Target Weight (kg)</label>
                            <input
                              type="number"
                              id={`targetWeight-${index}`}
                              value={exercise.targetWeight}
                              onChange={(e) => handleUpdateSets(index, 'targetWeight', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.5"
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor={`notes-${index}`}>Notes</label>
                          <input
                            type="text"
                            id={`notes-${index}`}
                            value={exercise.notes}
                            onChange={(e) => handleUpdateSets(index, 'notes', e.target.value)}
                            placeholder="Rest periods, tempo, etc."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-exercises">
                  <p>No exercises added to this workout yet</p>
                  <button 
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowExerciseSelector(true)}
                  >
                    <i className="fas fa-dumbbell"></i> Browse Exercise Library
                  </button>
                </div>
              )}
            </div>
  
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate(workoutId ? `/workouts/${workoutId}` : '/workouts')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting || workoutForm.exercises.length === 0}
              >
                {submitting ? 'Saving...' : (workoutId ? 'Update Workout' : 'Add Workout')}
              </button>
            </div>
          </form>
        )}
      </div>
  </>
   
  
}
