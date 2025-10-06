import { ProtectedRoute } from "./AuthRoutes"
import MyTasksPage from "../pages/technician/MyTasksPage"
import PendingTasksPage from "../pages/technician/PendingTasks"
import TaskDetailsPage from "../pages/technician/TaskDetailsPage"

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
        
        <Route path="/technician/task-details/:taskId"
            element={
                <ProtectedRoute role={"technician"}>
                    <TaskDetailsPage />
                </ProtectedRoute>
            }
        />


    </>
)
