import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import authRoutes from "./src/routes/authRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import departmentRoutes from "./src/routes/departmentRoutes.js";
import chatbotRoutes from "./src/routes/chatbotRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js"; // ✅ ADD THIS

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/admin", adminRoutes); // ✅ ADD THIS

app.get("/", (req, res) => {
  res.send("🚀 EduConnect API is running...");
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Chatbot API: http://localhost:${PORT}/api/chatbot`);
  console.log(`👤 Admin API: http://localhost:${PORT}/api/admin`);
});