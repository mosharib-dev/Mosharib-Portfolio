import axios from "axios";

// In dev, Vite proxies "/api" to localhost:5000 (see vite.config.js).
// In production the frontend and backend are separate deployments, so
// set VITE_API_URL to your deployed backend's URL, e.g.
// https://your-backend.onrender.com/api
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  // Render's free tier sleeps after inactivity — the first request after
  // a cold start can take 30-50s to wake it up. 45s gives that room
  // instead of failing the very first visit of the day.
  timeout: 45000,
});

export default client;