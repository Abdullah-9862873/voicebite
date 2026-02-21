const express = require("express");
const cors = require("cors");

const connectDB = require("../config/db");
const menuRoutes = require("../routes/menuRoutes");
const aiRoutes = require("../routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/menu", menuRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("VoiceBite API is running on Vercel 🚀");
});

const handler = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
};

module.exports = handler;
module.exports.handler = handler;
module.exports.default = handler;
module.exports.app = app;
