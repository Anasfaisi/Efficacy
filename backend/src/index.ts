import express from "express"
import dotenv from "dotenv"
dotenv.config()
const port = process.env.PORT
const app = express()
app.use(express.json())

app.get("/",(req,res)=>{res.send("Efficacy backend")});
app.listen(port,()=>console.log("http://localhost:5000"))