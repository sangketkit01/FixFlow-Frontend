import React from 'react';
import { Users } from 'lucide-react';

const Header = () => {
    return (
<header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center space-x-2">
                            <Users className="w-6 h-6 text-blue-600" />
                            <span>ระบบจัดการ</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">ภาพรวมและข้อมูลการปฏิบัติงาน</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 hidden sm:inline">Admin</span>
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                            A
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;