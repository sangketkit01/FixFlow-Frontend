import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        if (role === "admin") return <Navigate to="/admin/login" replace />;
        if (role === "technician") return <Navigate to="/technician/login" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};



