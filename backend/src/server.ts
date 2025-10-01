import app from "./index"

import connectDB from "./config/db"
import setUpSocket from "./socket/socket-setup.socket"
import "@/config/env.config";

const PORT = process.env.PORT

const startServer = async ()=>{
    try{
        await connectDB();
        const server = app.listen(PORT,()=>{
            console.log("Server is listening on the http://localhost: ",PORT)
        })
        setUpSocket(server)
    }catch(error:unknown){
        console.error("failed to start the server",error)
    }
};

startServer()
