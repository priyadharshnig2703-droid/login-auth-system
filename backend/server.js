require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
console.log("Auth routes loaded:", typeof authRoutes);

const app = express();

app.use(cors());
app.use(express.json());

// Connect authentication routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Login Authentication Backend is Running!");
});

// Connect MongoDB and start server
connectDB().then(() => {
  app.listen(5002, () => {
    console.log("Server running on port 5002");
  });
});