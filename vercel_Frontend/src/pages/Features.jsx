import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const FeatureCard = ({ title, description, link, requiresLogin }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <motion.div 
      className="bg-white text-center rounded-lg shadow-lg p-6 mb-6 flex flex-col items-center justify-between h-full hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div>
        <motion.h3 
          className="text-xl font-semibold text-center mt-3 mb-4 text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
          {requiresLogin && !isAuthenticated && (
            <span className="ml-2 text-xs font-normal bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Login Required
            </span>
          )}
        </motion.h3>
        <motion.p 
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to={requiresLogin && !isAuthenticated ? "/SignIn" : link}
          className="group flex items-center bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300"
        >
          {requiresLogin && !isAuthenticated ? "Sign In to Access" : "Learn More"}
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: 5 }}
            transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
          >
            <FaArrowRight className="ml-2" />
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

const Features = () => {
  const { isAuthenticated } = useAuth();
  
  const features = [
    {
      title: "Workout Database",
      description:
        "Our comprehensive workout database helps you find the perfect routine to target your specific goals.",
      link: "/WorkoutDatabase",
      requiresLogin: true
    },
    {
      title: "Nutrition Checker",
      description:
        "Easily check the nutritional value of any food, including calories, fat, protein, and carbohydrates.",
      link: "/NutritionChecker",
      requiresLogin: true
    },
    {
      title: "BMR Calculator",
      description:
        "Calculate your Basal Metabolic Rate (BMR) to determine your daily calorie needs and gain insights into your metabolism.",
      link: "/BmrCalculator",
      requiresLogin: true
    },
    {
      title: "Workout Builder",
      description:
        "Create custom workouts with our easy-to-use builder. Choose exercises, set repetitions, and track your progress over time.",
      link: "/WorkoutBuilder",
      requiresLogin: true
    },
    {
      title: "Create Account",
      description:
        "Create a personalized account to access additional features, save your progress, and customize your experience.",
      link: "/Register",
      requiresLogin: false
    },
    {
      title: "About Us",
      description:
        "Learn more about our mission to help everyone achieve their fitness goals through innovative technology and community support.",
      link: "/AboutUs",
      requiresLogin: false
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // New animation for the title letters
  const letterVariants = {
    hover: {
      scale: 1.3,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="bg-gray-100 min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-700"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Wrap each letter in a motion.span */}
          {"App Features".split('').map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              whileHover="hover"
              style={{ display: 'inline-block' }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h2>
        
        {/* Login required notice */}
        {!isAuthenticated && (
          <motion.div 
            className="max-w-3xl mx-auto mb-12 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Some features require a free account. Sign up to unlock all fitness tracking capabilities!
                  <Link to="/Register" className="ml-2 font-semibold underline">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                link={feature.link}
                requiresLogin={feature.requiresLogin}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Features;
