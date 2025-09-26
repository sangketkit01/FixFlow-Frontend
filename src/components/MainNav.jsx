import React, { useState } from 'react';
import logo from '../assets/logo.svg'

function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b-2 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <img src={logo}
            width={140}
            />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="px-4 py-2 text-gray-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              คุณสมบัติเด่น
            </a>
            <a 
              href="#" 
              className="px-4 py-2 text-gray-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              ราคา
            </a>
            <a 
              href="#" 
              className="px-4 py-2 text-gray-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              คำถามที่พบบ่อย
            </a>
          </div>

          {/* Login Button - Desktop */}
          <div className="hidden md:block">
            <button className="px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-full font-medium hover:bg-blue-500 hover:text-white transition-all duration-200">
              เข้าสู่ระบบ
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
          <a
            href="#"
            className="block px-4 py-3 text-gray-600  hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
          >
              คุณสมบัติเด่น
          </a>
          <a
            href="#"
            className="block px-4 py-3 text-gray-600  hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
          >
            ราคา
          </a>
          <a
            href="#"
            className="block px-4 py-3 text-gray-600  hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
          >
            คำถามที่พบบ่อย
          </a>
          <div className="pt-4">
            <button className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200">
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MainNav;