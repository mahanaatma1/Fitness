import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faAngleRight
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/FitnessAppLogo.png"
                className="w-12 h-12 rounded-full border border-white mr-3"
                alt="FitFusion Logo"
              />
              <h3 className="text-xl font-bold">FitFusion</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Your all-in-one fitness companion for personalized workouts, nutrition guidance, and health tracking.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <FontAwesomeIcon icon={faFacebookF} size="sm" />
              </a>
              <a href="https://x.com/r_amkum_ar?s=08" className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center hover:bg-blue-500 transition-colors">
                <FontAwesomeIcon icon={faTwitter} size="sm" />
              </a>
              <a href="https://www.instagram.com/iamr_a_m1?igsh=MmU2bGtnNWJkcjg2" className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center hover:bg-pink-700 transition-colors">
                <FontAwesomeIcon icon={faInstagram} size="sm" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors">
                <FontAwesomeIcon icon={faYoutube} size="sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                  <FontAwesomeIcon icon={faAngleRight} className="mr-2 text-xs" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/AboutUs" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                  <FontAwesomeIcon icon={faAngleRight} className="mr-2 text-xs" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/Features" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                  <FontAwesomeIcon icon={faAngleRight} className="mr-2 text-xs" />
                  Features
                </Link>
              </li>
              <li>
                <Link to="/ContactUs" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                  <FontAwesomeIcon icon={faAngleRight} className="mr-2 text-xs" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Our Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/WorkoutDatabase" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                  <FontAwesomeIcon icon={faAngleRight} className="mr-2 text-xs" />
                  Workout Database
                </Link>
              </li>
              <li>
                <Link to="/NutritionChecker" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                  <FontAwesomeIcon icon={faAngleRight} className="mr-2 text-xs" />
                  Nutrition Checker
                </Link>
              </li>
              <li>
                <Link to="/BmrCalculator" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                  <FontAwesomeIcon icon={faAngleRight} className="mr-2 text-xs" />
                  BMR Calculator
                </Link>
              </li>
              <li>
                <Link to="/WorkoutBuilder" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                  <FontAwesomeIcon icon={faAngleRight} className="mr-2 text-xs" />
                  Workout Builder
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500 mt-1 mr-3" />
                <span className="text-gray-400">
                  123 Fitness Street, Healthy City, Bihar, India
                </span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="text-green-500 mr-3" />
                <a href="tel:+919523430484" className="text-gray-400 hover:text-white transition-colors">
                  +91 9523430484
                </a>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-green-500 mr-3" />
                <a href="mailto:ramkumar070406@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  ramkumar070406@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} FitFusion. All Rights Reserved.</p>
          <div className="mt-2 text-sm space-x-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
