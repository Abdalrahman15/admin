import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProgressList({ data, limit, showViewAll = false }) {
     const navigate = useNavigate();
      
      // Sort by record date desc
      const sortedData = [...data].sort(
        (a, b) => new Date(b.recordDate) - new Date(a.recordDate)
      );
      
      // Limit the number of records if requested
      const displayData = limit ? sortedData.slice(0, limit) : sortedData;
    
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      };
    
      const handleViewEntry = (progressId) => {
        navigate(`/progress/${progressId}`);
      };
    
      const handleViewAll = () => {
        navigate('/progress', { state: { showAllEntries: true } });
      };
    
      if (displayData.length === 0) {
        return (
          <div className="empty-progress">
            <p>No progress records found</p>
            <Link to="/progress/new" className="btn btn-outline">
              Record Your First Entry
            </Link>
          </div>
        );
      }
  return <>
   <div className="progress-list-container">
      <div className="progress-table">
        <div className="progress-header">
          <div className="date-column">Date</div>
          <div className="weight-column">Weight</div>
          <div className="body-fat-column">Body Fat</div>
          <div className="heart-rate-column">Heart Rate</div>
          <div className="photos-column">Photos</div>
          <div className="actions-column"></div>
        </div>
        
        {displayData.map((record) => (
          <div 
            key={record.progressId} 
            className="progress-row"
            onClick={() => handleViewEntry(record.progressId)}
          >
            <div className="date-column">
              {formatDate(record.recordDate)}
            </div>
            <div className="weight-column">
              {record.weight ? `${record.weight} kg` : '-'}
            </div>
            <div className="body-fat-column">
              {record.bodyFat ? `${record.bodyFat}%` : '-'}
            </div>
            <div className="heart-rate-column">
              {record.restingHeartRate ? `${record.restingHeartRate} bpm` : '-'}
            </div>
            <div className="photos-column">
              {record.photos && record.photos.length > 0 ? (
                <span className="photo-count">
                  <i className="fas fa-camera"></i> {record.photos.length}
                </span>
              ) : (
                '-'
              )}
            </div>
            <div className="actions-column">
              <button className="btn-view">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {showViewAll && data.length > limit && (
        <div className="view-all-container">
          <button 
            className="btn-view-all"
            onClick={handleViewAll}
          >
            View All Entries ({data.length})
          </button>
        </div>
      )}
    </div>
  
  </>
    
}
