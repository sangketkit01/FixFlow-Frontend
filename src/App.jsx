import React from 'react';
import MainNav from './components/MainNav';
// Import images (คุณจะต้องเพิ่มไฟล์รูปภาพเหล่านี้ใน assets)
// import toolboxImage from './assets/images/toolbox.png';
// import workerImage from './assets/images/worker.png';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-purple-50 to-white">
      <MainNav />

      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <div className="mb-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4 font-kanit">
                FixFlow              </h1>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 font-sarabun">
                บริการรับซ่อมกิ่วราชอาณาจักร
              </h2>
              <p className="text-2xl text-gray-600 mb-4 font-sarabun">
                รับซ่อมอุปกรณ์ทุกอย่างที่เกี่ยวกับไฟฟ้า
              </p>
              
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-orange-200 to-orange-400 rounded-3xl flex items-center justify-center shadow-2xl">
               
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4 font-sarabun">
            บริการของเรา
          </h2>
          <p className="text-center text-blue-500 mb-16 font-sarabun">
            การบริการที่เหมาะสมสำหรับบุคคล
          </p>

          {/* Services Grid */}
          <div className="relative max-w-4xl mx-auto">
            {/* Center Worker Image */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-purple-200 to-purple-400 rounded-full flex items-center justify-center shadow-xl">
                  <div className="text-8xl">👷‍♂️</div>
                </div>
              </div>
            </div>

            {/* Service Items arranged around the worker */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
           

            </div>

            <p className="text-center text-blue-500 mt-12 font-sarabun">
              ช่างซ่อมพร้อมให้บริการ 24 ชั่วโมง
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-sarabun">
                งานซ่อมแอร์
              </h3>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-600 font-sarabun">
                บริการดีมาก ช่างมาเร็ว งานเสร็จเรียบร้อย ราคาเป็นกันเอง
              </p>
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-800 font-sarabun">คุณสมชาย</p>
                  <p className="text-sm text-gray-500 font-sarabun">ลูกค้าประจำ</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-sarabun">
                งานซ่อมทีวี
              </h3>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-600 font-sarabun">
                ช่างมีความเชี่ยวชาญสูง แก้ปัญหาได้อย่างรวดเร็ว แนะนำเลย
              </p>
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-800 font-sarabun">คุณสมหญิง</p>
                  <p className="text-sm text-gray-500 font-sarabun">ลูกค้าใหม่</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <button className="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200 font-sarabun">
              แจ้งซ่อมออนไลน์
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-purple-50 to-purple-100 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-sarabun">
                ติดต่อเรา
              </h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-purple-500 transition-colors font-sarabun">
                  Facebook
                </a>
                <a href="#" className="block text-gray-600 hover:text-purple-500 transition-colors font-sarabun">
                  X
                </a>
                <a href="#" className="block text-gray-600 hover:text-purple-500 transition-colors font-sarabun">
                  Instagram
                </a>
                <a href="#" className="block text-gray-600 hover:text-purple-500 transition-colors font-sarabun">
                  YouTube
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-sarabun">
                บริการ
              </h3>
              <div className="space-y-3">
               
                <a href="#" className="block text-gray-600 hover:text-purple-500 transition-colors font-sarabun">
                  แจ้งซ่อม
                </a>
                <a href="#" className="block text-gray-600 hover:text-purple-500 transition-colors font-sarabun">
                  ติดต่อช่าง
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-sarabun">
                เกี่ยวกับเรา
              </h3>
              <div className="space-y-3">
              
                <a href="#" className="block text-gray-600 hover:text-purple-500 transition-colors font-sarabun">
                  ทีมงาน
                </a>
               
              </div>
            </div>
          </div>

          <div className="border-t border-purple-200 mt-12 pt-8 text-center">
            <p className="text-gray-600 font-sarabun">
              © 2025 FixFlow
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;