import { Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./AppRoutes"

export const AdminRoute = () => {
    return (
        <Routes>
            <Route path="/admin/home" element={
                <ProtectedRoute>
                    <h1>Admin Home</h1>
                </ProtectedRoute>
            } />
        </Routes>
    )
}