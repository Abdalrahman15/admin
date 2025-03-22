import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutsAPI } from '../../api/workoutsAPI';
import { toast } from 'react-toastify';
export default function ExerciseSelector({ onSelectExercise }) {
    const [searchTerm, setSearchTerm] = useState('');
      const [selectedCategory, setSelectedCategory] = useState('');
      const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
      const [selectedEquipment, setSelectedEquipment] = useState('');
      const [exerciseList, setExerciseList] = useState([]);
      const [filteredExercises, setFilteredExercises] = useState([]);
      const [categories, setCategories] = useState([]);
      const [muscleGroups, setMuscleGroups] = useState([]);
      const [equipment, setEquipment] = useState([]);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        // Fetch exercises, categories, muscle groups, and equipment
        const fetchData = async () => {
          try {
            setLoading(true);
            
            // Fetch all exercises
            const exercises = await workoutsAPI.getExercises();
            setExerciseList(exercises);
            setFilteredExercises(exercises);
            
            // Fetch categories
            const cats = await workoutsAPI.getExerciseCategories();
            setCategories(cats);
            
            // Fetch muscle groups
            const muscles = await workoutsAPI.getMuscleGroups();
            setMuscleGroups(muscles);
            
            // Extract equipment types from exercises
            const equipmentTypes = [...new Set(exercises
              .map(ex => ex.equipment)
              .filter(item => item && item.trim() !== '')
            )];
            setEquipment(equipmentTypes);
          } catch (error) {
            toast.error('Failed to load exercises');
            console.error('Error fetching exercise data:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);
    
      // Filter exercises when filters change
      useEffect(() => {
        const applyFilters = () => {
          let filtered = [...exerciseList];
          
          // Apply search term filter
          if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(exercise => 
              exercise.name.toLowerCase().includes(search) || 
              (exercise.description && exercise.description.toLowerCase().includes(search))
            );
          }
          
          // Apply category filter
          if (selectedCategory) {
            filtered = filtered.filter(exercise => 
              exercise.category === selectedCategory
            );
          }
          
          // Apply muscle group filter
          if (selectedMuscleGroup) {
            filtered = filtered.filter(exercise => 
              exercise.targetMuscles && 
              exercise.targetMuscles.some(muscle => muscle.muscleGroup === selectedMuscleGroup)
            );
          }
          
          // Apply equipment filter
          if (selectedEquipment) {
            filtered = filtered.filter(exercise => 
              exercise.equipment === selectedEquipment
            );
          }
          
          setFilteredExercises(filtered);
        };
        
        applyFilters();
      }, [searchTerm, selectedCategory, selectedMuscleGroup, selectedEquipment, exerciseList]);
    
      const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
      };
    
      const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
      };
    
      const handleMuscleGroupChange = (e) => {
        setSelectedMuscleGroup(e.target.value);
      };
    
      const handleEquipmentChange = (e) => {
        setSelectedEquipment(e.target.value);
      };
    
      const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedMuscleGroup('');
        setSelectedEquipment('');
      };
    
      const handleSelectExercise = (exercise) => {
        if (onSelectExercise) {
          onSelectExercise(exercise);
        }
      };
    
      if (loading) {
        return (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading exercises...</p>
          </div>
        );
      }
  return <>
    <div className="exercise-selector">
          <div className="search-filters">
            <div className="search-input">
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="filter-options">
              <div className="filter-group">
                <label htmlFor="category-filter">Category</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="muscle-filter">Muscle Group</label>
                <select
                  id="muscle-filter"
                  value={selectedMuscleGroup}
                  onChange={handleMuscleGroupChange}
                >
                  <option value="">All Muscle Groups</option>
                  {muscleGroups.map(muscle => (
                    <option key={muscle} value={muscle}>
                      {muscle}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="equipment-filter">Equipment</label>
                <select
                  id="equipment-filter"
                  value={selectedEquipment}
                  onChange={handleEquipmentChange}
                >
                  <option value="">All Equipment</option>
                  {equipment.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                className="btn-clear-filters"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
    
          <div className="exercise-results">
            <h3>
              {filteredExercises.length} 
              {filteredExercises.length === 1 ? ' Exercise' : ' Exercises'} 
              {(searchTerm || selectedCategory || selectedMuscleGroup || selectedEquipment) ? ' Found' : ''}
            </h3>
            
            {filteredExercises.length > 0 ? (
              <div className="exercise-grid">
                {filteredExercises.map(exercise => (
                  <div className="exercise-card" key={exercise.exerciseId}>
                    <div className="exercise-info">
                      <h4>{exercise.name}</h4>
                      <div className="exercise-meta">
                        {exercise.category && (
                          <span className="exercise-category">{exercise.category}</span>
                        )}
                        {exercise.difficulty && (
                          <span className="exercise-difficulty">{exercise.difficulty}</span>
                        )}
                        {exercise.equipment && (
                          <span className="exercise-equipment">{exercise.equipment}</span>
                        )}
                      </div>
                      <div className="exercise-muscles">
                        {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                          <>
                            <span className="muscles-label">Targets: </span>
                            {exercise.targetMuscles
                              .filter(m => m.isPrimary)
                              .map(m => m.muscleGroup)
                              .join(', ')}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="exercise-actions">
                      <button 
                        className="btn-select"
                        onClick={() => handleSelectExercise(exercise)}
                      >
                        Add to Workout
                      </button>
                      <Link 
                        to={`/workouts/exercises/${exercise.exerciseId}`}
                        className="btn-view"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-exercises">
                <p>No exercises match your filters</p>
                <button 
                  className="btn btn-outline"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
  </>
  
}
