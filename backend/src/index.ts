import express from "express";
import "@/config/env.config";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan"

import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";

import { UserController } from "./controllers/user.controller";
import { AdminController } from "./controllers/admin.controller";
import { container } from "./config/inversify.config";
import { TYPES } from "./types";
import { AdminAccessMiddleware } from "./middleware/admin-auth.middleware";
import mentorRoutes from "./routes/mentor.routes";
import { MentorController } from "./controllers/mentor.controller";
import { PaymentController } from "./controllers/payment.controller";
import paymentRoutes from "./routes/payment.routes";
import bodyParser from "body-parser";

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.post(
  "/api/payments/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const paymentController = container.get<PaymentController>(TYPES.PaymentController);
    return paymentController.handleWebhook(req, res);
  }
);

app.use(express.json());
app.use(cookieParser());

const adminController = container.get<AdminController>(TYPES.AdminController);
const mentorController = container.get<MentorController>(TYPES.MentorController);
const userController = container.get<UserController>(TYPES.UserController);
const paymentController = container.get<PaymentController>(TYPES.PaymentController)
connectDB();
app.use(morgan("dev"));
app.use('/api', userRoutes(userController));
app.use("/api/admin", adminRoutes(adminController));
app.use("/api/mentor",mentorRoutes(mentorController));
app.use("/api/payments",paymentRoutes(paymentController))

const port = process.env.PORT;
app.listen(port, () => console.log("http://localhost:5000"));
