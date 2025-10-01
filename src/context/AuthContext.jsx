import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import baseUrl from "../../constants/ServerConstant";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                let endpoint = null;

                if (location.pathname.startsWith("/admin")) {
                    endpoint = "/admin/me";
                } else if (location.pathname.startsWith("/technician")) {
                    endpoint = "/technician/me";
                } else {
                    endpoint = "/user/me";
                }

                const res = await axios.get(baseUrl + endpoint, {
                    withCredentials: true,
                });

                setUser(res.data);
                console.log("AuthContext fetched:", res.data);
            } catch (err) {
                setUser(null);
                console.log("AuthContext error:", err);
            }
        };

        fetchUser();
    }, [location.pathname]);


    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
