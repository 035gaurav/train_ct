import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
}));

app.use(express.json());

// ENV
const API_KEY = process.env.RAILRADAR_API_KEY;
const BASE_URL = "https://api.railradar.org/api/v1";

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ✅ CLEAN RESPONSE (FIXED)
app.get("/api/trains/between", async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message: "From and To codes required"
    });
  }

  try {
    const response = await axios.get(`${BASE_URL}/trains/between`, {
      params: { from, to },
      headers: { "X-API-Key": API_KEY }
    });

    // ✅ SIMPLIFIED RESPONSE
    res.json({
      success: true,
      trains: response.data?.data?.trains || []
    });

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "RailRadar API failed"
    });
  }
});

// Bind
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
