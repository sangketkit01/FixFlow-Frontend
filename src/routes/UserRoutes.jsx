import { Route } from "react-router-dom";
import { ProtectedRoute } from "./AuthRoutes";
import Rprepair from "../pages/user/Rprepair";

export const UserRoute = (
    <>
        <Route
            path="/home"
            element={
                <ProtectedRoute role={"user"}>
                    <h1>User Home</h1>
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
    </>
);
