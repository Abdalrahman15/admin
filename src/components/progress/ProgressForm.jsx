import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { progressAPI } from '../../api/progressAPI';
import { toast } from 'react-toastify';

export default function ProgressForm() {
    const { progressId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(progressId ? true : false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    
    // Initial form state
    const [formData, setFormData] = useState({
      recordDate: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: '',
      restingHeartRate: '',
      notes: '',
      measurements: {
        chest: '',
        waist: '',
        hips: '',
        biceps: '',
        thighs: '',
        calves: ''
      }
    });
  
    // Fetch existing data if editing
    useEffect(() => {
      const fetchProgressRecord = async () => {
        if (!progressId) return;
        
        try {
          setLoading(true);
          const progressRecord = await progressAPI.getProgressRecord(progressId);
          
          // Parse measurements if it's a string
          let measurements = progressRecord.measurements;
          if (typeof measurements === 'string' && measurements) {
            try {
              measurements = JSON.parse(measurements);
            } catch (e) {
              console.error('Error parsing measurements:', e);
              measurements = {};
            }
          } else if (!measurements) {
            measurements = {};
          }
          
          // Format the date
          const recordDate = new Date(progressRecord.recordDate).toISOString().split('T')[0];
          
          setFormData({
            recordDate,
            weight: progressRecord.weight || '',
            bodyFat: progressRecord.bodyFat || '',
            restingHeartRate: progressRecord.restingHeartRate || '',
            notes: progressRecord.notes || '',
            measurements: {
              chest: measurements.chest || '',
              waist: measurements.waist || '',
              hips: measurements.hips || '',
              biceps: measurements.biceps || '',
              thighs: measurements.thighs || '',
              calves: measurements.calves || ''
            }
          });
        } catch (error) {
          toast.error('Failed to load progress record');
          console.error('Error fetching progress record:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProgressRecord();
    }, [progressId]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      
      // Regular form fields
      if (name !== 'chest' && name !== 'waist' && name !== 'hips' && 
          name !== 'biceps' && name !== 'thighs' && name !== 'calves') {
        setFormData({
          ...formData,
          [name]: value
        });
      } 
      // Measurements fields
      else {
        setFormData({
          ...formData,
          measurements: {
            ...formData.measurements,
            [name]: value
          }
        });
      }
    };
  
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      // Generate previews
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };
  
    const removeFile = (index) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
      
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(previewUrls[index]);
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        setSubmitting(true);
        
        // Clean up the data for submission
        const cleanedMeasurements = {};
        
        // Only include measurements with values
        Object.entries(formData.measurements).forEach(([key, value]) => {
          if (value) {
            cleanedMeasurements[key] = parseFloat(value);
          }
        });
        
        const progressData = {
          recordDate: formData.recordDate,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
          restingHeartRate: formData.restingHeartRate ? parseInt(formData.restingHeartRate) : null,
          notes: formData.notes,
          measurements: Object.keys(cleanedMeasurements).length > 0 
            ? JSON.stringify(cleanedMeasurements) 
            : null
        };
        
        let progressRecordId;
        
        if (progressId) {
          // Update existing record
          await progressAPI.updateProgressRecord(progressId, progressData);
          progressRecordId = progressId;
          toast.success('Progress record updated successfully');
        } else {
          // Create new record
          const response = await progressAPI.createProgressRecord(progressData);
          progressRecordId = response.progressId;
          toast.success('Progress record created successfully');
        }
        
        // Upload photos if any
        if (selectedFiles.length > 0) {
          for (const file of selectedFiles) {
            // In a real app, you'd upload to a server or cloud storage
            // This is a simplified example
            const photoData = {
              imageURL: URL.createObjectURL(file), // In real app, this would be the URL from the server
              takenDate: new Date().toISOString(),
              type: 'Front',
              isPrivate: true
            };
            
            await progressAPI.addProgressPhoto(progressRecordId, photoData);
          }
          
          toast.success(`${selectedFiles.length} photos uploaded`);
        }
        
        navigate(`/progress/${progressRecordId}`);
      } catch (error) {
        toast.error('Failed to save progress record');
        console.error('Error saving progress record:', error);
      } finally {
        setSubmitting(false);
      }
    };
  
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }
  return <>

<div className="progress-form-container">
      <h2>{progressId ? 'Edit Progress Record' : 'Record New Progress'}</h2>
      
      <form onSubmit={handleSubmit} className="progress-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="recordDate">Date</label>
            <input
              type="date"
              id="recordDate"
              name="recordDate"
              value={formData.recordDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="500"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bodyFat">Body Fat %</label>
              <input
                type="number"
                id="bodyFat"
                name="bodyFat"
                value={formData.bodyFat}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="restingHeartRate">Resting Heart Rate (bpm)</label>
              <input
                type="number"
                id="restingHeartRate"
                name="restingHeartRate"
                value={formData.restingHeartRate}
                onChange={handleChange}
                min="0"
                max="250"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Body Measurements (cm)</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="chest">Chest</label>
              <input
                type="number"
                id="chest"
                name="chest"
                value={formData.measurements.chest}
                onChange={handleChange}
                step="0.1"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="waist">Waist</label>
              <input
                type="number"
                id="waist"
                name="waist"
                value={formData.measurements.waist}
                onChange={handleChange}
                step="0.1"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="hips">Hips</label>
              <input
                type="number"
                id="hips"
                name="hips"
                value={formData.measurements.hips}
                onChange={handleChange}
                step="0.1"
                min="0"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="biceps">Biceps</label>
              <input
                type="number"
                id="biceps"
                name="biceps"
                value={formData.measurements.biceps}
                onChange={handleChange}
                step="0.1"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="thighs">Thighs</label>
              <input
                type="number"
                id="thighs"
                name="thighs"
                value={formData.measurements.thighs}
                onChange={handleChange}
                step="0.1"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="calves">Calves</label>
              <input
                type="number"
                id="calves"
                name="calves"
                value={formData.measurements.calves}
                onChange={handleChange}
                step="0.1"
                min="0"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Progress Photos</h3>
          
          <div className="photo-upload">
            <label htmlFor="photos" className="photo-upload-label">
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Choose Photos</span>
            </label>
            <input
              type="file"
              id="photos"
              name="photos"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="photo-input"
            />
            
            {previewUrls.length > 0 && (
              <div className="photo-previews">
                {previewUrls.map((url, index) => (
                  <div key={index} className="photo-preview-container">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="photo-preview" 
                    />
                    <button 
                      type="button"
                      className="remove-photo"
                      onClick={() => removeFile(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Notes</h3>
          
          <div className="form-group">
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add any additional notes or observations..."
            ></textarea>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/progress')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting 
              ? (progressId ? 'Updating...' : 'Saving...') 
              : (progressId ? 'Update Record' : 'Save Record')}
          </button>
        </div>
      </form>
    </div>
  </>

}
