import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useNavigate } from 'react-router-dom';


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function WeightChart({ data, fullPage = false }) {
   const [chartData, setChartData] = useState(null);
     const [dateRange, setDateRange] = useState('3m'); // Default to 3 months
     const navigate = useNavigate();
   
     // Prepare chart data when input data changes
     useEffect(() => {
       if (!data || data.length === 0) return;
   
       // Filter data by selected date range
       const filteredData = filterDataByRange(data, dateRange);
       
       // Sort by date
       const sortedData = [...filteredData].sort(
         (a, b) => new Date(a.recordDate) - new Date(b.recordDate)
       );
       
       // Extract dates and weights
       const dates = sortedData.map(record => new Date(record.recordDate));
       const weights = sortedData.map(record => record.weight);
       const bodyFats = sortedData.map(record => record.bodyFat);
       
       setChartData({
         labels: dates,
         datasets: [
           {
             label: 'Weight (kg)',
             data: weights,
             fill: false,
             backgroundColor: 'rgba(75, 192, 192, 0.2)',
             borderColor: 'rgba(75, 192, 192, 1)',
             tension: 0.1,
             yAxisID: 'y'
           },
           {
             label: 'Body Fat (%)',
             data: bodyFats,
             fill: false,
             backgroundColor: 'rgba(255, 99, 132, 0.2)',
             borderColor: 'rgba(255, 99, 132, 1)',
             tension: 0.1,
             yAxisID: 'y1'
           }
         ]
       });
     }, [data, dateRange]);
   
     const filterDataByRange = (data, range) => {
       const today = new Date();
       let startDate;
       
       switch (range) {
         case '1m':
           startDate = new Date(today);
           startDate.setMonth(today.getMonth() - 1);
           break;
         case '3m':
           startDate = new Date(today);
           startDate.setMonth(today.getMonth() - 3);
           break;
         case '6m':
           startDate = new Date(today);
           startDate.setMonth(today.getMonth() - 6);
           break;
         case '1y':
           startDate = new Date(today);
           startDate.setFullYear(today.getFullYear() - 1);
           break;
         case 'all':
           return data;
         default:
           startDate = new Date(today);
           startDate.setMonth(today.getMonth() - 3);
       }
       
       return data.filter(record => new Date(record.recordDate) >= startDate);
     };
   
     const handleRangeChange = (range) => {
       setDateRange(range);
     };
   
     const handleAddRecord = () => {
       navigate('/progress/new');
     };
   
     const chartOptions = {
       responsive: true,
       interaction: {
         mode: 'index',
         intersect: false,
       },
       stacked: false,
       plugins: {
         title: {
           display: true,
           text: 'Weight and Body Fat History',
           font: {
             size: 16
           }
         },
         tooltip: {
           callbacks: {
             title: function(tooltipItems) {
               const date = new Date(tooltipItems[0].parsed.x);
               return date.toLocaleDateString(undefined, { 
                 year: 'numeric', 
                 month: 'long', 
                 day: 'numeric' 
               });
             }
           }
         }
       },
       scales: {
         x: {
           type: 'time',
           time: {
             unit: 'day',
             tooltipFormat: 'PP',
             displayFormats: {
               day: 'MMM d'
             }
           },
           title: {
             display: true,
             text: 'Date'
           }
         },
         y: {
           type: 'linear',
           display: true,
           position: 'left',
           title: {
             display: true,
             text: 'Weight (kg)'
           },
           grid: {
             drawOnChartArea: false,
           },
         },
         y1: {
           type: 'linear',
           display: true,
           position: 'right',
           title: {
             display: true,
             text: 'Body Fat (%)'
           },
           grid: {
             drawOnChartArea: false,
           },
           min: 0,
           max: 40
         },
       },
     };
   
     // Calculate weight change stats
     const calculateStats = () => {
       if (!data || data.length < 2) return null;
       
       // Sort by date
       const sortedData = [...data]
         .filter(record => record.weight)
         .sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));
       
       if (sortedData.length < 2) return null;
       
       const firstRecord = sortedData[0];
       const lastRecord = sortedData[sortedData.length - 1];
       
       const weightChange = lastRecord.weight - firstRecord.weight;
       const startDate = new Date(firstRecord.recordDate);
       const endDate = new Date(lastRecord.recordDate);
       const daysDiff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
       
       // Calculate weekly average change
       const weeklyChange = (weightChange / daysDiff) * 7;
       
       return {
         startWeight: firstRecord.weight,
         currentWeight: lastRecord.weight,
         totalChange: weightChange.toFixed(1),
         totalDays: daysDiff,
         weeklyChange: weeklyChange.toFixed(2)
       };
     };
   
     const stats = calculateStats();
  return <>
  <div className={`weight-chart-container ${fullPage ? 'full-page' : ''}`}>
        {fullPage && (
          <div className="chart-header">
            <h2>Weight History</h2>
            <button 
              className="btn btn-primary"
              onClick={handleAddRecord}
            >
              <i className="fas fa-plus"></i> Add Record
            </button>
          </div>
        )}
        
        <div className="chart-controls">
          <div className="date-range-selector">
            <button 
              className={`range-button ${dateRange === '1m' ? 'active' : ''}`}
              onClick={() => handleRangeChange('1m')}
            >
              1M
            </button>
            <button 
              className={`range-button ${dateRange === '3m' ? 'active' : ''}`}
              onClick={() => handleRangeChange('3m')}
            >
              3M
            </button>
            <button 
              className={`range-button ${dateRange === '6m' ? 'active' : ''}`}
              onClick={() => handleRangeChange('6m')}
            >
              6M
            </button>
            <button 
              className={`range-button ${dateRange === '1y' ? 'active' : ''}`}
              onClick={() => handleRangeChange('1y')}
            >
              1Y
            </button>
            <button 
              className={`range-button ${dateRange === 'all' ? 'active' : ''}`}
              onClick={() => handleRangeChange('all')}
            >
              All
            </button>
          </div>
        </div>
        
        <div className="chart-wrapper">
          {chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="no-data">
              <p>No weight data available</p>
              <button 
                className="btn btn-outline"
                onClick={handleAddRecord}
              >
                Record Your Weight
              </button>
            </div>
          )}
        </div>
        
        {stats && fullPage && (
          <div className="weight-stats">
            <div className="stats-card">
              <div className="stat-item">
                <span className="stat-label">Starting Weight</span>
                <span className="stat-value">{stats.startWeight} kg</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Current Weight</span>
                <span className="stat-value">{stats.currentWeight} kg</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Change</span>
                <span className={`stat-value ${parseFloat(stats.totalChange) < 0 ? 'decrease' : 'increase'}`}>
                  {stats.totalChange > 0 ? '+' : ''}{stats.totalChange} kg
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time Period</span>
                <span className="stat-value">{stats.totalDays} days</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Weekly Average</span>
                <span className={`stat-value ${parseFloat(stats.weeklyChange) < 0 ? 'decrease' : 'increase'}`}>
                  {stats.weeklyChange > 0 ? '+' : ''}{stats.weeklyChange} kg/week
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
  
  </>
}
