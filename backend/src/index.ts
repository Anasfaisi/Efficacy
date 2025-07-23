import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db"
import authRoutes from "./routes/authRoutes"
import adminRoutes from "./routes/adminRoutes"
import cookieParser from "cookie-parser"
import cors from "cors"


dotenv.config()
const app = express()
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from the frontend
  credentials: true, // Allow cookies/auth headers
  methods: ['GET', 'POST', 'OPTIONS'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use('/api/admin',adminRoutes)

connectDB()
const port = process.env.PORT

app.listen(port,()=>console.log("http://localhost:5000"))