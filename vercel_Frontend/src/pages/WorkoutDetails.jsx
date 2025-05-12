import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Line } from 'react-chartjs-2'
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
} from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

const exerciseData = {
  Chest: ['Bench Press', 'Push-ups', 'Chest Flyes'],
  Back: ['Pull-ups', 'Rows', 'Deadlifts'],
  Legs: ['Squats', 'Lunges', 'Leg Press'],
  Shoulders: ['Shoulder Press', 'Lateral Raises', 'Front Raises'],
  Arms: ['Bicep Curls', 'Tricep Extensions', 'Hammer Curls'],
  Core: ['Planks', 'Crunches', 'Russian Twists']
}

const WorkoutDetails = () => {
  const { user } = useAuth()
  const [workoutData, setWorkoutData] = useState({
    muscleGroup: '',
    exercise: '',
    sets: '',
    repsPerSet: [],
    weightPerSet: []
  })
  const [filteredExercises, setFilteredExercises] = useState([])
  const [pastWorkouts, setPastWorkouts] = useState([])
  const [analyticsExercise, setAnalyticsExercise] = useState('')
  const [allExercises, setAllExercises] = useState([])
  const [analyticsData, setAnalyticsData] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'sets') {
      const newSets = parseInt(value) || 0
      setWorkoutData((prev) => ({
        ...prev,
        [name]: value,
        repsPerSet: Array(newSets).fill(''),
        weightPerSet: Array(newSets).fill('')
      }))
    } else {
      setWorkoutData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleRepsChange = (index, value) => {
    const newRepsPerSet = [...workoutData.repsPerSet]
    newRepsPerSet[index] = value
    setWorkoutData((prev) => ({ ...prev, repsPerSet: newRepsPerSet }))
  }

  const handleWeightChange = (index, value) => {
    const newWeightPerSet = [...workoutData.weightPerSet]
    newWeightPerSet[index] = value
    setWorkoutData((prev) => ({ ...prev, weightPerSet: newWeightPerSet }))
  }

  const handleMuscleGroupChange = (e) => {
    const selectedMuscleGroup = e.target.value
    setWorkoutData((prev) => ({
      ...prev,
      muscleGroup: selectedMuscleGroup,
      exercise: ''
    }))
    setFilteredExercises(exerciseData[selectedMuscleGroup] || [])
  }

  const handleExerciseChange = (e) => {
    setWorkoutData((prev) => ({
      ...prev,
      exercise: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        '/api/workouts',
        {
          ...workoutData,
          repsPerSet: workoutData.repsPerSet.map((rep) => parseInt(rep || 0)),
          weightPerSet: workoutData.weightPerSet.map((w) => parseFloat(w || 0))
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwttoken')}`
          }
        }
      )
      setWorkoutData({
        muscleGroup: '',
        exercise: '',
        sets: '',
        repsPerSet: [],
        weightPerSet: []
      })
      fetchPastWorkouts()
    } catch (error) {
      console.error('Error adding workout:', error.response?.data || error.message)
    }
  }

  const fetchPastWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwttoken')}`
        }
      })
      setPastWorkouts(response.data)
    } catch (error) {
      console.error('Error fetching workouts:', error)
    }
  }

  const fetchAnalytics = async () => {
    if (!analyticsExercise) return
    try {
      const res = await axios.get(
        `/api/workouts/analytics?exercise=${analyticsExercise}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwttoken')}`
          }
        }
      )
      setAnalyticsData(res.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const prepareChartData = () => {
    if (!analyticsData) return null
    const dates = analyticsData.map((item) => item.date)
    const setData = analyticsData.map((item) => item.sets)
    const repData = analyticsData.map((item) =>
      item.sets > 0
        ? item.repsPerSet.reduce((sum, val) => sum + val, 0) / item.sets
        : 0
    )
    const weightData = analyticsData.map((item) =>
      item.sets > 0
        ? item.weightPerSet.reduce((sum, val) => sum + val, 0) / item.sets
        : 0
    )

    return {
      labels: dates,
      datasets: [
        {
          label: 'Sets',
          data: setData,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Avg Reps per Set',
          data: repData,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: 'Avg Weight per Set',
          data: weightData,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        }
      ]
    }
  }

  const getUniqueExercises = (workouts) => {
    const exercises = workouts.map((w) => w.exercise)
    return [...new Set(exercises)].sort()
  }

  useEffect(() => {
    fetchPastWorkouts()
  }, [])

  useEffect(() => {
    setAllExercises(getUniqueExercises(pastWorkouts))
  }, [pastWorkouts])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Workout Progress for ${analyticsExercise}`
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  const handleDateChange = (e) => setSelectedDate(e.target.value)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Workout Details</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <select
            name="muscleGroup"
            value={workoutData.muscleGroup}
            onChange={handleMuscleGroupChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Muscle Group</option>
            {Object.keys(exerciseData).map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <select
            name="exercise"
            value={workoutData.exercise}
            onChange={handleExerciseChange}
            className="border p-2 rounded"
            required
            disabled={!workoutData.muscleGroup}
          >
            <option value="">Select Exercise</option>
            {filteredExercises.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="sets"
            placeholder="Sets"
            value={workoutData.sets}
            onChange={handleInputChange}
            className="border p-2 rounded col-span-2"
            min={1}
            required
          />
        </div>

        {/* Sets Inputs */}
        {workoutData.sets &&
          Array.from({ length: parseInt(workoutData.sets) }).map((_, i) => (
            <div key={i} className="grid grid-cols-2 gap-4 mt-2">
              <input
                type="number"
                placeholder={`Reps for Set ${i + 1}`}
                value={workoutData.repsPerSet[i] || ''}
                onChange={(e) => handleRepsChange(i, e.target.value)}
                className="border p-2 rounded"
                min={1}
                required
              />
              <input
                type="number"
                placeholder={`Weight for Set ${i + 1}`}
                value={workoutData.weightPerSet[i] || ''}
                onChange={(e) => handleWeightChange(i, e.target.value)}
                className="border p-2 rounded"
                min={0}
                step={0.1}
                required
              />
            </div>
          ))}

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Add Workout
        </button>
      </form>

      {/* Filter Past Workouts by Date */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Past Workouts</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border p-2 rounded mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastWorkouts
            .filter(
              (w) =>
                selectedDate &&
                new Date(w.date).toDateString() ===
                  new Date(selectedDate).toDateString()
            )
            .map((w, idx) => (
              <div
                key={idx}
                className="p-4 bg-white shadow rounded space-y-2"
              >
                <h3 className="text-lg font-semibold">{w.exercise}</h3>
                <p>Muscle Group: {w.muscleGroup}</p>
                <p>Sets: {w.sets}</p>
                <div>
                  <p>Reps per Set:</p>
                  <ul className="list-disc pl-5">
                    {w.repsPerSet.map((r, i) => (
                      <li key={i}>
                        Set {i + 1}: {r} reps
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p>Weight per Set:</p>
                  <ul className="list-disc pl-5">
                    {w.weightPerSet.map((wgt, i) => (
                      <li key={i}>
                        Set {i + 1}: {wgt} kg
                      </li>
                    ))}
                  </ul>
                </div>
                <p>Date: {new Date(w.date).toLocaleDateString()}</p>
              </div>
            ))}
        </div>
        {selectedDate &&
          pastWorkouts.filter(
            (w) =>
              new Date(w.date).toDateString() ===
              new Date(selectedDate).toDateString()
          ).length === 0 && <p>No workouts on this date.</p>}
      </div>

      {/* Analytics */}
      <div>
        <h2 className="text-xl font-bold mb-4">Workout Analytics</h2>
        <div className="flex gap-4 mb-4">
          <select
            value={analyticsExercise}
            onChange={(e) => setAnalyticsExercise(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select exercise</option>
            {allExercises.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={fetchAnalytics}
            disabled={!analyticsExercise}
          >
            Show Analytics
          </button>
        </div>
        {analyticsData && (
          <div className="h-64 w-full xl:w-3/4">
            <Line data={prepareChartData()} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkoutDetails
