import { ProtectedRoute } from "./AuthRoutes"
import MyTasksPage from "../pages/technician/MyTasksPage"
import AvailableTasksPage from "../pages/technician/AvailableTasksPage"

import { Routes, Route } from "react-router-dom"

export const TechnicianRoute = (
    <>
        <Route path="/technician/mytasks"
            element={
                <ProtectedRoute role={"technician"}>
                    <MyTasksPage />
                </ProtectedRoute>
            }
        />
        <Route path="/technician/available-tasks"
            element={
                <ProtectedRoute role={"technician"}>
                    <AvailableTasksPage />
                </ProtectedRoute>
            }
        />
    </>
)
