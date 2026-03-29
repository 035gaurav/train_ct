import React, { useState } from "react";
import "./App.css";

// ✅ FIXED: fallback added (VERY IMPORTANT)
const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://ec2-13-53-129-150.eu-north-1.compute.amazonaws.com:5000/api";

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!from || !to) {
      return alert("Enter both station codes");
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/trains/between?from=${from.toUpperCase()}&to=${to.toUpperCase()}`
      );

      const result = await response.json();

      if (result.success && result.data?.trains) {
        setTrains(result.data.trains);
      } else {
        setTrains([]);
        setError("No trains found for this route.");
      }

    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend.");
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
        />

        <input
          type="text"
          placeholder="To (BCT)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <button type="submit">
          {loading ? "Searching..." : "Search Trains"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="results">
        {trains.map((train) => (
          <div key={train.trainNumber} className="train-card">
            <h3>
              {train.trainName} ({train.trainNumber})
            </h3>

            <p><strong>Type:</strong> {train.type}</p>
            <p>
              <strong>Runs On:</strong>{" "}
              {train.runningDays?.days?.join(", ") || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;