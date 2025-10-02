import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/rooms.routes.js";
import bookingRoutes from "./routes/bookings.routes.js";
import healthRoutes from "./routes/health.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use("/", healthRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Error interno" });
});

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/bookly_js";

connectDB(MONGO_URL).then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
});
