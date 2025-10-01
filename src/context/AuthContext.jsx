import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import baseUrl from "../../constants/ServerConstant";


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(baseUrl + "/me", {
                    withCredentials: true
                })

                setUser(res.data)
            } catch (err) {
                setUser(null)
            }
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => { useContext(AuthContext) }