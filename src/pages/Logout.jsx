'use client';

import axios from "axios";
import baseUrl from "../../constants/ServerConstant";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export const Logout = () => {
    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post(baseUrl + "/logout", {}, { withCredentials: true });
            } catch (error) {
                console.error("Logout error:", error);
            }
        };
        logout();
    }, []);

    return <Navigate to="/" replace />;
}