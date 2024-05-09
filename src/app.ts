import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import tutorsRoutes from "./routes/tutors.route";
import studentsRoutes from "./routes/students.route";
import authRoutes from "./routes/auth.route";
import bookingRoutes from './routes/booking.route';
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/api/tutors", tutorsRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/booking', bookingRoutes);

// After all other middleware and routes
app.use(errorHandler); // Use the error handling middleware

const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
