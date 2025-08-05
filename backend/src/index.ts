import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.ts"
import authRoutes from "./routes/authRoutes.ts"
import adminRoutes from "./routes/adminRoutes.ts"
import cookieParser from "cookie-parser"
import cors from "cors"


dotenv.config()
const app = express()
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, 
  methods: ['GET', 'POST', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

app.use("/api",authRoutes)
app.use('/api/admin',adminRoutes)

connectDB()
const port = process.env.PORT

app.listen(port,()=>console.log("http://localhost:5000"))