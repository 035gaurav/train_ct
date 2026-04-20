import React, { useState } from "react";
import "./App.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://13.48.30.20:5000/api";

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to convert minutes (since midnight) to HH:MM format
  const minutesToTime = (minutes) => {
    if (minutes === undefined || minutes === null) return "N/A";
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!from || !to) {
      return alert("Enter both station codes");
    }

    setLoading(true);
    setError("");
    setTrains([]);

    try {
      const response = await fetch(
        `${API_URL}/trains/between?from=${from.toUpperCase()}&to=${to.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // ✅ FIXED: Correct path according to your actual API response
      const trainsData = result?.trains || [];

      if (result.success && trainsData.length > 0) {
        setTrains(trainsData);
      } else {
        setError("No trains found for this route.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch trains. Please check your connection or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🚂 Indian Railways Search</h1>
      
      <form onSubmit={handleSearch} className="search-box">
        <input
          type="text"
          placeholder="From (NDLS)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          maxLength={4}
        />
        <input
          type="text"
          placeholder="To (RTM)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          maxLength={4}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Trains"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {!loading && trains.length === 0 && !error && (
        <p className="info">No results yet. Try searching.</p>
      )}

      <div className="results">
        {trains.map((train) => (
          <div key={train.trainNumber} className="train-card">
            <h3>
              {train.trainName} ({train.trainNumber})
            </h3>
            <p>
              <strong>Type:</strong> {train.type}
            </p>
            <p>
              <strong>Runs On:</strong>{" "}
              {train.runningDays?.days?.join(", ") || "N/A"}
            </p>

            {/* Improved schedule display */}
            <div className="schedule">
              <p>
                <strong>Departs {from.toUpperCase()}:</strong>{" "}
                {minutesToTime(train.fromStationSchedule?.departureMinutes || train.fromStationSchedule?.arrivalMinutes)}
                &nbsp;&nbsp;•&nbsp;&nbsp;
                Day {train.fromStationSchedule?.day || 1}
                {train.fromStationSchedule?.platform && ` • Platform ${train.fromStationSchedule.platform}`}
              </p>
              <p>
                <strong>Arrives {to.toUpperCase()}:</strong>{" "}
                {minutesToTime(train.toStationSchedule?.arrivalMinutes)}
                &nbsp;&nbsp;•&nbsp;&nbsp;
                Day {train.toStationSchedule?.day || 1}
                {train.toStationSchedule?.platform && ` • Platform ${train.toStationSchedule.platform}`}
              </p>
            </div>

            <p>
              <strong>Distance:</strong> {train.distanceKm} km
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
