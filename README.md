# Fitness Tracker Application

A full-stack fitness tracking application with workout planning, nutrition tracking, and exercise database.

## Deployment on Render

### Prerequisites
1. Create a [Render](https://render.com) account
2. Fork/Clone this repository to your GitHub account
3. Have the following API keys ready:
   - Calorie Ninjas API Key
   - RapidAPI Key (for ExerciseDB)
   - MongoDB URI
   - Email credentials

### Deployment Steps

1. Log in to your Render dashboard
2. Click on "New +" and select "Blueprint"
3. Connect your GitHub repository
4. Select the repository containing this project
5. Render will automatically detect the `render.yaml` configuration
6. Add the following environment variables in Render:
   
   For Backend:
   ```
   MONGO_URI=[your MongoDB connection string]
   JWT_SECRET=[your secret key]
   EMAIL_USER=[your email]
   EMAIL_PASS=[your email app password]
   CALORIE_NINJAS_API_KEY=[your api key]
   RAPID_API_KEY=[your api key]
   ```

   For Frontend:
   ```
   VITE_CALORIE_NINJAS_API_KEY=[your api key]
   VITE_RAPID_API_KEY=[your api key]
   ```

7. Click "Apply"
8. Render will automatically deploy both the backend and frontend

### Local Development

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd fitness-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env files:
   - Copy `.env.example` to `.env` in both `vercel-backend` and `vercel_Frontend` directories
   - Fill in your environment variables

4. Run the development servers:
   ```bash
   # Run backend
   npm run dev-backend
   
   # Run frontend (in a new terminal)
   npm run dev-frontend
   ```

5. Open http://localhost:5173 in your browser

## Features
- User authentication
- Workout tracking
- Nutrition logging
- Exercise database
- Progress tracking
- Email notifications 