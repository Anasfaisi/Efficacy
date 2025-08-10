import React from "react";
import AppRoutes from "./Routes/AppRoutes";
import { BrowserRouter } from 'react-router-dom';
import "./App.css"

const App:React.FC =()=>{
  return (
    
   <BrowserRouter> 
  <AppRoutes />
     </BrowserRouter>
  )
  }

export default App;