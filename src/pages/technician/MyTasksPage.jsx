import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    User, MapPin, Calendar, ClipboardList,
    Clock, Wrench, CheckCircle, XCircle,
    Loader, AlertTriangle, Play, ThumbsUp, ThumbsDown
} from 'lucide-react';

import baseUrl from '../../../constants/ServerConstant';
import Navtech from '../../../components/technician/Navtech';


// Component for Exclamation Circle Icon
const ExclamationCircle = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

// Confirmation Modal Component
const ConfirmationModal = ({ details, onConfirm, onCancel }) => {
    if (!details) return null;

    const { title, message, confirmText, confirmColor, icon: Icon } = details;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 m-4 max-w-md w-full transform animate-modal-pop-in">
                <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${confirmColor.replace('hover:', '')} bg-opacity-10`}>
                        <Icon className={`w-6 h-6 ${confirmColor.replace('bg-', 'text-').replace('hover:text-', 'text-')}`} />
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

// Task Card Component
const TaskCard = ({ task, animationDelay, onRequestUpdate, isUpdating }) => {
    const navigate = useNavigate();

    const handleUpdateClick = (e, newStatus) => {
        e.stopPropagation(); // ป้องกันไม่ให้ trigger การคลิกการ์ด
        onRequestUpdate(task._id, newStatus);
    };

    const handleCardClick = () => {
        navigate(`/technician/task-details/${task._id}`);
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            accepted: { icon: <Wrench className="w-5 h-5" />, color: 'bg-blue-200 text-blue-900', text: 'รับงานเรียบร้อย' },
            fixing: { icon: <Wrench className="w-5 h-5 animate-spin" />, color: 'bg-indigo-200 text-indigo-900', text: 'กำลังซ่อม' },
            successful: { icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-200 text-green-900', text: 'ซ่อมสำเร็จ' },
            request_canceling: { icon: <ExclamationCircle className="w-5 h-5" />, color: 'bg-orange-200 text-orange-900', text: 'คำขอยกเลิก' },
            cancelled: { icon: <XCircle className="w-5 h-5" />, color: 'bg-red-200 text-red-900', text: 'ถูกยกเลิก' },
            failed: { icon: <XCircle className="w-5 h-5" />, color: 'bg-red-300 text-red-900', text: 'ซ่อมไม่สำเร็จ' }
        };
        return statusMap[status] || { icon: <Clock className="w-5 h-5" />, color: 'bg-gray-200 text-gray-900', text: 'ไม่ระบุ' };
    };

    const formatCreationDate = (dateString) => {
        if (!dateString) return <span className="text-gray-500">ไม่มีข้อมูล</span>;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return <span className="text-red-500">วันที่ไม่ถูกต้อง</span>;
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
                        onClick={(e) => handleUpdateClick(e, 'accepted')}
                        className="w-full flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        รับงาน
                    </button>
                );

            case 'accepted':
                return (
                    <div className="flex space-x-2">
                        <button
                            onClick={(e) => handleUpdateClick(e, 'fixing')}
                            className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                        >
                            <Play className="w-5 h-5 mr-2" />
                            เริ่มซ่อม
                        </button>
                        <button
                            onClick={(e) => handleUpdateClick(e, 'request_canceling')}
                            className="flex-1 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                        >
                            <XCircle className="w-5 h-5 mr-2" />
                            ขอยกเลิก
                        </button>
                    </div>
                );

            case 'fixing':
                return (
                    <div className="flex space-x-2">
                        <button
                            onClick={(e) => handleUpdateClick(e, 'successful')}
                            className="w-1/2 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            ซ่อมสำเร็จ
                        </button>
                        <button
                            onClick={(e) => handleUpdateClick(e, 'failed')}
                            className="w-1/2 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            ซ่อมไม่สำเร็จ
                        </button>
                    </div>
                );

            case 'request_canceling':
                return (
                    <div className="text-center text-sm text-orange-600 p-2 rounded-lg bg-orange-50 font-medium border border-orange-200">
                        รอแอดมินอนุมัติการยกเลิก
                    </div>
                );

            case 'cancelled':
                return (
                    <div className="text-center text-sm text-red-600 p-2 rounded-lg bg-red-50 font-medium border border-red-200">
                        งานถูกยกเลิกแล้ว
                    </div>
                );

            case 'successful':
                return (
                    <div className="text-center text-sm text-green-600 p-2 rounded-lg bg-green-50 font-medium border border-green-200">
                        งานเสร็จสิ้น - ซ่อมสำเร็จ
                    </div>
                );

            case 'failed':
                return (
                    <div className="text-center text-sm text-red-600 p-2 rounded-lg bg-red-50 font-medium border border-red-200">
                        งานเสร็จสิ้น - ซ่อมไม่สำเร็จ
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-slide-up flex flex-col cursor-pointer"
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
                        <strong>ลูกค้า:</strong>
                        <span className="ml-2">{task.username}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                        <strong>ที่อยู่:</strong>
                        <span className="ml-2">{task.address}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                        <strong>แจ้งเมื่อ:</strong>
                        <span className="ml-2">{formatCreationDate(task.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                {renderActionButtons()}
            </div>
        </div>
    );
};

// Main Component
const MyTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(baseUrl + '/technician/tasks/my-tasks', {
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
        fetchTasks();
    }, []);

    const handleUpdateStatus = async (taskId, newStatus) => {
        setUpdatingTaskId(taskId);
        try {
            const response = await axios.put(
                `${baseUrl}/technician/tasks/${taskId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );

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
        const confirmationDetails = {
            accepted: {
                title: 'ยืนยันการรับงาน?',
                message: 'คุณต้องการรับงานนี้ใช่หรือไม่?',
                confirmText: 'ใช่, รับงาน',
                confirmColor: 'bg-purple-500 hover:bg-purple-600',
                icon: CheckCircle,
            },
            fixing: {
                title: 'ยืนยันการเริ่มดำเนินการ?',
                message: 'คุณต้องการเริ่มดำเนินการซ่อมงานนี้ใช่หรือไม่?',
                confirmText: 'ใช่, เริ่มเลย',
                confirmColor: 'bg-blue-500 hover:bg-blue-600',
                icon: Play,
            },
            request_canceling: {
                title: 'ยืนยันการขอยกเลิกงาน?',
                message: 'คุณต้องการส่งคำขอยกเลิกงานนี้ไปยังแอดมินใช่หรือไม่? งานจะถูกยกเลิกเมื่อแอดมินอนุมัติ',
                confirmText: 'ใช่, ขอยกเลิก',
                confirmColor: 'bg-orange-500 hover:bg-orange-600',
                icon: XCircle,
            },
            successful: {
                title: 'ยืนยันการซ่อมสำเร็จ?',
                message: 'คุณได้ทำการซ่อมงานนี้เสร็จสิ้นเรียบร้อยแล้วใช่หรือไม่?',
                confirmText: 'ซ่อมสำเร็จ',
                confirmColor: 'bg-green-500 hover:bg-green-600',
                icon: ThumbsUp,
            },
            failed: {
                title: 'ยืนยันการซ่อมไม่สำเร็จ?',
                message: 'คุณต้องการบันทึกว่างานนี้ซ่อมไม่สำเร็จใช่หรือไม่?',
                confirmText: 'ใช่, ซ่อมไม่สำเร็จ',
                confirmColor: 'bg-red-500 hover:bg-red-600',
                icon: ThumbsDown,
            }
        };

        const details = confirmationDetails[newStatus];
        if (details) {
            setConfirmation({ ...details, taskId, newStatus });
        }
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

    const filteredTasks = tasks.filter(task => {
        if (filterStatus === 'all') return true;
        return task.status === filterStatus;
    });

    const getStatusCount = (status) => {
        if (status === 'all') return tasks.length;
        return tasks.filter(task => task.status === status).length;
    };

    const statusFilters = [
        { value: 'all', label: 'ทั้งหมด', color: 'bg-gray-500 hover:bg-gray-600' },
        { value: 'accepted', label: 'รับงานแล้ว', color: 'bg-blue-500 hover:bg-blue-600' },
        { value: 'fixing', label: 'กำลังซ่อม', color: 'bg-indigo-500 hover:bg-indigo-600' },
        { value: 'successful', label: 'ซ่อมสำเร็จ', color: 'bg-green-500 hover:bg-green-600' },
        { value: 'request_canceling', label: 'คำขอยกเลิก', color: 'bg-orange-500 hover:bg-orange-600' },
        { value: 'cancelled', label: 'ถูกยกเลิก', color: 'bg-red-500 hover:bg-red-600' },
        { value: 'failed', label: 'ซ่อมไม่สำเร็จ', color: 'bg-red-600 hover:bg-red-700' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <Navtech />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        รายการงานของฉัน
                    </h1>
                    <p className="text-lg text-gray-600">
                        ภาพรวมงานทั้งหมดที่คุณได้รับมอบหมาย
                    </p>
                </div>

                {!loading && !error && (
                    <div className="mb-8 animate-fade-in">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {statusFilters.map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => setFilterStatus(filter.value)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${filterStatus === filter.value
                                        ? filter.color + ' ring-4 ring-offset-2 ring-purple-300'
                                        : filter.color + ' opacity-70'
                                        }`}
                                >
                                    {filter.label}
                                    <span className="ml-2 bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-sm">
                                        {getStatusCount(filter.value)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader className="w-12 h-12 text-purple-600 animate-spin" />
                        <p className="ml-4 text-2xl text-gray-700">กำลังโหลดข้อมูลงาน...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md max-w-2xl mx-auto animate-slide-up">
                        <div className="flex">
                            <div className="py-1">
                                <AlertTriangle className="h-6 w-6 text-red-500 mr-4" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">เกิดข้อผิดพลาด!</p>
                                <p className="text-md">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    filteredTasks.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTasks.map((task, index) => (
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
                            <h2 className="text-2xl font-semibold text-gray-700">
                                {filterStatus === 'all'
                                    ? 'ยังไม่มีงานที่ได้รับมอบหมาย'
                                    : `ไม่พบงานที่มีสถานะ "${statusFilters.find(f => f.value === filterStatus)?.label}"`
                                }
                            </h2>
                            <p className="text-gray-500 mt-2">
                                {filterStatus === 'all'
                                    ? 'เมื่องานใหม่เข้ามา ระบบจะแสดงผลที่หน้านี้'
                                    : 'ลองเลือกฟิลเตอร์อื่นเพื่อดูงานในสถานะต่างๆ'
                                }
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
                @keyframes fade-in { 
                    from { opacity: 0; } 
                    to { opacity: 1; } 
                }
                @keyframes fade-in-fast { 
                    from { opacity: 0; } 
                    to { opacity: 1; } 
                }
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