import { Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./AuthRoutes"

export const AdminRoute = () => {
    return (
        <Routes>
            <Route path="/admin/home" element={
                <ProtectedRoute role={"admin"}>
                    <h1>Admin Home</h1>
                </ProtectedRoute>
            } />
        </Routes>
    )
}