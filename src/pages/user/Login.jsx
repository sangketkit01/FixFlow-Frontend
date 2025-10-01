// src/pages/Login.jsx
import React, { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // TODO: call backend
            await new Promise((r) => setTimeout(r, 800));
            alert(`Login as ${email}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 via-white to-purple-200 px-4">
            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                        fix<span className="text-purple-600">&</span>ing
                    </h1>
                    <p className="mt-2 text-gray-500 text-sm">
                        บริการซ่อมที่คุณไว้วางใจ
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            อีเมลหรือเบอร์โทรศัพท์
                        </label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
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

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="w-4 h-4 accent-purple-600"
                            />
                            จดจำฉันไว้
                        </label>
                        <a
                            href="#"
                            className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                            ลืมรหัสผ่าน?
                        </a>
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

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-xs text-gray-400">หรือ</span>
                    <div className="h-px bg-gray-200 flex-1" />
                </div>

                {/* Register */}
                <p className="text-center text-sm text-gray-600">
                    ยังไม่มีบัญชี?{" "}
                    <a
                        href="/register"
                        className="text-purple-600 font-semibold hover:text-purple-800"
                    >
                        สร้างบัญชีใหม่
                    </a>
                </p>
            </div>
        </div>
    );
}
