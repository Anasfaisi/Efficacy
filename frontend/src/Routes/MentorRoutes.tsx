import { Routes,Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { logout } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import MentorDashboard from "@/pages/mentors/MentorDashboard";

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  dispatch(logout({role:"mentor"}));
  return <Navigate to="/Mentor/login" replace />;
};

const MentorRoutes : React.FC =()=>{
    return (
        <Routes>
            <Route path="dashboard" element ={<MentorDashboard  />} />
            <Route path="logout" element={<Logout />} />
        </Routes>
    )
}
export default MentorRoutes