import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { progressAPI } from '../../api/progressAPI';
import { toast } from 'react-toastify';
export default function GoalForm() {
     const { goalId } = useParams();
      const navigate = useNavigate();
      const [loading, setLoading] = useState(goalId ? true : false);
      const [submitting, setSubmitting] = useState(false);
      
      // Initial form state
      const [formData, setFormData] = useState({
        type: 'Weight',
        description: '',
        startValue: '',
        currentValue: '',
        targetValue: '',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: '',
        isAchieved: false
      });
    
      // Available goal types
      const goalTypes = ['Weight', 'Strength', 'Cardio', 'Measurement', 'Habit', 'Other'];
    
      // Fetch existing data if editing
      useEffect(() => {
        const fetchGoal = async () => {
          if (!goalId) return;
          
          try {
            setLoading(true);
            const goalData = await progressAPI.getGoal(goalId);
            
            // Format dates
            const startDate = new Date(goalData.startDate).toISOString().split('T')[0];
            const targetDate = new Date(goalData.targetDate).toISOString().split('T')[0];
            
            setFormData({
              type: goalData.type || 'Weight',
              description: goalData.description || '',
              startValue: goalData.startValue || '',
              currentValue: goalData.currentValue || '',
              targetValue: goalData.targetValue || '',
              startDate,
              targetDate,
              isAchieved: goalData.isAchieved || false
            });
          } catch (error) {
            toast.error('Failed to load goal data');
            console.error('Error fetching goal:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchGoal();
      }, [goalId]);
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setFormData({
          ...formData,
          [name]: type === 'checkbox' ? checked : value
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          setSubmitting(true);
          
          // Validate target date is in the future
          const targetDate = new Date(formData.targetDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (targetDate < today) {
            toast.error('Target date must be in the future');
            setSubmitting(false);
            return;
          }
          
          // Ensure current value is set if not provided
          const goalData = {
            ...formData,
            currentValue: formData.currentValue || formData.startValue
          };
          
          // Convert numeric values
          goalData.startValue = parseFloat(goalData.startValue);
          goalData.currentValue = parseFloat(goalData.currentValue);
          goalData.targetValue = parseFloat(goalData.targetValue);
          
          if (goalId) {
            // Update existing goal
            await progressAPI.updateGoal(goalId, goalData);
            toast.success('Goal updated successfully');
          } else {
            // Create new goal
            await progressAPI.createGoal(goalData);
            toast.success('Goal created successfully');
          }
          
          navigate('/progress/goals');
        } catch (error) {
          toast.error('Failed to save goal');
          console.error('Error saving goal:', error);
        } finally {
          setSubmitting(false);
        }
      };
    
      if (loading) {
        return (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading goal data...</p>
          </div>
        );
      }
  return <>
    <div className="goal-form-container">
      <h2>{goalId ? 'Edit Goal' : 'Create New Goal'}</h2>
      
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="type">Goal Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {goalTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Lose weight, Increase bench press"
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Goal Values</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startValue">Starting Value</label>
              <input
                type="number"
                id="startValue"
                name="startValue"
                value={formData.startValue}
                onChange={handleChange}
                step="0.1"
                placeholder={formData.type === 'Weight' ? 'kg' : 'value'}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="currentValue">Current Value</label>
              <input
                type="number"
                id="currentValue"
                name="currentValue"
                value={formData.currentValue}
                onChange={handleChange}
                step="0.1"
                placeholder={formData.type === 'Weight' ? 'kg' : 'value'}
              />
              <small>If left empty, will use starting value</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="targetValue">Target Value</label>
              <input
                type="number"
                id="targetValue"
                name="targetValue"
                value={formData.targetValue}
                onChange={handleChange}
                step="0.1"
                placeholder={formData.type === 'Weight' ? 'kg' : 'value'}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Timeline</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="targetDate">Target Date</label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        
        {goalId && (
          <div className="form-section">
            <div className="form-group checkbox-group">
              <label htmlFor="isAchieved" className="checkbox-label">
                <input
                  type="checkbox"
                  id="isAchieved"
                  name="isAchieved"
                  checked={formData.isAchieved}
                  onChange={handleChange}
                />
                <span>Mark goal as achieved</span>
              </label>
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/progress/goals')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting 
              ? (goalId ? 'Updating...' : 'Creating...') 
              : (goalId ? 'Update Goal' : 'Create Goal')}
          </button>
        </div>
      </form>
    </div>
  
  </>
}
