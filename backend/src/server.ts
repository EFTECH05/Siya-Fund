
import "dotenv/config";

import express from "express";
import cors from "cors";

import otpRoutes from "./routes/otpRoutes";
import loanRoutes from "./routes/loanRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/otp", otpRoutes);
app.use("/api/loans", loanRoutes);

// Root endpoint
app.get("/", (_req, res) => {
  res.json({
    message: "Siya-Fund Backend is running 🚀",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
