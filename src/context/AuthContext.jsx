import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import baseUrl from "../../constants/ServerConstant";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await new Promise((res) => setTimeout(res, 300));

                let endpoint = "/user/me";
                if (location.pathname.startsWith("/admin")) {
                    endpoint = "/admin/me";
                } else if (location.pathname.startsWith("/technician")) {
                    endpoint = "/technician/me";
                }

                const res = await axios.get(baseUrl + endpoint, {
                    withCredentials: true,
                });
                setUser(res.data);
            } catch (err) {
                setUser(null);
                console.warn("AuthContext error:", err?.response?.status);
            } finally {
                setAuthReady(true);
            }
        };

        fetchUser();
    }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ user, setUser, authReady }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
