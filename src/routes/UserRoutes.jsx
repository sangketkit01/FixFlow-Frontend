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

            <Route path="/user/report-repair" element={
                <ProtectedRoute>
                    <Rprepair />
                </ProtectedRoute>
            } />
        </Routes>
    )
}