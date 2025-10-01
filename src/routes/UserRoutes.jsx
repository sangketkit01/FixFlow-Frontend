import { Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./AppRoutes"

export const UserRoute = () => {
    return (
        <Routes>
            <Route path="/home" element={
                <ProtectedRoute>
                    <h1>User Home</h1>
                </ProtectedRoute>
            } />
        </Routes>
    )
}