import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoginPage from "../pages/user/Login";
import Rprepair from "../pages/user/Rprepair";
import EditTech from "../pages/admin/EditTech";
import AddTechnician from "../pages/admin/addTechnician";
import AdminManage from "../pages/admin/AdminManage"; 
import AdminLogin from "../pages/admin/AdminLogin";
import TechnicianDetail from "../pages/admin/TechnicianDetail";
import AdminTechEdit from "../pages/admin/AdminTechEdit";
import TaskDetail from "../pages/admin/TaskDetail";


export const PublicRoute = ({ children }) => {
    const { user } = useAuth();
 
    if (user) {
        if (user.role === "admin") return <Navigate to={"/admin/home"} replace />
        if (user.role === "technician") return <Navigate to={"/technician"} replace />
        return <Navigate to={"/home"} replace />
    }

    return children;
}
// const ProtectedRoute = ({ children, role }) => {
//     const { user } = useAuth();

//     if (!user) {
//         if (role === "admin") return <Navigate to="/admin/login" replace />;
//         if (role === "technician") return <Navigate to="/technician/login" replace />;
//         return <Navigate to="/login" replace />;
//     }

//     if (role && user.role !== role) {
//         return <Navigate to="/" replace />;
//     }

//     return children;
// };

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<h1 className="text-black">Hello World ทดสอบฟ้อน</h1>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/report-repair" element={<Rprepair />} />
            <Route path="/edit-tech" element={<EditTech />} />
            
            {/* Admin Routes */}
            <Route path="/admin/home" element={<AdminManage />} />
            <Route path="/admin/add-technician" element={<AddTechnician />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/technicians/:id" element={<TechnicianDetail />} />
            <Route path="/admin/technicians/edit/:id" element={<AdminTechEdit />} />
       
        </Routes>
    )
}

export default AppRoutes;