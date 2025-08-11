import { Routes,Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { logout } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  dispatch(logout({role:"mentor"}));
  return <Navigate to="/Mentor/login" replace />;
};

const MentorRoutes : React.FC =()=>{
    return (
        <Routes>
            <Route path="dasboard" element ={<Dashboard  />} />
        </Routes>
    )
}
export default MentorRoutes