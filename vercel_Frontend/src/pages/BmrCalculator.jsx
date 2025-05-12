import React, { useState } from "react";
import { motion } from "framer-motion";

const BmrCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [calculatedBMR, setCalculatedBMR] = useState(null);
  const [calories, setCalories] = useState({
    deficit: "",
    maintenance: "",
    bulking: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showResults, setShowResults] = useState(false);

  const activityLevels = [
    { id: "sedentary", label: "Sedentary (little or no exercise)", multiplier: 1.2 },
    { id: "light", label: "Lightly active (light exercise 1-3 days/week)", multiplier: 1.375 },
    { id: "moderate", label: "Moderately active (moderate exercise 3-5 days/week)", multiplier: 1.55 },
    { id: "active", label: "Very active (hard exercise 6-7 days/week)", multiplier: 1.725 },
    { id: "very-active", label: "Extra active (very hard exercise & physical job)", multiplier: 1.9 }
  ];

  const validateForm = () => {
    const errors = {};
    if (!age) errors.age = "Age is required";
    else if (isNaN(age) || age <= 0 || age > 120) errors.age = "Please enter a valid age (1-120)";
    
    if (!weight) errors.weight = "Weight is required";
    else if (isNaN(weight) || weight <= 0) errors.weight = "Please enter a valid weight";
    
    if (!height) errors.height = "Height is required";
    else if (isNaN(height) || height <= 0) errors.height = "Please enter a valid height";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateBMR = () => {
    if (!validateForm()) return;

    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height);
    const ageInYears = parseInt(age, 10);
    
    let bmr = 0;
    
    // Harris-Benedict Equation for BMR
    if (gender === "male") {
      bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * ageInYears);
    } else {
      bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.33 * ageInYears);
    }
    
    setCalculatedBMR(Math.round(bmr));
    
    // Find the selected activity level multiplier
    const selectedActivity = activityLevels.find(level => level.id === activityLevel);
    const activityMultiplier = selectedActivity ? selectedActivity.multiplier : 1.2;
    
    // Calculating different calorie levels
    const maintenanceCalories = bmr * activityMultiplier;
    const deficitCalories = maintenanceCalories - 500;
    const bulkingCalories = maintenanceCalories + 500;

    setCalories({
      deficit: Math.round(deficitCalories),
      maintenance: Math.round(maintenanceCalories),
      bulking: Math.round(bulkingCalories),
    });
    
    setShowResults(true);
  };

  const resetCalculator = () => {
    setShowResults(false);
    setCalculatedBMR(null);
    setCalories({
      deficit: "",
      maintenance: "",
      bulking: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4">
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-md overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">BMR Calculator</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Calculate your Basal Metabolic Rate (BMR) and daily calorie needs
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`bg-white rounded-xl shadow-lg p-6 ${showResults ? 'lg:w-1/2' : 'w-full'}`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="male"
                        checked={gender === "male"}
                        onChange={() => setGender("male")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="male" className="ml-2 block text-gray-700">
                        Male
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="female"
                        checked={gender === "female"}
                        onChange={() => setGender("female")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="female" className="ml-2 block text-gray-700">
                        Female
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                      formErrors.age ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                    placeholder="Enter your age"
                  />
                  {formErrors.age && <p className="mt-1 text-sm text-red-600">{formErrors.age}</p>}
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                      formErrors.weight ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                    placeholder="Enter your weight"
                  />
                  {formErrors.weight && <p className="mt-1 text-sm text-red-600">{formErrors.weight}</p>}
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                      formErrors.height ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                    placeholder="Enter your height"
                  />
                  {formErrors.height && <p className="mt-1 text-sm text-red-600">{formErrors.height}</p>}
                </div>

                <div>
                  <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Level
                  </label>
                  <select
                    id="activity"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 focus:outline-none"
                  >
                    {activityLevels.map(level => (
                      <option key={level.id} value={level.id}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    onClick={calculateBMR}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </motion.div>

            {showResults && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg p-6 lg:w-1/2"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Results</h2>
                
                <div className="mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="text-lg font-medium text-gray-700">Basal Metabolic Rate (BMR)</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{calculatedBMR} Calories/day</p>
                    <p className="text-sm text-gray-500 mt-1">
                      This is the number of calories your body needs to maintain basic functions at rest.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Daily Calorie Needs</h3>
                  
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-700">Weight Loss</h4>
                        <p className="text-sm text-gray-500">500 calorie deficit</p>
                      </div>
                      <span className="text-2xl font-bold text-red-600">{calories.deficit} Cal</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-700">Maintenance</h4>
                        <p className="text-sm text-gray-500">Maintain current weight</p>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{calories.maintenance} Cal</span>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-700">Weight Gain</h4>
                        <p className="text-sm text-gray-500">500 calorie surplus</p>
                      </div>
                      <span className="text-2xl font-bold text-indigo-600">{calories.bulking} Cal</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={resetCalculator}
                    className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Reset Calculator
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About BMR</h2>
            <div className="prose max-w-none">
              <p>
                Your Basal Metabolic Rate (BMR) is the number of calories your body needs to maintain 
                basic physiological functions while at rest. This includes breathing, circulation, cell production, 
                and other essential processes.
              </p>
              <p className="mt-4">
                The Harris-Benedict formula is used to calculate BMR based on total body weight, height, age, and gender. 
                This calculator then adjusts this number based on your activity level to give you an estimated 
                daily calorie requirement.
              </p>
              <h3 className="text-xl font-bold mt-6 mb-2">How to use these results:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Weight Loss:</strong> Consume fewer calories than your maintenance level (generally a 500 calorie deficit is recommended for losing about 1 pound per week).</li>
                <li><strong>Maintenance:</strong> Consume calories at this level to maintain your current weight.</li>
                <li><strong>Weight Gain:</strong> Consume more calories than your maintenance level (a 500 calorie surplus typically leads to gaining about 1 pound per week).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BmrCalculator;
