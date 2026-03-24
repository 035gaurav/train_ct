import React, { useState } from "react";
import "./App.css";

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to) return alert("Enter both station codes");

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/trains/between?from=${from.toUpperCase()}&to=${to.toUpperCase()}`
      );
      const result = await response.json();

      if (result.success && result.data.trains) {
        setTrains(result.data.trains);
      } else {
        setTrains([]);
        setError("No trains found for this route.");
      }
    } catch (err) {
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
          placeholder="From (e.g. NDLS)" 
          value={from} 
          onChange={(e) => setFrom(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="To (e.g. BCT)" 
          value={to} 
          onChange={(e) => setTo(e.target.value)} 
        />
        <button type="submit">{loading ? "Searching..." : "Search Trains"}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="results">
        {trains.map((train) => (
          <div key={train.trainNumber} className="train-card">
            <h3>{train.trainName} <span>({train.trainNumber})</span></h3>
            <div className="details">
              <p><strong>Type:</strong> {train.type}</p>
              <p><strong>Runs On:</strong> {train.runningDays?.days?.join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;