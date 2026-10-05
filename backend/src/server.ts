
import "dotenv/config";

import express from "express";
import cors from "cors";
import otpRoutes from "./routes/otpRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/otp", otpRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Siya-Fund OTP Backend is running 🚀"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

