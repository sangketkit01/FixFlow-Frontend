import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import UserLogin from "../pages/user/Login";
import UserRegister from "../pages/user/Register";
import { UserRoute } from "./UserRoutes";
import { AdminRoute } from "./AdminRoutes";
import { TechnicianRoute } from "./TechnicianRoutes";

export const PublicRoute = ({ children }) => {
    const { user } = useAuth();

    if (user) {
        if (user.role === "admin") return <Navigate to={"/admin"} replace />
        if (user.role === "technician") return <Navigate to={"/technician"} replace />
        return <Navigate to={"/home"} replace />
    }

    return children;
}

export const ProtectedRoute = ({ children, role }) => {
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
        <>
            <Routes>
                <Route path="/" element={<h1 className="text-white">Hello World</h1>} />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <UserLogin />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <UserRegister />
                        </PublicRoute>
                    }
                />
            </Routes>

            <UserRoute />
            <AdminRoute />
            <TechnicianRoute />
        </>
    );
};


export default AppRoutes;

