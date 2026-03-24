import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.RAILRADAR_API_KEY;
const BASE_URL = "https://api.railradar.org/api/v1";

// Route to search trains between stations
app.get("/api/trains/between", async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ success: false, message: "From and To codes required" });
  }

  try {
    const response = await axios.get(`${BASE_URL}/trains/between`, {
      params: { from, to },
      headers: { "X-API-Key": API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "RailRadar API failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));