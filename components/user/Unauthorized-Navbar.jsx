import { useState } from "react";

export default function UnauthorizedNavbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="w-full bg-white shadow-sm relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo and menu items */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <h1 className="text-xl font-semibold text-gray-900 leading-none select-none">
                            fix
                            <span className="text-purple-600 inline-block">&</span>
                            ing
                        </h1>

                        {/* Menu items */}
                        <div className="hidden md:flex space-x-8">
                            <a
                                href="/"
                                className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
                            >
                                หน้าแรก
                            </a>
                            <a
                                href="#"
                                className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
                            >
                                คุณสมบัติเด่น
                            </a>
                            <a
                                href="#"
                                className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
                            >
                                ราคา
                            </a>
                            <a
                                href="#"
                                className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
                            >
                                คำถามที่พบบ่อย
                            </a>
                        </div>
                    </div>

                    {/* Right side - Login button (Dropdown) */}
                    <div className="relative">
                        <button
                            onClick={() => setOpen(!open)}
                            className="px-6 py-2 border-2 border-blue-500 bg-white text-blue-500 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                            เข้าสู่ระบบ
                            <svg
                                className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
                                <a
                                    href="/login"
                                    className="block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                    onClick={() => setOpen(false)}
                                >
                                    เข้าสู่ระบบผู้ใช้ทั่วไป
                                </a>
                                <a
                                    href="/technician/login"
                                    className="block px-5 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                                    onClick={() => setOpen(false)}
                                >
                                    เข้าสู่ระบบช่างซ่อม
                                </a>
                                <a
                                    href="/admin/login"
                                    className="block px-5 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                                    onClick={() => setOpen(false)}
                                >
                                    เข้าสู่ระบบผู้ดูแลระบบ
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
