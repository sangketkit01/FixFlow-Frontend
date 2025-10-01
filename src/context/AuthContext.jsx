import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import baseUrl from "../../constants/ServerConstant";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    useEffect(() => {
        const fetchUser = async () => {
            try {
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
                console.log("AuthContext fetched:", res.data);
            } catch (err) {
                setUser(null);
                console.log("AuthContext error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
