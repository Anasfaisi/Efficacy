import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db"
import authRoutes from "./routes/authRoutes"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())

connectDB()
const port = process.env.PORT

app.use("/api/auth",authRoutes)
app.listen(port,()=>console.log("http://localhost:5000"))