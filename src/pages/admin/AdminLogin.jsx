import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setShowError(false);

        try {
            const res = await axios.post(
                "http://localhost:8080/admin/login", // 🔑 endpoint สำหรับ admin
                { username, password },
                { withCredentials: true }
            );

            console.log("Admin login success:", res.data);
            navigate("/admin/dashboard"); // 🔑 ไปที่หน้าแดชบอร์ด admin
        } catch (error) {
            console.error(error);
            if (error.response) {
                setErrorMessage(error.response.data.message || "เข้าสู่ระบบผู้ดูแลไม่สำเร็จ");
            } else {
                setErrorMessage("เซิร์ฟเวอร์ไม่ตอบสนอง");
            }
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 via-white to-purple-200 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mt-[50px]">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                        fix<span className="text-purple-600">&</span>ing <span className="text-gray-500 text-lg">Admin</span>
                    </h1>
                    <p className="mt-2 text-gray-500 text-sm">
                        สำหรับผู้ดูแลระบบ
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            ชื่อผู้ใช้
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            รหัสผ่าน
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </button>
                </form>
            </div>

            {/* Error Modal */}
            {showError && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-lg font-bold text-red-600 mb-4">
                            เข้าสู่ระบบล้มเหลว
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
    );
}
