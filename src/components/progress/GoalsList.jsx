import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressAPI } from '../../api/progressAPI';
import { toast } from 'react-toastify';

export default function GoalsList({ activeGoals = [], completedGoals = [] }) {
    const [showCompleted, setShowCompleted] = useState(false);
      const navigate = useNavigate();
    
      const handleAddGoal = () => {
        navigate('/progress/goals/new');
      };
    
      const handleEditGoal = (goalId) => {
        navigate(`/progress/goals/${goalId}/edit`);
      };
    
      const handleDeleteGoal = async (goalId) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
          try {
            await progressAPI.deleteGoal(goalId);
            toast.success('Goal deleted successfully');
            // Refresh the page to update the goals list
            navigate(0);
          } catch (error) {
            toast.error('Failed to delete goal');
            console.error('Error deleting goal:', error);
          }
        }
      };
    
      const handleCompleteGoal = async (goalId) => {
        try {
          await progressAPI.completeGoal(goalId);
          toast.success('Goal marked as completed!');
          // Refresh the page to update the goals list
          navigate(0);
        } catch (error) {
          toast.error('Failed to complete goal');
          console.error('Error completing goal:', error);
        }
      };
    
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      };
    
      const calculateProgress = (goal) => {
        const progress = Math.min(
          Math.round(((goal.currentValue - goal.startValue) / 
          (goal.targetValue - goal.startValue)) * 100), 100);
        
        return isNaN(progress) ? 0 : progress;
      };
    
      const getDaysRemaining = (targetDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const target = new Date(targetDate);
        target.setHours(0, 0, 0, 0);
        
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
      };
    
      const getStatusClass = (targetDate) => {
        const daysRemaining = getDaysRemaining(targetDate);
        
        if (daysRemaining < 0) {
          return 'overdue';
        } else if (daysRemaining <= 7) {
          return 'due-soon';
        } else {
          return 'on-track';
        }
      };
  return<>
  <div className="goals-list-container">
      <div className="goals-header">
        <h2>Your Goals</h2>
        <button 
          className="btn btn-primary"
          onClick={handleAddGoal}
        >
          <i className="fas fa-plus"></i> New Goal
        </button>
      </div>

      <div className="goals-section">
        <h3>Active Goals ({activeGoals.length})</h3>
        
        {activeGoals.length > 0 ? (
          <div className="goals-grid">
            {activeGoals.map(goal => {
              const progress = calculateProgress(goal);
              const daysRemaining = getDaysRemaining(goal.targetDate);
              const statusClass = getStatusClass(goal.targetDate);
              
              return (
                <div className={`goal-card ${statusClass}`} key={goal.goalId}>
                  <div className="goal-header">
                    <div className="goal-type">{goal.type}</div>
                    <div className="goal-actions">
                      <button 
                        className="btn-icon"
                        onClick={() => handleEditGoal(goal.goalId)}
                        title="Edit Goal"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => handleDeleteGoal(goal.goalId)}
                        title="Delete Goal"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="goal-description">{goal.description}</div>
                  
                  <div className="goal-values">
                    <div className="goal-start">
                      Start: {goal.startValue} {goal.type === 'Weight' ? 'kg' : ''}
                    </div>
                    <div className="goal-current">
                      Current: {goal.currentValue} {goal.type === 'Weight' ? 'kg' : ''}
                    </div>
                    <div className="goal-target">
                      Target: {goal.targetValue} {goal.type === 'Weight' ? 'kg' : ''}
                    </div>
                  </div>
                  
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-value" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">{progress}% Complete</div>
                  </div>
                  
                  <div className="goal-footer">
                    <div className="goal-dates">
                      <div className="goal-start-date">
                        <i className="far fa-calendar"></i> Started: {formatDate(goal.startDate)}
                      </div>
                      <div className={`goal-target-date ${statusClass}`}>
                        <i className="far fa-calendar-check"></i> Target: {formatDate(goal.targetDate)}
                        {daysRemaining > 0 ? 
                          ` (${daysRemaining} days left)` : 
                          ` (${Math.abs(daysRemaining)} days overdue)`}
                      </div>
                    </div>
                    
                    <button 
                      className="btn btn-success"
                      onClick={() => handleCompleteGoal(goal.goalId)}
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-goals">
            <p>You don't have any active goals</p>
            <button 
              className="btn btn-outline"
              onClick={handleAddGoal}
            >
              Create a Goal
            </button>
          </div>
        )}
      </div>

      <div className="completed-goals-section">
        <div className="section-header" onClick={() => setShowCompleted(!showCompleted)}>
          <h3>Completed Goals ({completedGoals.length})</h3>
          <button className="btn-toggle">
            <i className={`fas fa-chevron-${showCompleted ? 'up' : 'down'}`}></i>
          </button>
        </div>
        
        {showCompleted && completedGoals.length > 0 && (
          <div className="completed-goals-grid">
            {completedGoals.map(goal => (
              <div className="completed-goal-card" key={goal.goalId}>
                <div className="goal-header">
                  <div className="goal-type">{goal.type}</div>
                  <div className="completed-badge">
                    <i className="fas fa-check-circle"></i> Completed
                  </div>
                </div>
                
                <div className="goal-description">{goal.description}</div>
                
                <div className="goal-values">
                  <div className="goal-start">
                    Start: {goal.startValue} {goal.type === 'Weight' ? 'kg' : ''}
                  </div>
                  <div className="goal-target">
                    Target: {goal.targetValue} {goal.type === 'Weight' ? 'kg' : ''}
                  </div>
                </div>
                
                <div className="goal-footer">
                  <div className="goal-dates">
                    <div className="goal-start-date">
                      <i className="far fa-calendar"></i> Started: {formatDate(goal.startDate)}
                    </div>
                    <div className="goal-achieved-date">
                      <i className="fas fa-trophy"></i> Achieved: {formatDate(goal.achievedAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div></>
}
