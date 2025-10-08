import { Route } from "react-router-dom";
import { ProtectedRoute } from "./AuthRoutes";
import Rprepair from "../pages/user/Rprepair";
import Homepage from "../pages/user/Home";
import UserProfile from "../pages/user/Profile";
import StatusRepair from "../pages/user/statusRepair";
import HistoryRepair from "../pages/user/historyRepair";
import UserTaskDetail from "../pages/user/UserTaskDetail";

export const UserRoute = (
    <>
        <Route
            path="/home"
            element={
                <ProtectedRoute role={"user"}>
                    <Homepage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/user/report-repair"
            element={
                <ProtectedRoute role={"user"}>
                    <Rprepair />
                </ProtectedRoute>
            }
        />

        <Route path="/user/profile" element={
            <ProtectedRoute role={"user"}>
                <UserProfile />
            </ProtectedRoute>
        } />

        <Route path="/user/status-repair" element={
            <ProtectedRoute role={"user"}>
                <StatusRepair />
            </ProtectedRoute>
        } />

        <Route path="/user/history-repair" element={
            <ProtectedRoute role={"user"}>
                <HistoryRepair />
            </ProtectedRoute>
        } />

        <Route path="/user/task-detail/:taskId" element={
            <ProtectedRoute role={"user"}>
                <UserTaskDetail />
            </ProtectedRoute>
        } />
    </>
);
