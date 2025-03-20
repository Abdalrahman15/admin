import React, { useState, useEffect } from 'react';
import { mealsAPI } from '../../api/mealsAPI';
import { toast } from 'react-toastify';


export default function FoodSearch({ onSelectFood }) {
    const [searchTerm, setSearchTerm] = useState('');
      const [searchResults, setSearchResults] = useState([]);
      const [recentFoods, setRecentFoods] = useState([]);
      const [loading, setLoading] = useState(false);
      const [selectedCategory, setSelectedCategory] = useState('');
      const [categories, setCategories] = useState([]);
      const [showAddCustom, setShowAddCustom] = useState(false);
      
      // Custom food form
      const [customFood, setCustomFood] = useState({
        name: '',
        brand: '',
        servingSize: 100,
        servingUnit: 'g',
        caloriesPerServing: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      });
    
      useEffect(() => {
        // Load recent foods and categories on component mount
        fetchRecentFoods();
        fetchCategories();
      }, []);
    
      // Fetch recently used foods
      const fetchRecentFoods = async () => {
        try {
          const recent = await mealsAPI.getRecentFoods();
          setRecentFoods(recent);
        } catch (error) {
          console.error('Error fetching recent foods:', error);
        }
      };
    
      // Fetch food categories
      const fetchCategories = async () => {
        try {
          const cats = await mealsAPI.getFoodCategories();
          setCategories(cats);
        } catch (error) {
          console.error('Error fetching food categories:', error);
        }
      };
    
      // Handle search
      const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchTerm.trim() && !selectedCategory) {
          toast.info('Please enter a search term or select a category');
          return;
        }
        
        try {
          setLoading(true);
          const params = {};
          
          if (searchTerm.trim()) {
            params.q = searchTerm;
          }
          
          if (selectedCategory) {
            params.category = selectedCategory;
          }
          
          const results = await mealsAPI.searchFoods(params);
          setSearchResults(results);
        } catch (error) {
          toast.error('Failed to search foods');
          console.error('Error searching foods:', error);
        } finally {
          setLoading(false);
        }
      };
    
      // Handle selecting a food
      const handleSelectFood = (food) => {
        if (onSelectFood) {
          onSelectFood(food);
        }
      };
    
      // Handle custom food form changes
      const handleCustomFoodChange = (e) => {
        const { name, value } = e.target;
        setCustomFood(prev => ({
          ...prev,
          [name]: name === 'name' || name === 'brand' || name === 'servingUnit' 
            ? value 
            : parseFloat(value) || 0
        }));
      };
    
      // Add custom food
      const handleAddCustomFood = async (e) => {
        e.preventDefault();
        
        if (!customFood.name) {
          toast.error('Food name is required');
          return;
        }
        
        try {
          setLoading(true);
          const newFood = await mealsAPI.createFood({
            ...customFood,
            isCustom: true
          });
          
          toast.success('Custom food added');
          setShowAddCustom(false);
          handleSelectFood(newFood);
        } catch (error) {
          toast.error('Failed to add custom food');
          console.error('Error adding custom food:', error);
        } finally {
          setLoading(false);
        }
      };
  return <>

