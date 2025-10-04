import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, Wrench, Activity, Clock, User, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import baseUrl from '../../constants/ServerConstant';

function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'หน้าหลัก', icon: Home, href: '/home' },
    { name: 'แจ้งซ่อม', icon: Wrench, href: '/user/report-repair' },
    { name: 'สถานะการซ่อม', icon: Activity, href: '/statusRepair' },
    { name: 'ประวัติการซ่อม', icon: Clock, href: '/historyRepair' }
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : 'bg-white'
        } border-b border-purple-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <img
                src="/src/assets/logo.svg"
                alt="Logo"
                width={140}
                className="transform group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`group relative px-4 py-2.5 font-medium transition-all duration-200 rounded-lg ${active
                    ? 'text-purple-700 bg-purple-100'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'
                      }`} />
                    <span>{item.name}</span>
                  </div>
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-600 to-purple-700 transition-all duration-300 ${active ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                    }`}></div>
                </a>
              );
            })}
          </div>

          {/* User Avatar (Desktop) with Dropdown */}
          <div className="hidden md:block relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img
                  src={user && user.profile_path ? baseUrl + "/" + user.profile_path : baseUrl + "/images/user_profile.png"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">{user && user.name ? user.name : "Unknown"}</p>
                <p className="text-xs text-gray-500">User Account</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-purple-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <a
                  href="/user/profile"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">จัดการโปรไฟล์</span>
                </a>
                <div className="border-t border-purple-100 my-1"></div>
                <a
                  href="/logout"
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <a href='/logout' className="font-medium text-gray-700">ออกจากระบบ</a>
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-purple-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-purple-700" />
              ) : (
                <Menu className="w-6 h-6 text-purple-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-4 space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                  <span className="font-medium">{item.name}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-purple-600"></div>
                  )}
                </a>
              );
            })}

            {/* Mobile User Section */}
            <div className="mt-4 pt-4 border-t border-purple-100">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold">ผู้</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">ผู้ใช้งาน</p>
                  <p className="text-xs text-gray-600">User Account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav >
  );
}

export default MainNav;