// src/components/Login/RightSection.jsx
import React, { useState } from "react";

export const Logo = () => (
    <div className="text-3xl font-bold text-gray-800 mb-10">
        fix<span className="text-orange-400">&</span>ing
    </div>
);

export const FormHeader = () => (
    <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">เข้าสู่ระบบ</h1>
        <p className="text-gray-500">กรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>
    </div>
);

export const InputGroup = ({ label, type, id, placeholder, value, onChange }) => {
    const [focus, setFocus] = useState(false);
    return (
        <div className="mb-6">
            <label htmlFor={id} className="block mb-2 font-medium text-gray-700 text-sm">
                {label}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                className={`w-full p-4 border-2 rounded-xl text-base outline-none transition ${focus
                    ? "border-purple-400 bg-white shadow-md"
                    : "border-gray-200 bg-gray-50"
                    }`}
            />
        </div>
    );
};

export const RememberForgot = ({ remember, setRemember }) => (
    <div className="flex justify-between items-center mb-6 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-purple-500"
            />
            <span className="text-gray-600">จดจำฉันไว้</span>
        </label>
        <a href="#" className="text-purple-500 font-medium hover:text-purple-700">
            ลืมรหัสผ่าน?
        </a>
    </div>
);

export const Divider = () => (
    <div className="flex items-center my-8">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="px-4 text-gray-400 text-sm">หรือ</span>
        <div className="flex-1 h-px bg-gray-200"></div>
    </div>
);

export const SignupText = () => (
    <div className="text-center text-gray-600 text-sm">
        ยังไม่มีบัญชี?{" "}
        <a href="#" className="text-purple-500 font-semibold hover:text-purple-700">
            สร้างบัญชีใหม่
        </a>
    </div>
);

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            alert("กำลังเข้าสู่ระบบ...");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputGroup
                label="อีเมลหรือเบอร์โทรศัพท์"
                type="text"
                id="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputGroup
                label="รหัสผ่าน"
                type="password"
                id="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <RememberForgot remember={remember} setRemember={setRemember} />
            <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-md hover:-translate-y-1 transition"
            >
                เข้าสู่ระบบ
            </button>
            <Divider />
            <SignupText />
        </form>
    );
};

export const RightSection = () => (
    <div className="flex-[0.8] flex flex-col justify-center p-12 bg-white">
        <Logo />
        <FormHeader />
        <LoginForm />
    </div>
);
