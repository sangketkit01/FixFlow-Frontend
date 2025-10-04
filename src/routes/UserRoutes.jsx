import { Route } from "react-router-dom";
import { ProtectedRoute } from "./AuthRoutes";
import Rprepair from "../pages/user/Rprepair";
import Homepage from "../pages/user/Home";
import UserProfile from "../pages/user/Profile";

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
    </>
);
