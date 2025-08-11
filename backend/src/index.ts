import express from "express";
import "@/config/env.config";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";

import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/authRoutes";

import { UserController } from "./controllers/UserController";
import { AdminController } from "./controllers/adminController";
import { container } from "./config/inversify.config";
import { TYPES } from "./types";
import { AdminAccessMiddleware } from "./middleware/adminAuthMiddleware";
import mentorRoutes from "./routes/mentorRoutes";
import { MentorController } from "./controllers/mentorController";

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const adminController = container.get<AdminController>(TYPES.AdminController);
const mentorController = container.get<MentorController>(TYPES.MentorController);
const userController = container.get<UserController>(TYPES.UserController);
connectDB();

app.use('/api', userRoutes(userController));
app.use("/api/admin", adminRoutes(adminController));
app.use("/api/mentor",mentorRoutes(mentorController));

const port = process.env.PORT;

app.listen(port, () => console.log("http://localhost:5000"));
