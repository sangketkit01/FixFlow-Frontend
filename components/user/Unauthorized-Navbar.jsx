
export default function UnauthorizedNavbar() {
    return (
        <nav className="w-full bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo and menu items */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <h1 className="text-xl font-semibold text-gray-900 leading-none">
                            fix
                            <span className="text-purple-600 inline-block ">&</span>
                            ing
                        </h1>

                        {/* Menu items */}
                        <div className="hidden md:flex space-x-8">
                            <a href="/" className="text-gray-700 hover:text-gray-900 hover:underline transition-colors">
                                หน้าแรก
                            </a>
                            <a href="#" className="text-gray-700 hover:text-gray-900 hover:underline transition-colors">
                                คุณสมบัติเด่น
                            </a>
                            <a href="#" className="text-gray-700 hover:text-gray-900 hover:underline transition-colors">
                                ราคา
                            </a>
                            <a href="#" className="text-gray-700 hover:text-gray-900 hover:underline transition-colors">
                                คำถามที่พบบ่อย
                            </a>
                        </div>
                    </div>

                    {/* Right side - Login button */}
                    <div>
                        <a href="/login" className="px-6 py-2 border-2 border-blue-500 bg-white text-blue-500 rounded-full hover:bg-blue-50 transition-colors">
                            เข้าสู่ระบบ
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}