<div className="food-search mt-[100px]">
      {showAddCustom ? (
        <div className="custom-food-form">
          <h3>Add Custom Food</h3>
          <form onSubmit={handleAddCustomFood}>
            <div className="form-group">
              <label htmlFor="name">Food Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customFood.name}
                onChange={handleCustomFoodChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="brand">Brand (Optional)</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={customFood.brand}
                onChange={handleCustomFoodChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="servingSize">Serving Size*</label>
                <input
                  type="number"
                  id="servingSize"
                  name="servingSize"
                  value={customFood.servingSize}
                  onChange={handleCustomFoodChange}
                  min="0.1"
                  step="0.1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="servingUnit">Unit*</label>
                <select
                  id="servingUnit"
                  name="servingUnit"
                  value={customFood.servingUnit}
                  onChange={handleCustomFoodChange}
                  required
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="oz">oz</option>
                  <option value="cup">cup</option>
                  <option value="tbsp">tbsp</option>
                  <option value="tsp">tsp</option>
                  <option value="serving">serving</option>
                  <option value="piece">piece</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="caloriesPerServing">Calories per Serving*</label>
              <input
                type="number"
                id="caloriesPerServing"
                name="caloriesPerServing"
                value={customFood.caloriesPerServing}
                onChange={handleCustomFoodChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="protein">Protein (g)</label>
                <input
                  type="number"
                  id="protein"
                  name="protein"
                  value={customFood.protein}
                  onChange={handleCustomFoodChange}
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="carbs">Carbs (g)</label>
                <input
                  type="number"
                  id="carbs"
                  name="carbs"
                  value={customFood.carbs}
                  onChange={handleCustomFoodChange}
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fat">Fat (g)</label>
                <input
                  type="number"
                  id="fat"
                  name="fat"
                  value={customFood.fat}
                  onChange={handleCustomFoodChange}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowAddCustom(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Food'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="search-form">
            <form onSubmit={handleSearch}>
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Search for a food..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              
              <div className="category-filter">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            
            <button 
              className="btn btn-outline btn-add-custom"
              onClick={() => setShowAddCustom(true)}
            >
              <i className="fas fa-plus"></i> Add Custom Food
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Searching foods...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="search-results">
              <h3>Search Results</h3>
              <div className="food-list">
                {searchResults.map(food => (
                  <div className="food-card" key={food.foodId}>
                    <div className="food-card-body">
                      <h4 className="food-name">{food.name}</h4>
                      {food.brand && <div className="food-brand">{food.brand}</div>}
                      <div className="food-serving">
                        {food.servingSize} {food.servingUnit} | {food.caloriesPerServing} kcal
                      </div>
                      <div className="food-macros">
                        <span>{food.protein}g protein</span>
                        <span>{food.carbs}g carbs</span>
                        <span>{food.fat}g fat</span>
                      </div>
                    </div>
                    <div className="food-card-actions">
                      <button 
                        onClick={() => handleSelectFood(food)}
                        className="btn btn-select"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : recentFoods.length > 0 && !searchTerm && !selectedCategory ? (
            <div className="recent-foods">
              <h3>Recently Used Foods</h3>
              <div className="food-list">
                {recentFoods.map(food => (
                  <div className="food-card" key={food.foodId}>
                    <div className="food-card-body">
                      <h4 className="food-name">{food.name}</h4>
                      {food.brand && <div className="food-brand">{food.brand}</div>}
                      <div className="food-serving">
                        {food.servingSize} {food.servingUnit} | {food.caloriesPerServing} kcal
                      </div>
                      <div className="food-macros">
                        <span>{food.protein}g protein</span>
                        <span>{food.carbs}g carbs</span>
                        <span>{food.fat}g fat</span>
                      </div>
                    </div>
                    <div className="food-card-actions">
                      <button 
                        onClick={() => handleSelectFood(food)}
                        className="btn btn-select"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchTerm || selectedCategory ? (
            <div className="no-results">
              <p>No foods found. Try a different search term or category.</p>
              <button 
                className="btn btn-outline"
                onClick={() => setShowAddCustom(true)}
              >
                Add Custom Food
              </button>
            </div>
          ) : (
            <div className="search-instructions">
              <p>Search for foods by name or select a category</p>
              <div className="popular-searches">
                <h4>Popular Searches</h4>
                <div className="quick-search-buttons">
                  <button onClick={() => {setSearchTerm('chicken'); handleSearch({preventDefault: () => {}})}}>Chicken</button>
                  <button onClick={() => {setSearchTerm('rice'); handleSearch({preventDefault: () => {}})}}>Rice</button>
                  <button onClick={() => {setSearchTerm('egg'); handleSearch({preventDefault: () => {}})}}>Eggs</button>
                  <button onClick={() => {setSearchTerm('protein'); handleSearch({preventDefault: () => {}})}}>Protein</button>
                  <button onClick={() => {setSearchTerm('apple'); handleSearch({preventDefault: () => {}})}}>Fruits</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </>
    
}
