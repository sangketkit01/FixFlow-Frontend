import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, MapPin, ClipboardList, AlertTriangle, Loader, CheckCircle, Info } from 'lucide-react';
import MainNav from "../../components/user/MainNav";

// ==========================================================
// ===  ✅ 1. คัดลอก ConfirmationModal มาวางที่นี่         ===
// ==========================================================
const ConfirmationModal = ({ details, onConfirm, onCancel }) => {
    if (!details) return null;

    const { title, message, confirmText, confirmColor } = details;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 m-4 max-w-md w-full transform animate-modal-pop-in">
                <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${confirmColor.replace('hover:', '')} bg-opacity-10`}>
                        <Info className={`w-6 h-6 ${confirmColor.replace('bg-', 'text-').replace('hover:text-','text-')}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                </div>
                
                <p className="text-gray-600 mb-8 ml-16">{message}</p>
                
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-6 py-2 text-white font-semibold rounded-lg ${confirmColor} transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};


// ==========================================================
// ===      คอมโพเนนต์หลัก AvailableTasksPage             ===
// ==========================================================
const AvailableTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ✅ 2. เพิ่ม State สำหรับจัดการ Modal
    const [confirmation, setConfirmation] = useState(null);

    // --- ส่วน Logic การดึงข้อมูลยังคงเดิม ---
    useEffect(() => {
        const fetchAvailableTasks = async () => {
            // ... โค้ด fetch data เหมือนเดิมทุกประการ ...
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get('/api/tasks/unassigned', config);
                if (Array.isArray(response.data)) {
                    setTasks(response.data);
                } else {
                    setTasks([]);
                }
            } catch (err) {
                const message = err.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
                setError(message);
                setTasks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailableTasks();
    }, []);

    // ✅ 3. สร้างฟังก์ชันสำหรับจัดการ Modal และ API
    const handleApiAcceptTask = async (taskId) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.patch(`/api/technician/tasks/${taskId}/accept`, {}, config);
            
            alert(response.data.message); // หรือจะเปลี่ยนเป็น Modal สวยๆ ก็ได้
            
            // อัปเดต UI โดยการกรองงานที่รับไปแล้วออก
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));

        } catch (err) {
            const message = err.response?.data?.message || "ไม่สามารถรับงานได้";
            alert(`เกิดข้อผิดพลาด: ${message}`); // หรือจะเปลี่ยนเป็น Modal สวยๆ ก็ได้
        }
    };

    const requestAcceptConfirmation = (taskId) => {
        setConfirmation({
            title: 'ยืนยันการรับงาน',
            message: 'คุณต้องการรับงานนี้ใช่หรือไม่?',
            confirmText: 'ใช่, รับงานนี้!',
            confirmColor: 'bg-purple-600 hover:bg-purple-700',
            taskId: taskId // เก็บ taskId ไว้เพื่อส่งต่อ
        });
    };

    const handleConfirmAccept = () => {
        if (confirmation) {
            handleApiAcceptTask(confirmation.taskId);
            setConfirmation(null); // ปิด Modal
        }
    };

    const handleCancelAccept = () => {
        setConfirmation(null); // ปิด Modal
    };

    // --- ส่วนการแสดงผล (JSX) ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <MainNav />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        งานที่ยังว่าง
                    </h1>
                    <p className="text-lg text-gray-600">
                        เลือกรับงานที่คุณสนใจเพื่อเริ่มให้บริการ
                    </p>
                </div>

                {/* --- Loading & Error States เหมือนเดิม --- */}
                {loading && ( <div className="flex justify-center items-center py-20">...</div> )}
                {error && ( <div className="bg-red-100 ...">{error}</div> )}

                {/* --- Content - Task Cards --- */}
                {!loading && !error && (
                    tasks.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tasks.map((task, index) => (
                                <div
                                    key={task._id}
                                    className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-slide-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* ... ส่วนแสดงรายละเอียด Task Card เหมือนเดิม ... */}
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mr-4 flex items-center justify-center">
                                            <Wrench className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 truncate">{task.title}</h3>
                                    </div>
                                    <div className="space-y-3 text-gray-700 mb-6">
                                        <div className="flex items-start">... {task.detail} ...</div>
                                        <div className="flex items-start">... {task.address} ...</div>
                                    </div>
                                    
                                    <button
                                        // ✅ 4. แก้ไข onClick ให้เรียกฟังก์ชันเปิด Modal
                                        onClick={() => requestAcceptConfirmation(task._id)}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 group inline-flex items-center justify-center space-x-2"
                                    >
                                        <CheckCircle className="group-hover:rotate-12 transition-transform duration-300" />
                                        <span>รับงานนี้</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 animate-fade-in">
                            {/* ... Empty State ... */}
                        </div>
                    )
                )}
            </main>

            {/* ✅ 5. เพิ่ม Modal เข้าไปใน JSX */}
            <ConfirmationModal
                details={confirmation}
                onConfirm={handleConfirmAccept}
                onCancel={handleCancelAccept}
            />
            
            {/* --- CSS Animations เหมือนเดิม --- */}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes modal-pop-in {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .animate-fade-in { animation: fade-in 1s ease-out forwards; }
                .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.8s ease-out backwards; }
                .animate-modal-pop-in { animation: modal-pop-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AvailableTasksPage;