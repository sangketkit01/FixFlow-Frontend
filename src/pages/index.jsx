import React, { useState, useEffect } from 'react';
import { Wrench, Star, CheckCircle } from 'lucide-react';
import MainNav from "../../components/user/MainNav";
import UnauthorizedNavbar from '../../components/user/Unauthorized-Navbar';

export default function FixFlowLanding() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <UnauthorizedNavbar />
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-gray-900 animate-slide-up">
                            fix
                            <span className="text-purple-600 inline-block animate-bounce-slow">&</span>
                            ing
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-slide-up-delay-1">
                            บริการรับซ่อมทั่วราชอาณาจักร
                        </h2>
                        <p className="text-lg text-gray-700 animate-slide-up-delay-2">
                            รับซ่อมทุกอย่างเกี่ยวกับไฟฟ้าขอแค่คุณเลือกใช้เรา
                            <br />จองตอนนี้ลด 99%
                        </p>
                        <div className="flex items-center space-x-2 animate-slide-up-delay-3">
                            <CheckCircle className="text-green-500" />
                            <p className="text-sm text-gray-600">
                                บริการนัดหมายกับช่างมืออาชีพ แต่ออกค่ากินกับค่าเดินทางให้ด้วย
                            </p>
                        </div>
                        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up-delay-4">
                            เริ่มใช้งานเลย
                        </button>
                    </div>

                    {/* Right Image */}
                    <div className="relative flex justify-center items-center animate-float">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
                        <img
                            src="../public/dataser.svg"
                            className="w-full max-w-20xl drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        บริการของเรา
                    </h2>
                    <p className="text-lg text-blue-600">
                        การบริการที่เหมาะสมสำหรับทุกคน
                    </p>
                </div>

                {/* Service Cards Grid */}
                <div className="relative max-w-2xl mx-auto mb-16">
                    {/* Center Technician Image */}
                    <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center relative animate-float shadow-2xl">
                        <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full overflow-hidden">
                            <div className="w-full h-full flex items-end justify-center bg-gradient-to-b from-transparent to-blue-600">
                                <div className="w-32 h-40 bg-blue-500 rounded-t-3xl"></div>
                            </div>
                        </div>
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-gray-400 rounded-b-full animate-pulse-slow"></div>
                    </div>

                    {/* Service Labels in Circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <div className="absolute top-4 left-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-up">
                                <span className="text-blue-600 font-medium text-sm whitespace-nowrap">แจ้งซ่อมที่ไหนก็ได้</span>
                            </div>

                            <div className="absolute top-4 right-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
                                <span className="text-blue-600 font-medium text-sm whitespace-nowrap">มืออาชีพ</span>
                            </div>
                            <div className="absolute bottom-20 left-0 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
                                <span className="text-blue-600 font-medium text-sm whitespace-nowrap">สะดวกรวดเร็ว</span>
                            </div>
                            <div className="absolute bottom-20 right-0 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '300ms' }}>
                                <span className="text-blue-600 font-medium text-sm whitespace-nowrap">ราคาถูก</span>
                            </div>
                            <div className="absolute bottom-0 left-16 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '400ms' }}>
                                <span className="text-blue-600 font-medium text-sm whitespace-nowrap">บริการสุภาพ</span>
                            </div>
                            <div className="absolute bottom-0 right-16 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '500ms' }}>
                                <span className="text-blue-600 font-medium text-sm whitespace-nowrap">บริการทั่วไทย</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-purple-600 font-semibold text-lg animate-slide-up">
                    ช่างซ่อมพร้อมไปทุกที่  24  ชั่วโมง
                </p>
            </div>

            {/* Reviews Section */}
            <div id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-12 animate-fade-in">
                    ความคิดเห็นจากลูกค้า
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Review Card 1 */}
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-right">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mr-4"></div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">คุณประชา</h3>
                                <p className="text-sm text-gray-600">ลูกค้าประจำ</p>
                            </div>
                        </div>
                        <div className="flex space-x-1 text-yellow-400 text-2xl mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} fill="currentColor" className="animate-bounce-slow" style={{ animationDelay: `${i * 100}ms` }} />
                            ))}
                        </div>
                        <p className="text-gray-700 italic">"บริการดีมาก ช่างมืออาชีพ ทำงานรวดเร็ว แนะนำเลยครับ"</p>
                    </div>

                    {/* Review Card 2 */}
                    <div className="bg-gradient-to-br from-white to-pink-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-left">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full mr-4"></div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">คุณบุญแฟท</h3>
                                <p className="text-sm text-gray-600">ลูกค้าใหม่</p>
                            </div>
                        </div>
                        <div className="flex space-x-1 text-yellow-400 text-2xl mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} fill="currentColor" className="animate-bounce-slow" style={{ animationDelay: `${i * 100}ms` }} />
                            ))}
                        </div>
                        <p className="text-gray-700 italic">"ประทับใจมากค่ะ ราคาไม่แพง ช่างใจดี จะใช้บริการอีกแน่นอน"</p>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-16 animate-fade-in">
                    <button className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xl font-semibold hover:shadow-2xl hover:scale-110 transition-all duration-300 inline-flex items-center space-x-3 group">
                        <span>แจ้งซ่อมออนไลน์</span>
                        <Wrench className="group-hover:rotate-12 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Wrench className="h-8 w-8" />
                        <span className="text-2xl font-bold">fix×ing</span>
                    </div>
                    <p className="text-purple-200">บริการซ่อมบำรุงที่คุณไว้วางใจ</p>
                    <p className="text-purple-300 text-sm mt-4">© 2025 FixFlow. All rights reserved.</p>
                </div>
            </footer>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-right {
          from { 
            opacity: 0;
            transform: translateX(-30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-left {
          from { 
            opacity: 0;
            transform: translateX(30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-up-delay-1 {
          animation: slide-up 0.8s ease-out 0.1s backwards;
        }

        .animate-slide-up-delay-2 {
          animation: slide-up 0.8s ease-out 0.2s backwards;
        }

        .animate-slide-up-delay-3 {
          animation: slide-up 0.8s ease-out 0.3s backwards;
        }

        .animate-slide-up-delay-4 {
          animation: slide-up 0.8s ease-out 0.4s backwards;
        }

        .animate-slide-right {
          animation: slide-right 0.8s ease-out;
        }

        .animate-slide-left {
          animation: slide-left 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
        </div >
    );
}