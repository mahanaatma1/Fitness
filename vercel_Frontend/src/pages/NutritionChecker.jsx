import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner, faExclamationTriangle, faTimes, faInfoCircle, faAppleAlt } from "@fortawesome/free-solid-svg-icons";

// Custom components used as references for styling
const Card = ({ children, className = "", title = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "medium", 
  disabled = false, 
  className = "" 
}) => {
  const baseClasses = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  
  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-400",
  };
  
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };
  
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ 
  label, 
  type = "text", 
  id, 
  name, 
  value, 
  onChange, 
  onKeyPress, 
  placeholder = "", 
  error = "", 
  className = "" 
}) => (
  <div className={`w-full ${className}`}>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
          error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200 focus:border-green-400'
        }`}
      />
      {error && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
        </div>
      )}
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center py-4">
    <FontAwesomeIcon icon={faSpinner} spin className="text-green-500 mr-2" />
    <span className="text-gray-600">{text}</span>
  </div>
);

const ErrorMessage = ({ message, retry = null }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-3 mt-0.5" />
    <div>
      <p>{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="text-red-700 font-medium hover:text-red-800 mt-2 underline"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

const NutritionChecker = () => {
  const [isFoodItem, setIsFoodItem] = useState("");
  const [nutritionResult, setNutritionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  const handleInputChange = (event) => {
    setIsFoodItem(event.target.value);
    if (inputError) setInputError("");
  };

  const handleSearch = async () => { 
    if (!isFoodItem.trim()) {
      setInputError("Please enter a food item to search");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Direct API call to CalorieNinjas
      const response = await axios.get(
        `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(isFoodItem)}`,
        {
          headers: {
            "X-Api-Key": "MYYksvtBoYX0Wk+fylOq0A==AIDtjN1lmZG0OpVn"
          }
        }
      );

      // CalorieNinjas response format has a top-level "items" array
      if (response.data && Array.isArray(response.data.items)) {
        if (response.data.items.length > 0) {
          setNutritionResult(response.data.items[0]);
          addToRecentSearches(isFoodItem, response.data.items[0].name);
        } else {
          setNutritionResult(null);
          setError("No nutrition information found for that food item.");
        }
      } else {
        // If the response doesn't have an 'items' array, it might return nutrition data directly
        setNutritionResult(response.data);
        if (response.data.name) {
          addToRecentSearches(isFoodItem, response.data.name);
        }
      }
    } catch (error) {
      console.error("Error fetching nutrition information:", error);
      setError(`Error: ${error.message}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  const addToRecentSearches = (query, result) => {
    const search = { query, result, timestamp: new Date().toISOString() };
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.query !== query);
      return [search, ...filtered].slice(0, 5);
    });
  };

  const handleRecentSearchClick = (query) => {
    setIsFoodItem(query);
    setTimeout(() => handleSearch(), 100);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear data and reset form
  const handleClear = () => {
    setIsFoodItem("");
    setNutritionResult(null);
    setError(null);
    setInputError("");
  };

  // Update the renderResult function to handle both response formats
  const renderResult = () => {
    if (!nutritionResult) return null;
    
    // Check if we have the expected properties for displaying nutrition info
    const hasNutritionData = nutritionResult.name || 
                             (nutritionResult.calories !== undefined && 
                              nutritionResult.protein_g !== undefined);
                              
    if (!hasNutritionData) {
      return <ErrorMessage message="Unable to parse nutrition data format." />;
    }

    const nutrients = [
      { name: "Calories", value: nutritionResult.calories, unit: "", color: "orange" },
      { name: "Total Fat", value: nutritionResult.fat_total_g, unit: "g", color: "yellow" },
      { name: "Saturated Fat", value: nutritionResult.fat_saturated_g, unit: "g", color: "yellow" },
      { name: "Cholesterol", value: nutritionResult.cholesterol_mg, unit: "mg", color: "red" },
      { name: "Sodium", value: nutritionResult.sodium_mg, unit: "mg", color: "blue" },
      { name: "Total Carbohydrates", value: nutritionResult.carbohydrates_total_g, unit: "g", color: "green" },
      { name: "Dietary Fiber", value: nutritionResult.fiber_g, unit: "g", color: "brown" },
      { name: "Sugar", value: nutritionResult.sugar_g, unit: "g", color: "purple" },
      { name: "Protein", value: nutritionResult.protein_g, unit: "g", color: "indigo" }
    ];
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-3xl mx-auto mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Nutrition Facts: <span className="text-green-700">{nutritionResult.name || isFoodItem}</span>
            </h2>
            <span className="text-sm text-gray-500">per 100g serving</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {nutrients.map((nutrient, index) => (
              <div 
                key={index} 
                className={`border rounded-lg overflow-hidden ${
                  nutrient.name === "Calories" ? "md:col-span-2 bg-gradient-to-r from-orange-50 to-white" : ""
                }`}
              >
                <div className="flex justify-between items-center p-3 border-b bg-gray-50">
                  <span className="font-medium text-gray-700">{nutrient.name}</span>
                  <span className="font-bold text-gray-900">
                    {nutrient.value !== undefined && nutrient.value !== null
                      ? `${nutrient.value}${nutrient.unit}`
                      : "N/A"
                    }
                  </span>
                </div>
                
                {/* Progress bar for visual representation */}
                {nutrient.value > 0 && (
                  <div className="h-2 bg-gray-200">
                    <div 
                      className={`h-full bg-${nutrient.color}-500`} 
                      style={{ 
                        width: `${Math.min(
                          nutrient.name === "Calories" 
                            ? (nutritionResult.calories / 500) * 100
                            : (nutrient.value / (
                              nutrient.name === "Total Carbohydrates" ? 50 :
                              nutrient.name === "Protein" ? 30 :
                              nutrient.name === "Total Fat" ? 20 : 100
                            )) * 100
                        )}%`
                      }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6 border-t pt-4">
            <div className="text-sm text-gray-500 flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
              Data source: CalorieNinjas API
            </div>
            <Button variant="outline" onClick={handleClear} size="small">
              Search Another Food
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  };

  const commonFoods = [
    "Apple", "Banana", "Chicken Breast", "Egg", "Rice", 
    "Broccoli", "Salmon", "Avocado", "Sweet Potato", "Quinoa"
  ];

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4">
      <div className="bg-gradient-to-b from-green-50 to-white rounded-lg shadow-md overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Nutrition Checker</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check the nutritional content of any food item
            </p>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:w-2/3"
            >
              <Card title="Food Search">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <Input
                        type="text"
                        id="foodItem"
                        name="foodItem"
                        placeholder="Enter food item (e.g., apple, chicken breast, rice)"
                        value={isFoodItem}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        error={inputError}
                        label="Food Item"
                      />
                      <div className="absolute right-2 top-8">
                        {isFoodItem && (
                          <button 
                            onClick={() => setIsFoodItem("")}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <Button 
                        onClick={handleSearch} 
                        disabled={isLoading || !isFoodItem.trim()}
                        className="flex-grow sm:flex-grow-0"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                            Searching...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <FontAwesomeIcon icon={faSearch} className="mr-2" />
                            Search
                          </span>
                        )}
                      </Button>
                      
                      {isFoodItem && (
                        <Button variant="secondary" onClick={handleClear}>
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {isLoading && <LoadingSpinner text="Searching for nutrition information..." />}
                  {error && <ErrorMessage message={error} retry={handleSearch} />}
                  
                  {/* Common foods suggestions */}
                  {!nutritionResult && !isLoading && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Common Foods:</h3>
                      <div className="flex flex-wrap gap-2">
                        {commonFoods.map((food) => (
                          <button
                            key={food}
                            onClick={() => {
                              setIsFoodItem(food);
                              setTimeout(() => handleSearch(), 100);
                            }}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors"
                          >
                            {food}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              
              {/* Render nutrition results */}
              {renderResult()}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="lg:w-1/3"
            >
              <Card title="Recent Searches">
                {recentSearches.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    <FontAwesomeIcon icon={faAppleAlt} className="text-3xl mb-3 text-green-200" />
                    <p>Your recent food searches will appear here</p>
                  </div>
                ) : (
                  <ul className="divide-y">
                    {recentSearches.map((item, index) => (
                      <li key={index} className="py-3 first:pt-0 last:pb-0">
                        <button
                          onClick={() => handleRecentSearchClick(item.query)}
                          className="w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <div className="font-medium text-gray-800">{item.result || item.query}</div>
                          <div className="text-sm text-gray-500 flex justify-between">
                            <span>Search: {item.query}</span>
                            <span>{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              
              <Card title="About Nutrition Data" className="mt-6">
                <div className="prose prose-sm max-w-none">
                  <p>
                    The nutrition information is provided per 100g serving of the food item. 
                    Values may vary based on preparation methods and specific varieties.
                  </p>
                  <ul className="mt-3 space-y-1">
                    <li><strong>Calories:</strong> Energy content of food</li>
                    <li><strong>Protein:</strong> Essential for muscle building and repair</li>
                    <li><strong>Carbohydrates:</strong> Main source of energy for the body</li>
                    <li><strong>Fats:</strong> Important for hormone production and nutrient absorption</li>
                    <li><strong>Fiber:</strong> Aids digestion and helps maintain gut health</li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChecker;
