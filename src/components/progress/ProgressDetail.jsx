import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { progressAPI } from '../../api/progressAPI';
import { toast } from 'react-toastify';
export default function ProgressDetail() {
    const { progressId } = useParams();
      const [progress, setProgress] = useState(null);
      const [loading, setLoading] = useState(true);
      const [activePhotoIndex, setActivePhotoIndex] = useState(0);
      const [showPhotoModal, setShowPhotoModal] = useState(false);
      const navigate = useNavigate();
    
      useEffect(() => {
        const fetchProgressRecord = async () => {
          try {
            setLoading(true);
            const progressData = await progressAPI.getProgressRecord(progressId);
            setProgress(progressData);
          } catch (error) {
            toast.error('Failed to load progress record');
            console.error('Error fetching progress record:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProgressRecord();
      }, [progressId]);
    
      const handleEditRecord = () => {
        navigate(`/progress/${progressId}/edit`);
      };
    
      const handleDeleteRecord = async () => {
        if (window.confirm('Are you sure you want to delete this progress record?')) {
          try {
            await progressAPI.deleteProgressRecord(progressId);
            toast.success('Progress record deleted successfully');
            navigate('/progress');
          } catch (error) {
            toast.error('Failed to delete record');
            console.error('Error deleting record:', error);
          }
        }
      };
    
      const openPhotoModal = (index) => {
        setActivePhotoIndex(index);
        setShowPhotoModal(true);
      };
    
      const closePhotoModal = () => {
        setShowPhotoModal(false);
      };
    
      const nextPhoto = () => {
        setActivePhotoIndex((prevIndex) => 
          prevIndex === (progress.photos.length - 1) ? 0 : prevIndex + 1
        );
      };
    
      const prevPhoto = () => {
        setActivePhotoIndex((prevIndex) => 
          prevIndex === 0 ? progress.photos.length - 1 : prevIndex - 1
        );
      };
    
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      };
    
      // Parse measurements from string to object if necessary
      const getMeasurements = () => {
        if (!progress.measurements) return null;
        
        if (typeof progress.measurements === 'string') {
          try {
            return JSON.parse(progress.measurements);
          } catch (e) {
            console.error('Error parsing measurements:', e);
            return null;
          }
        }
        
        return progress.measurements;
      };
    
      if (loading) {
        return (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading progress details...</p>
          </div>
        );
      }
    
      if (!progress) {
        return (
          <div className="error-container">
            <p>Progress record not found</p>
            <Link to="/progress" className="btn btn-primary">Return to Progress</Link>
          </div>
        );
      }
    
      const measurements = getMeasurements();
  return <>
  <div className="progress-detail-container">
        <div className="progress-detail-header">
          <div className="progress-header-content">
            <h2>Progress Record: {formatDate(progress.recordDate)}</h2>
          </div>
          <div className="progress-header-actions">
            <button 
              className="btn btn-outline"
              onClick={handleEditRecord}
            >
              <i className="fas fa-edit"></i> Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDeleteRecord}
            >
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
  
        <div className="progress-detail-grid">
          <div className="progress-stats-card">
            <h3>Body Stats</h3>
            <div className="stats-grid">
              {progress.weight && (
                <div className="stat-item">
                  <span className="stat-label">Weight</span>
                  <span className="stat-value">{progress.weight} kg</span>
                </div>
              )}
              {progress.bodyFat && (
                <div className="stat-item">
                  <span className="stat-label">Body Fat</span>
                  <span className="stat-value">{progress.bodyFat}%</span>
                </div>
              )}
              {progress.bmi && (
                <div className="stat-item">
                  <span className="stat-label">BMI</span>
                  <span className="stat-value">{progress.bmi}</span>
                </div>
              )}
              {progress.bmr && (
                <div className="stat-item">
                  <span className="stat-label">BMR</span>
                  <span className="stat-value">{progress.bmr} kcal</span>
                </div>
              )}
              {progress.restingHeartRate && (
                <div className="stat-item">
                  <span className="stat-label">Resting Heart Rate</span>
                  <span className="stat-value">{progress.restingHeartRate} bpm</span>
                </div>
              )}
            </div>
          </div>
  
          {measurements && Object.keys(measurements).length > 0 && (
            <div className="progress-measurements-card">
              <h3>Body Measurements</h3>
              <div className="measurements-grid">
                {Object.entries(measurements).map(([key, value]) => (
                  <div className="measurement-item" key={key}>
                    <span className="measurement-label">{key}</span>
                    <span className="measurement-value">{value} cm</span>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {progress.notes && (
            <div className="progress-notes-card">
              <h3>Notes</h3>
              <div className="notes-content">
                {progress.notes.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          )}
  
          {progress.photos && progress.photos.length > 0 && (
            <div className="progress-photos-card">
              <h3>Progress Photos</h3>
              <div className="photos-grid">
                {progress.photos.map((photo, index) => (
                  <div 
                    key={photo.photoId} 
                    className="photo-thumbnail"
                    onClick={() => openPhotoModal(index)}
                  >
                    <img 
                      src={photo.imageURL} 
                      alt={`Progress ${index + 1}`} 
                    />
                    <div className="photo-overlay">
                      <span className="photo-type">{photo.type || 'Photo'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Photo Modal */}
        {showPhotoModal && progress.photos && progress.photos.length > 0 && (
          <div className="photo-modal-overlay" onClick={closePhotoModal}>
            <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closePhotoModal}>
                <i className="fas fa-times"></i>
              </button>
              
              <div className="photo-display">
                <img 
                  src={progress.photos[activePhotoIndex].imageURL} 
                  alt={`Progress ${activePhotoIndex + 1}`} 
                />
              </div>
              
              <div className="photo-controls">
                <button className="photo-nav prev" onClick={prevPhoto}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="photo-info">
                  <span className="photo-count">
                    {activePhotoIndex + 1} / {progress.photos.length}
                  </span>
                  <span className="photo-type">
                    {progress.photos[activePhotoIndex].type || 'Photo'}
                  </span>
                  <span className="photo-date">
                    {new Date(progress.photos[activePhotoIndex].takenDate).toLocaleDateString()}
                  </span>
                </div>
                <button className="photo-nav next" onClick={nextPhoto}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Navigation */}
        <div className="record-navigation">
          <Link to="/progress" className="btn btn-back">
            <i className="fas fa-arrow-left"></i> Back to Progress
          </Link>
        </div>
      </div>
  
  </>
    
}
