import { ProtectedRoute } from "./AuthRoutes"
import MyTasksPage from "../pages/technician/MyTasksPage"
import PendingTasksPage from "../pages/technician/PendingTasks"
import TaskDetailsPage from "../pages/technician/TaskDetailsPage"
import Technician_Profile from '../pages/technician/Technician_Profile'
import TechnicianEditPassword from '../pages/technician/TechnicianEditPassword'


import { Routes, Route } from "react-router-dom"
import PaymentDetailPage from "../pages/technician/PaymentDetail"

export const TechnicianRoute = (
    <>
        <Route path="/technician/home"
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

        <Route path="/technician/profile"
            element={
                <Technician_Profile />
            }
        />

        <Route path="/technician/change-password"
            element={
                <TechnicianEditPassword />
            }
        />

        <Route path="/technician/tasks/:taskId/payment-detail"
            element={
                <ProtectedRoute role={"technician"}>
                    <PaymentDetailPage />
                </ProtectedRoute>
            } />

    </>
)
