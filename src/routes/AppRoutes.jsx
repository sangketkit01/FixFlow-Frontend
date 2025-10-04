import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import UserLogin from "../pages/user/Login";
import UserRegister from "../pages/user/Register";
import { UserRoute } from "./UserRoutes";
import { AdminRoute } from "./AdminRoutes";
import { TechnicianRoute } from "./TechnicianRoutes";
import AdminLogin from "../pages/admin/AdminLogin";
import TechnicianLogin from "../pages/technician/TechnicianLogin";
import TechnicianRegister from "../pages/technician/TechnicianRegister";
import IndexPage from "../pages/index";

import MyTasksPage from "../page/MyTasksPage";
import AvailableTasksPage from "../page/AvailableTasksPage";


const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route
                    path="/login"
                    element={
                        <UserLogin />
                    }
                />

                <Route path="/admin/login" element={

                    <AdminLogin />
                } />

                <Route path="/technician/login" element={
                    <TechnicianLogin />
                } />

                <Route
                    path="/register"
                    element={
                        <UserRegister />
                    }
                />

                <Route
                    path="/technician/register"
                    element={
                        <TechnicianRegister />
                    }
                />

                <Route path ="/mytasks" 
                    element = { < MyTasksPage / >
                    }
                />
                <Route path ="/available-tasks" 
                    element = { < AvailableTasksPage / >
                    }
                />

                {UserRoute}
                {AdminRoute}
                {TechnicianRoute}
            </Routes>

        </>
    );
};


export default AppRoutes;

