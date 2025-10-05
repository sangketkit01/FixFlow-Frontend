import { ProtectedRoute } from "./AuthRoutes"
import MyTasksPage from "../pages/technician/MyTasksPage"
import PendingTasksPage from "../pages/technician/PendingTasks"

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
        <Route path="/technician/pending-tasks"
            element={
                <ProtectedRoute role={"technician"}>
                    <PendingTasksPage />
                </ProtectedRoute>
            }
        />
    </>
)
