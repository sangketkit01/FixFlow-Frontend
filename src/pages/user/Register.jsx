
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UnauthorizedNavbar from "../../../components/user/Unauthorized-Navbar";
import baseUrl from "../../../constants/ServerConstant";

export default function UserRegister() {
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
    });
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setShowError(false);

        try {
            
            const res = await axios.post(baseUrl + "/user/register", formData, {
                withCredentials: true,
            });
            console.log("Register success:", res.data);

            
            const meRes = await axios.get(baseUrl + "/user/me", {
                withCredentials: true,
            });

            
            setUser(meRes.data);

            
            navigate("/home");
        } catch (error) {
            console.error(error);
            if (error.response) {
                setErrorMessage(
                    error.response.data.message || "Registration failed"
                );
            } else {
                setErrorMessage("Server not reachable");
            }
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <UnauthorizedNavbar />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 via-white to-purple-200 px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mt-[100px]">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                            fix<span className="text-purple-600">&</span>ing
                        </h1>
                        <p className="mt-2 text-gray-500 text-sm">
                            สร้างบัญชีผู้ใช้ใหม่
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
                                ชื่อผู้ใช้
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="yourusername"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                อีเมล
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                                เบอร์โทรศัพท์
                            </label>
                            <input
                                id="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="0812345678"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                                รหัสผ่าน
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-700">
                                ยืนยันรหัสผ่าน
                            </label>
                            <input
                                id="confirm_password"
                                type="password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                                required
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-8">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-xs text-gray-400">หรือ</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        มีบัญชีแล้ว?{" "}
                        <a
                            href="/login"
                            className="text-purple-600 font-semibold hover:text-purple-800"
                        >
                            เข้าสู่ระบบ
                        </a>
                    </p>
                </div>

                {/* Error Modal */}
                {showError && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
                            <h2 className="text-lg font-bold text-red-600 mb-4">
                                สมัครสมาชิกไม่สำเร็จ
                            </h2>
                            <p className="text-gray-700 mb-6">{errorMessage}</p>
                            <button
                                onClick={() => setShowError(false)}
                                className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
