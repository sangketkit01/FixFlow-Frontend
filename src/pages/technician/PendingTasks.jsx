import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, MapPin, Calendar, ClipboardList, Loader, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import Navtech from '../../../components/technician/Navtech';
import baseUrl from '../../../constants/ServerConstant';

// Component สำหรับแสดง Icon สถานะ
const ExclamationCircle = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

// ==========================================================
// ===         คอมโพเนนต์: Confirmation Modal             ===
// ==========================================================
const ConfirmationModal = ({ details, onConfirm, onCancel }) => {
    if (!details) return null;

    const { title, message, confirmText, confirmColor } = details;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 m-4 max-w-md w-full transform animate-modal-pop-in">
                <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${confirmColor.replace('hover:', '')} bg-opacity-10`}>
                        <Info className={`w-6 h-6 ${confirmColor.replace('bg-', 'text-').replace('hover:text-', 'text-')}`} />
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
// ===         คอมโพเนนต์: PendingTaskCard                ===
// ==========================================================
const PendingTaskCard = ({ task, animationDelay, onAcceptTask, isAccepting }) => {
    // ฟังก์ชันสำหรับแสดงชื่อลูกค้าอย่างปลอดภัย
    const renderCustomerName = (username) => {
        if (!username) {
            return <span className="text-gray-500">ไม่มีข้อมูล</span>;
        }
        const fullName = `${username.firstName || ''} ${username.lastName || ''}`.trim();
        return fullName || <span className="text-gray-500">ไม่มีชื่อ</span>;
    };

    // ฟังก์ชันสำหรับแสดงวันที่อย่างปลอดภัย
    const formatCreationDate = (dateString) => {
        if (!dateString) {
            return <span className="text-gray-500">ไม่มีข้อมูล</span>;
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return <span className="text-red-500">วันที่ไม่ถูกต้อง</span>;
        }
        return date.toLocaleString('th-TH');
    };

    return (
        <div
            className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-slide-up flex flex-col"
            style={{ animationDelay }}
        >
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 pr-2">{task.title}</h3>
                    <div className="flex items-center space-x-2 px-3 py-1 text-sm font-semibold rounded-full bg-yellow-200 text-yellow-900">
                        <ExclamationCircle className="w-5 h-5" />
                        <span>รอดำเนินการ</span>
                    </div>
                </div>

                <p className="text-gray-600 mb-5 flex items-start">
                    <ClipboardList className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-blue-500" />
                    <span>{task.detail}</span>
                </p>

                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center">
                        <User className="w-4 h-4 mr-3 text-blue-500" />
                        <strong>ลูกค้า:</strong><span className="ml-2">{renderCustomerName(task.username)}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                        <strong>ที่อยู่:</strong><span className="ml-2">{task.address}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                        <strong>แจ้งเมื่อ:</strong><span className="ml-2">{formatCreationDate(task.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                {isAccepting ? (
                    <div className="flex justify-center items-center h-10">
                        <Loader className="w-5 h-5 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-600">กำลังรับงาน...</span>
                    </div>
                ) : (
                    <button
                        onClick={() => onAcceptTask(task._id)}
                        className="w-full flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        รับงาน
                    </button>
                )}
            </div>
        </div>
    );
};

// ==========================================================
// ===         คอมโพเนนต์หลัก: PendingTasksPage           ===
// ==========================================================
const PendingTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [acceptingTaskId, setAcceptingTaskId] = useState(null);

    useEffect(() => {
        fetchPendingTasks();
    }, []);

    // ดึงงานที่ยังไม่มีช่างรับ (technician_id = null และ status = pending)
    const fetchPendingTasks = async () => {
        try {
            const response = await axios.get(baseUrl + '/technician/tasks/available', {
                withCredentials: true
            });
            const tasksData = Array.isArray(response.data) ? response.data : response.data.tasks || [];
            setTasks(tasksData);
        } catch (err) {
            const message = err.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
            setError(message);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    // แสดง Modal ยืนยันก่อนรับงาน
    const requestAcceptTask = (taskId) => {
        setConfirmation({
            title: 'ยืนยันการรับงาน?',
            message: 'คุณต้องการรับงานนี้ใช่หรือไม่?',
            confirmText: 'ใช่, รับงาน',
            confirmColor: 'bg-purple-500 hover:bg-purple-600',
            taskId
        });
    };

    // ฟังก์ชันรับงาน - ใส่ technician_id และเปลี่ยนสถานะเป็น accepted
    const handleAcceptTask = async (taskId) => {
        setAcceptingTaskId(taskId);
        try {
            // เรียก API รับงาน (Backend จะใส่ technician_id อัตโนมัติจาก token)
            await axios.put(
                `${baseUrl}/technician/tasks/${taskId}/accept`,
                {},
                { withCredentials: true }
            );

            // ลบงานออกจากรายการ pending ทันที (การ์ดหายไป)
            setTasks(currentTasks => currentTasks.filter(task => task._id !== taskId));

            // แสดงข้อความสำเร็จ
            alert('รับงานสำเร็จ! งานถูกย้ายไปยังหน้า "งานของฉัน" แล้ว');
        } catch (err) {
            console.error("Failed to accept task:", err);
            alert(`เกิดข้อผิดพลาดในการรับงาน: ${err.response?.data?.message || err.message}`);
        } finally {
            setAcceptingTaskId(null);
        }
    };

    const handleConfirm = () => {
        if (confirmation) {
            handleAcceptTask(confirmation.taskId);
            setConfirmation(null);
        }
    };

    const handleCancel = () => {
        setConfirmation(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <Navtech />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        งานที่รอรับ
                    </h1>
                    <p className="text-lg text-gray-600">
                        รายการงานใหม่ที่รอให้คุณรับทำ
                    </p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader className="w-12 h-12 text-purple-600 animate-spin" />
                        <p className="ml-4 text-2xl text-gray-700">กำลังโหลดข้อมูลงาน...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md max-w-2xl mx-auto animate-slide-up">
                        <div className="flex">
                            <div className="py-1"><AlertTriangle className="h-6 w-6 text-red-500 mr-4" /></div>
                            <div>
                                <p className="font-bold text-lg">เกิดข้อผิดพลาด!</p>
                                <p className="text-md">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    tasks.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tasks.map((task, index) => (
                                <PendingTaskCard
                                    key={task._id}
                                    task={task}
                                    animationDelay={`${index * 100}ms`}
                                    onAcceptTask={requestAcceptTask}
                                    isAccepting={acceptingTaskId === task._id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 animate-fade-in">
                            <h2 className="text-2xl font-semibold text-gray-700">
                                ยังไม่มีงานที่รอรับในขณะนี้
                            </h2>
                            <p className="text-gray-500 mt-2">
                                เมื่อมีงานใหม่เข้ามา ระบบจะแสดงผลที่หน้านี้
                            </p>
                        </div>
                    )
                )}
            </main>

            <ConfirmationModal
                details={confirmation}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />

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

export default PendingTasksPage;