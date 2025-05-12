import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WorkoutBuilder = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [sets, setSets] = useState(1);
  const [reps, setReps] = useState(['']);
  const [weights, setWeights] = useState(['']);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [analyticsExercise, setAnalyticsExercise] = useState('');
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const res = await axios.get('/api/workouts');
    setWorkouts(res.data);
  };

  const handleSetChange = (e) => {
    const numSets = parseInt(e.target.value);
    setSets(numSets);
    setReps(Array(numSets).fill(''));
    setWeights(Array(numSets).fill(''));
  };

  const handleRepChange = (index, value) => {
    const updated = [...reps];
    updated[index] = value;
    setReps(updated);
  };

  const handleWeightChange = (index, value) => {
    const updated = [...weights];
    updated[index] = value;
    setWeights(updated);
  };

  const handleSubmit = async () => {
    const workout = {
      name: exerciseName,
      muscleGroup,
      sets,
      reps,
      weights,
      date
    };

    await axios.post('/api/workouts', workout);
    fetchWorkouts();

    // Reset form
    setExerciseName('');
    setMuscleGroup('');
    setSets(1);
    setReps(['']);
    setWeights(['']);
  };

  const handleAnalytics = () => {
    const data = workouts
      .filter(w => w.name === analyticsExercise)
      .map(w => {
        const avgReps = w.reps.reduce((a, b) => a + Number(b), 0) / w.reps.length;
        const avgWeight = w.weights.reduce((a, b) => a + Number(b), 0) / w.weights.length;
        return {
          date: new Date(w.date).toISOString().split('T')[0],
          sets: w.sets,
          avgReps,
          avgWeight
        };
      });

    setAnalyticsData(data);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Workout Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Exercise Name"
          className="border p-2 rounded"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Muscle Group"
          className="border p-2 rounded"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
        />
        <input
          type="number"
          placeholder="Sets"
          className="border p-2 rounded"
          value={sets}
          onChange={handleSetChange}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        {[...Array(sets)].map((_, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder={`Set ${i + 1} Reps`}
              className="border p-2 rounded w-1/2"
              value={reps[i] || ''}
              onChange={(e) => handleRepChange(i, e.target.value)}
            />
            <input
              type="number"
              placeholder={`Set ${i + 1} Weight`}
              className="border p-2 rounded w-1/2"
              value={weights[i] || ''}
              onChange={(e) => handleWeightChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Workout
      </button>

      <h2 className="text-xl font-bold mt-8">Past Workouts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {workouts.map((w, i) => (
          <div key={i} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg">{w.name}</h3>
            <p><strong>Muscle Group:</strong> {w.muscleGroup}</p>
            <p><strong>Sets:</strong> {w.sets}</p>
            <p><strong>Reps per Set:</strong></p>
            <ul className="list-disc ml-4">
              {w.reps.map((r, j) => <li key={j}>Set {j + 1}: {r} reps</li>)}
            </ul>
            <p><strong>Weight per Set:</strong></p>
            <ul className="list-disc ml-4">
              {w.weights.map((wt, j) => <li key={j}>Set {j + 1}: {wt} kg</li>)}
            </ul>
            <p><strong>Date:</strong> {new Date(w.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8">Workout Analytics</h2>
      <div className="flex gap-2 items-center mt-2">
        <select
          value={analyticsExercise}
          onChange={(e) => setAnalyticsExercise(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Exercise</option>
          {[...new Set(workouts.map(w => w.name))].map((name, i) => (
            <option key={i} value={name}>{name}</option>
          ))}
        </select>
        <button onClick={handleAnalytics} className="bg-green-600 text-white px-4 py-2 rounded">
          Show Analytics
        </button>
      </div>

      {analyticsData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sets" fill="#66cccc" name="Sets" />
            <Bar dataKey="avgReps" fill="#ff6699" name="Average Reps per Set" />
            <Bar dataKey="avgWeight" fill="#66b3ff" name="Average Weight per Set" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WorkoutBuilder;
