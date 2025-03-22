import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProgressList from '../components/progress/ProgressList.jsx';
import ProgressDetail from '../components/progress/ProgressDetail.jsx';
import ProgressForm from '../components/progress/ProgressForm.jsx';
// import PhotoGallery from '../components/progress/PhotoGallery';
import WeightChart from '../components/progress/WeightChart.jsx';
import GoalsList from '../components/progress/GoalsList.jsx';
import GoalForm from '../components/progress/GoalForm.jsx';
import { progressAPI } from '../api/progressAPI';
import { toast } from 'react-toastify';

const ProgressPage = () => {
  const [progressData, setProgressData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Get date range for the last 3 months
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        
        const formatDate = (date) => date.toISOString().split('T')[0];
        
        // Fetch progress data for the last 3 months
        const progressRecords = await progressAPI.getProgressRecords({
          startDate: formatDate(threeMonthsAgo),
          endDate: formatDate(today)
        });
        
        setProgressData(progressRecords);
        
        // Fetch goals
        const goalsData = await progressAPI.getGoals();
        setGoals(goalsData);
      } catch (error) {
        toast.error('Failed to load progress data');
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Update URL based on selected tab
    switch (tab) {
      case 'overview':
        navigate('/progress');
        break;
      case 'weight':
        navigate('/progress/weight');
        break;
      case 'photos':
        navigate('/progress/photos');
        break;
      case 'goals':
        navigate('/progress/goals');
        break;
      default:
        navigate('/progress');
    }
  };

  const handleAddProgress = () => {
    navigate('/progress/new');
  };

  const handleAddGoal = () => {
    navigate('/progress/goals/new');
  };

  // Calculate latest stats
  const getLatestStats = () => {
    if (!progressData.length) {
      return {
        weight: null,
        bodyFat: null,
        restingHeartRate: null,
        measurements: null
      };
    }
    
    // Sort by date descending to get latest record
    const sortedData = [...progressData].sort(
      (a, b) => new Date(b.recordDate) - new Date(a.recordDate)
    );
    
    const latestRecord = sortedData[0];
    
    let measurements = null;
    if (latestRecord.measurements) {
      try {
        measurements = typeof latestRecord.measurements === 'string' 
          ? JSON.parse(latestRecord.measurements) 
          : latestRecord.measurements;
      } catch (e) {
        console.error('Error parsing measurements:', e);
      }
    }
    
    return {
      weight: latestRecord.weight,
      bodyFat: latestRecord.bodyFat,
      restingHeartRate: latestRecord.restingHeartRate,
      measurements
    };
  };

  // Calculate progress (change from oldest to newest record)
  const calculateProgress = () => {
    if (progressData.length < 2) {
      return {
        weightChange: null,
        bodyFatChange: null
      };
    }
    
    // Sort by date
    const sortedData = [...progressData].sort(
      (a, b) => new Date(a.recordDate) - new Date(b.recordDate)
    );
    
    const oldest = sortedData[0];
    const newest = sortedData[sortedData.length - 1];
    
    return {
      weightChange: newest.weight && oldest.weight 
        ? (newest.weight - oldest.weight).toFixed(1) 
        : null,
      bodyFatChange: newest.bodyFat && oldest.bodyFat 
        ? (newest.bodyFat - oldest.bodyFat).toFixed(1) 
        : null
    };
  };

  const activeGoals = goals.filter(goal => !goal.isAchieved);
  const completedGoals = goals.filter(goal => goal.isAchieved);
  const latestStats = getLatestStats();
  const progressStats = calculateProgress();

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>Progress Tracking</h1>
        <div className="progress-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleAddProgress}
          >
            <i className="fas fa-plus"></i> Record Progress
          </button>
          <button 
            className="btn btn-outline" 
            onClick={handleAddGoal}
          >
            <i className="fas fa-bullseye"></i> Add Goal
          </button>
        </div>
      </div>

      <div className="progress-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <i className="fas fa-chart-line"></i> Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'weight' ? 'active' : ''}`}
          onClick={() => handleTabChange('weight')}
        >
          <i className="fas fa-weight"></i> Weight History
        </button>
        <button 
          className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`}
          onClick={() => handleTabChange('photos')}
        >
          <i className="fas fa-camera"></i> Progress Photos
        </button>
        <button 
          className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => handleTabChange('goals')}
        >
          <i className="fas fa-bullseye"></i> Goals
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading progress data...</p>
        </div>
      ) : (
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="progress-overview">
                <div className="stats-section">
                  <h2>Latest Measurements</h2>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-title">Weight</div>
                      <div className="stat-value">
                        {latestStats.weight ? `${latestStats.weight} kg` : 'Not recorded'}
                      </div>
                      {progressStats.weightChange && (
                        <div className={`stat-change ${parseFloat(progressStats.weightChange) < 0 ? 'decrease' : 'increase'}`}>
                          {progressStats.weightChange > 0 ? '+' : ''}{progressStats.weightChange} kg
                        </div>
                      )}
                    </div>
                    <div className="stat-card">
                      <div className="stat-title">Body Fat</div>
                      <div className="stat-value">
                        {latestStats.bodyFat ? `${latestStats.bodyFat}%` : 'Not recorded'}
                      </div>
                      {progressStats.bodyFatChange && (
                        <div className={`stat-change ${parseFloat(progressStats.bodyFatChange) < 0 ? 'decrease' : 'increase'}`}>
                          {progressStats.bodyFatChange > 0 ? '+' : ''}{progressStats.bodyFatChange}%
                        </div>
                      )}
                    </div>
                    <div className="stat-card">
                      <div className="stat-title">Resting Heart Rate</div>
                      <div className="stat-value">
                        {latestStats.restingHeartRate ? `${latestStats.restingHeartRate} bpm` : 'Not recorded'}
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-title">BMI</div>
                      <div className="stat-value">
                        {latestStats.weight ? (latestStats.weight / Math.pow(1.75, 2)).toFixed(1) : 'Not recorded'}
                      </div>
                    </div>
                  </div>
                  
                  {latestStats.measurements && (
                    <div className="measurements-section">
                      <h3>Body Measurements</h3>
                      <div className="measurements-grid">
                        {Object.entries(latestStats.measurements).map(([key, value]) => (
                          <div className="measurement-item" key={key}>
                            <div className="measurement-label">{key}</div>
                            <div className="measurement-value">{value} cm</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="chart-section">
                  <h2>Weight History</h2>
                  <WeightChart data={progressData} />
                </div>
                
                <div className="goals-section">
                  <div className="section-header">
                    <h2>Active Goals</h2>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={handleAddGoal}
                    >
                      <i className="fas fa-plus"></i> New Goal
                    </button>
                  </div>
                  {activeGoals.length > 0 ? (
                    <div className="goals-grid">
                      {activeGoals.slice(0, 3).map(goal => (
                        <div className="goal-card" key={goal.goalId}>
                          <div className="goal-type">{goal.type}</div>
                          <div className="goal-description">{goal.description}</div>
                          <div className="goal-progress">
                            <div className="progress-bar">
                              <div 
                                className="progress-value" 
                                style={{ 
                                  width: `${Math.min(
                                    Math.round(((goal.currentValue - goal.startValue) / 
                                    (goal.targetValue - goal.startValue)) * 100), 100)}%` 
                                }}
                              ></div>
                            </div>
                            <div className="progress-text">
                              {goal.currentValue} / {goal.targetValue} {goal.type === 'Weight' ? 'kg' : ''}
                            </div>
                          </div>
                          <div className="goal-dates">
                            Target: {new Date(goal.targetDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {activeGoals.length > 3 && (
                        <button 
                          className="view-all-goals"
                          onClick={() => handleTabChange('goals')}
                        >
                          View all goals ({activeGoals.length})
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="empty-goals">
                      <p>No active goals</p>
                      <button 
                        className="btn btn-outline"
                        onClick={handleAddGoal}
                      >
                        Create Your First Goal
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="entries-section">
                  <div className="section-header">
                    <h2>Recent Entries</h2>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={handleAddProgress}
                    >
                      <i className="fas fa-plus"></i> Add Entry
                    </button>
                  </div>
                  <ProgressList 
                    data={progressData} 
                    limit={5} 
                    showViewAll={true} 
                  />
                </div>
              </div>
            } 
          />
          <Route path="/weight" element={<WeightChart data={progressData} fullPage={true} />} />
          <Route path="/photos" element={<PhotoGallery />} />
          <Route path="/goals" element={
            <GoalsList 
              activeGoals={activeGoals} 
              completedGoals={completedGoals} 
            />
          } />
          <Route path="/goals/new" element={<GoalForm />} />
          <Route path="/goals/:goalId/edit" element={<GoalForm />} />
          <Route path="/new" element={<ProgressForm />} />
          <Route path="/:progressId" element={<ProgressDetail />} />
          <Route path="/:progressId/edit" element={<ProgressForm />} />
        </Routes>
      )}
    </div>
  );
};

export default ProgressPage;