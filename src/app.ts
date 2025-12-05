import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import {sanitizeBody} from "./middleware/sanitize.js";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js"
import apiRoutes from "./routes/api.routes.js"
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(express.json({limit: "10kb"}));
app.use(sanitizeBody);

if(process.env.NODE_ENV !== "production"){
    app.use(morgan("dev"));
}

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}))

const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20
})

app.use(globalLimiter);

app.use("/api/auth/", authRoutes);
app.use("/api/", apiRoutes);

app.use("/", (_req, res) => res.json({message: "Regret Predictor API"}));
app.use((_req, res) => res.status(404).json({message: "Not Found"}));
app.use(errorHandler);

export default app;