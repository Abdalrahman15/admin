import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { workoutsAPI } from '../../api/workoutsAPI';
import { toast } from 'react-toastify';
export default function ExerciseDetail() {

    const { exerciseId } = useParams();
      const [exercise, setExercise] = useState(null);
      const [loading, setLoading] = useState(true);
      const navigate = useNavigate();
    
      useEffect(() => {
        const fetchExercise = async () => {
          try {
            setLoading(true);
            const exerciseData = await workoutsAPI.getExercise(exerciseId);
            setExercise(exerciseData);
          } catch (error) {
            toast.error('Failed to load exercise details');
            console.error('Error fetching exercise:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchExercise();
      }, [exerciseId]);
    
      const handleGoBack = () => {
        navigate(-1);
      };
    
      if (loading) {
        return (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading exercise details...</p>
          </div>
        );
      }
    
      if (!exercise) {
        return (
          <div className="error-container">
            <p>Exercise not found</p>
            <button className="btn btn-primary" onClick={handleGoBack}>
              Go Back
            </button>
          </div>
        );
      }
  return <>
   <div className="exercise-detail-container">
        <button className="btn-back" onClick={handleGoBack}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        
        <div className="exercise-detail-header">
          <h2>{exercise.name}</h2>
          <div className="exercise-tags">
            {exercise.category && (
              <span className="exercise-tag category">
                <i className="fas fa-tag"></i> {exercise.category}
              </span>
            )}
            {exercise.difficulty && (
              <span className="exercise-tag difficulty">
                <i className="fas fa-signal"></i> {exercise.difficulty}
              </span>
            )}
            {exercise.equipment && (
              <span className="exercise-tag equipment">
                <i className="fas fa-dumbbell"></i> {exercise.equipment}
              </span>
            )}
            {exercise.isVerified && (
              <span className="exercise-tag verified">
                <i className="fas fa-check-circle"></i> Verified
              </span>
            )}
          </div>
        </div>
  
        <div className="exercise-content">
          <div className="exercise-media">
            {exercise.media && exercise.media.length > 0 ? (
              <div className="media-gallery">
                {exercise.media.map(media => (
                  <div className="media-item" key={media.mediaId}>
                    {media.mediaType === 'Image' ? (
                      <img src={media.url} alt={exercise.name} />
                    ) : media.mediaType === 'Video' ? (
                      <video controls>
                        <source src={media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <a href={media.url} target="_blank" rel="noopener noreferrer">
                        View Media
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="placeholder-image">
                <i className="fas fa-dumbbell"></i>
                <p>No media available</p>
              </div>
            )}
          </div>
  
          <div className="exercise-info-container">
            {exercise.description && (
              <div className="info-section">
                <h3>Description</h3>
                <p>{exercise.description}</p>
              </div>
            )}
  
            <div className="info-section">
              <h3>Target Muscles</h3>
              {exercise.targetMuscles && exercise.targetMuscles.length > 0 ? (
                <div className="muscle-groups">
                  <div className="primary-muscles">
                    <h4>Primary</h4>
                    <ul className="muscle-list">
                      {exercise.targetMuscles
                        .filter(muscle => muscle.isPrimary)
                        .map(muscle => (
                          <li key={muscle.muscleGroup}>
                            {muscle.muscleGroup}
                          </li>
                        ))}
                    </ul>
                  </div>
                  
                  {exercise.targetMuscles.some(muscle => !muscle.isPrimary) && (
                    <div className="secondary-muscles">
                      <h4>Secondary</h4>
                      <ul className="muscle-list">
                        {exercise.targetMuscles
                          .filter(muscle => !muscle.isPrimary)
                          .map(muscle => (
                            <li key={muscle.muscleGroup}>
                              {muscle.muscleGroup}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p>No muscle data available</p>
              )}
            </div>
  
            <div className="info-section">
              <h3>Instructions</h3>
              {exercise.instructions ? (
                <div className="instructions">
                  {exercise.instructions.split('\n').map((instruction, index) => (
                    instruction.trim() && (
                      <p key={index}>{instruction}</p>
                    )
                  ))}
                </div>
              ) : (
                <p>No instructions available</p>
              )}
            </div>
          </div>
        </div>
  
        <div className="exercise-actions">
          <button 
            className="btn btn-primary"
            onClick={() => {
              // In a real app, this would open a workout selection dialog
              toast.info('Select a workout to add this exercise to');
            }}
          >
            <i className="fas fa-plus"></i> Add to Workout
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => {
              // In a real app, this would save to favorites
              toast.success('Added to favorites');
            }}
          >
            <i className="far fa-heart"></i> Add to Favorites
          </button>
        </div>
  
        <div className="similar-exercises">
          <h3>Similar Exercises</h3>
          <div className="similar-grid">
            {/* In a real app, these would be dynamically loaded */}
            <div className="similar-card">
              <div className="similar-name">Barbell Bench Press</div>
              <div className="similar-category">Strength</div>
              <button className="btn-view">View</button>
            </div>
            <div className="similar-card">
              <div className="similar-name">Dumbbell Bench Press</div>
              <div className="similar-category">Strength</div>
              <button className="btn-view">View</button>
            </div>
            <div className="similar-card">
              <div className="similar-name">Incline Bench Press</div>
              <div className="similar-category">Strength</div>
              <button className="btn-view">View</button>
            </div>
          </div>
        </div>
      </div>
  </>

}
