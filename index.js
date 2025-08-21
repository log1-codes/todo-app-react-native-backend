require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");


const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
  tlsInsecure: false, 
})
.then(() => {
  console.log("✅ Connected to MongoDB successfully");
})
.catch((error) => {
  console.error("❌ MongoDB connection error:", error.message);
  process.exit(1);
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.get("/" ,(req ,res)=>{
    res.send("Welcome to the Todo App API");
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));