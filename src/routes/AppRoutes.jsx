import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoginPage from "../pages/user/Login";
import Rprepair from "../pages/user/Rprepair";

export const PublicRoute = ({ children }) => {
    const { user } = useAuth();

    if (user) {
        if (user.role === "admin") return <Navigate to={"admin"} replace />
        if (user.role === "technician") return <Navigate to={"technician"} replace />
        return <Navigate to={"home"} replace />
    }

    return children;
}

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();

    if (!user) {
        if (role === "admin") return <Navigate to="/admin/login" replace />;
        if (role === "technician") return <Navigate to="/technician/login" replace />;
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<h1 className="text-black">Hello World ทดสอบฟ้อน</h1>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/report-repair" element={<Rprepair />} />
        </Routes>
    )
}

export default AppRoutes;