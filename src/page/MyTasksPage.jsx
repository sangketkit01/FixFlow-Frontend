import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    User, MapPin, Calendar, ClipboardList, 
    Clock, Wrench, CheckCircle, XCircle, 
    Loader, AlertTriangle, Play, ThumbsUp, ThumbsDown, Info
} from 'lucide-react';
import MainNav from "../../components/user/MainNav";


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


// --- คอมโพเนนต์ TaskCard (ปรับปรุงการแสดงผล) ---
const TaskCard = ({ task, animationDelay, onRequestUpdate, isUpdating }) => {
    
    const handleUpdateClick = (newStatus) => {
        onRequestUpdate(task._id, newStatus);
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return { icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800', text: 'รอดำเนินการ' };
            case 'fixing':
                return { icon: <Wrench className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800', text: 'กำลังซ่อม' };
            case 'successful':
                return { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-800', text: 'ซ่อมสำเร็จ' };
            case 'failed':
                return { icon: <XCircle className="w-4 h-4" />, color: 'bg-red-100 text-red-800', text: 'ซ่อมไม่สำเร็จ' };
            default:
                return { icon: <Clock className="w-4 h-4" />, color: 'bg-gray-100 text-gray-800', text: 'ไม่ระบุ' };
        }
    };

    // === [แก้ไข] ฟังก์ชันสำหรับแสดงชื่อลูกค้าอย่างปลอดภัย ===
    const renderCustomerName = (user) => {
        if (!user) {
            return <span className="text-gray-500">ไม่มีข้อมูล</span>;
        }
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        return fullName || <span className="text-gray-500">ไม่มีชื่อ</span>;
    };

    // === [แก้ไข] ฟังก์ชันสำหรับแสดงวันที่อย่างปลอดภัย ===
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

    const statusInfo = getStatusInfo(task.status);

    const renderActionButtons = () => {
        if (isUpdating) {
            return (
                <div className="flex justify-center items-center h-10">
                    <Loader className="w-5 h-5 animate-spin text-gray-500" />
                    <span className="ml-2 text-gray-600">กำลังอัปเดต...</span>
                </div>
            );
        }

        switch (task.status) {
            case 'pending':
                return (
                    <button
                        onClick={() => handleUpdateClick('fixing')}
                        className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        เริ่มดำเนินการซ่อม
                    </button>
                );
            case 'fixing':
                return (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleUpdateClick('successful')}
                            className="w-1/2 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            ซ่อมสำเร็จ
                        </button>
                        <button
                            onClick={() => handleUpdateClick('failed')}
                            className="w-1/2 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            ซ่อมไม่สำเร็จ
                        </button>
                    </div>
                );
            case 'successful':
            case 'failed':
                return (
                    <div className="text-center text-sm text-gray-500 p-2 rounded-lg bg-gray-100 font-medium">
                        งานเสร็จสิ้นแล้ว
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div 
            className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-slide-up flex flex-col"
            style={{ animationDelay }}
        >
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 pr-2">{task.title}</h3>
                    <div className={`flex items-center space-x-2 px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.text}</span>
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
                {renderActionButtons()}
            </div>
        </div>
    );
};


// --- คอมโพเนนต์หลัก MyTasksPage ---
const MyTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [updatingTaskId, setUpdatingTaskId] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get('/api/technician/tasks/my-tasks', config);
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
        fetchTasks();
    }, []);

    const handleUpdateStatus = async (taskId, newStatus) => {
        setUpdatingTaskId(taskId);
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.put(`/api/technician/tasks/${taskId}/status`, { status: newStatus }, config);

            setTasks(currentTasks => 
                currentTasks.map(task => 
                    task._id === taskId ? response.data.task : task
                )
            );
        } catch (err) {
            console.error("Failed to update task status:", err);
            alert(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${err.response?.data?.message || err.message}`);
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const requestConfirmation = (taskId, newStatus) => {
        let details = {};
        switch (newStatus) {
            case 'fixing':
                details = {
                    title: 'ยืนยันการเริ่มดำเนินการ?',
                    message: 'คุณต้องการเริ่มดำเนินการซ่อมงานนี้ใช่หรือไม่?',
                    confirmText: 'ใช่, เริ่มเลย',
                    confirmColor: 'bg-blue-500 hover:bg-blue-600',
                };
                break;
            case 'successful':
                details = {
                    title: 'ยืนยันการซ่อมสำเร็จ?',
                    message: 'คุณได้ทำการซ่อมงานนี้เสร็จสิ้นเรียบร้อยแล้วใช่หรือไม่?',
                    confirmText: 'ซ่อมสำเร็จ',
                    confirmColor: 'bg-green-500 hover:bg-green-600',
                };
                break;
            case 'failed':
                details = {
                    title: 'ยืนยันการซ่อมไม่สำเร็จ?',
                    message: 'คุณต้องการบันทึกว่างานนี้ซ่อมไม่สำเร็จใช่หรือไม่?',
                    confirmText: 'ใช่, ซ่อมไม่สำเร็จ',
                    confirmColor: 'bg-red-500 hover:bg-red-600',
                };
                break;
            default:
                return;
        }
        setConfirmation({ ...details, taskId, newStatus });
    };

    const handleConfirm = () => {
        if (confirmation) {
            handleUpdateStatus(confirmation.taskId, confirmation.newStatus);
            setConfirmation(null);
        }
    };

    const handleCancel = () => {
        setConfirmation(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <MainNav />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        รายการงานของฉัน
                    </h1>
                    <p className="text-lg text-gray-600">
                        ภาพรวมงานทั้งหมดที่คุณได้รับมอบหมาย
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
                                <TaskCard 
                                    key={task._id} 
                                    task={task} 
                                    animationDelay={`${index * 100}ms`}
                                    onRequestUpdate={requestConfirmation}
                                    isUpdating={updatingTaskId === task._id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 animate-fade-in">
                            <h2 className="text-2xl font-semibold text-gray-700">ยังไม่มีงานที่ได้รับมอบหมาย</h2>
                            <p className="text-gray-500 mt-2">เมื่องานใหม่เข้ามา ระบบจะแสดงผลที่หน้านี้</p>
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

export default MyTasksPage;

