import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
    User, MapPin, Calendar, ClipboardList,
    Wrench, CheckCircle, XCircle, Clock,
    Loader, AlertTriangle, ArrowLeft, Image as ImageIcon,
    Check
} from 'lucide-react';

import baseUrl from '../../../constants/ServerConstant';
import Navtech from '../../../components/technician/Navtech';

// Component สำหรับแสดง Icon สถานะ
const ExclamationCircle = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

// Helper function สำหรับข้อมูลสถานะ
const getStatusInfo = (status) => {
    switch (status) {
        case 'pending':
            return { icon: <ExclamationCircle className="w-5 h-5" />, color: 'bg-yellow-200 text-yellow-900', text: 'รอดำเนินการ' };
        case 'accepted':
            return { icon: <Wrench className="w-5 h-5" />, color: 'bg-blue-200 text-blue-900', text: 'รับงานเรียบร้อย' };
        case 'fixing':
            return { icon: <Wrench className="w-5 h-5 animate-spin" />, color: 'bg-indigo-200 text-indigo-900', text: 'กำลังซ่อม' };
        case 'successful':
            return { icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-200 text-green-900', text: 'ซ่อมสำเร็จ' };
        case 'request_canceling':
            return { icon: <ExclamationCircle className="w-5 h-5" />, color: 'bg-orange-200 text-orange-900', text: 'คำขอยกเลิก' };
        case 'cancelled':
            return { icon: <XCircle className="w-5 h-5" />, color: 'bg-red-200 text-red-900', text: 'ถูกยกเลิก' };
        case 'failed':
            return { icon: <XCircle className="w-5 h-5" />, color: 'bg-red-300 text-red-900', text: 'ซ่อมไม่สำเร็จ' };
        default:
            return { icon: <Clock className="w-5 h-5" />, color: 'bg-gray-200 text-gray-900', text: 'ไม่ระบุ' };
    }
};

const TaskDetailsPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false);


    useEffect(() => {
        const fetchTaskDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const taskPromise = axios.get(`${baseUrl}/technician/tasks/${taskId}`, { withCredentials: true });
                const imagesPromise = axios.get(`${baseUrl}/technician/tasks/${taskId}/images`, { withCredentials: true });

                const [taskResponse, imagesResponse] = await Promise.all([taskPromise, imagesPromise]);

                setTask(taskResponse.data.task);
                setImages(imagesResponse.data.images);

            } catch (err) {
                console.error("Failed to fetch task details:", err);
                const message = err.response?.data?.message || "ไม่สามารถโหลดข้อมูลงานได้";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        if (taskId) {
            fetchTaskDetails();
        }
    }, [taskId]);

    const handleAcceptTask = async () => {
        setIsAccepting(true);
        try {
            const response = await axios.put(
                `${baseUrl}/technician/tasks/${taskId}/accept`,
                {},
                { withCredentials: true }
            );

            setTask(response.data.task);

        } catch (err) {
            console.error("Failed to accept task:", err);
            alert(`เกิดข้อผิดพลาดในการรับงาน: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsAccepting(false);
        }
    };

    const formatCreationDate = (dateString) => {
        if (!dateString) return 'ไม่มีข้อมูล';
        const date = new Date(dateString);
        return date.toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="flex items-center text-gray-600">
                    <Loader className="w-10 h-10 animate-spin text-purple-600" />
                    <span className="ml-4 text-xl font-semibold">กำลังโหลดรายละเอียดงาน...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md max-w-lg w-full">
                    <div className="flex">
                        <div className="py-1"><AlertTriangle className="h-6 w-6 text-red-500 mr-4" /></div>
                        <div>
                            <p className="font-bold text-lg">เกิดข้อผิดพลาด</p>
                            <p className="text-md">{error}</p>
                            <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                กลับไปหน้าก่อนหน้า
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <p>ไม่พบข้อมูลงาน</p>
            </div>
        );
    }
    
    const statusInfo = getStatusInfo(task.status);
    const fullAddress = `${task.address}, อ.${task.district}, จ.${task.province}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <Navtech />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 animate-fade-in">
                {/* Header and Back Button */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        รายละเอียดงาน 
                    </h1>
                    
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Task Details */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-slide-up">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
                            <div className={`flex items-center space-x-2 px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}>
                                {statusInfo.icon}
                                <span>{statusInfo.text}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                                <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
                                อาการ/รายละเอียดที่แจ้ง
                            </h3>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border">{task.detail || "ไม่มีรายละเอียดเพิ่มเติม"}</p>
                        </div>

                        {/* Customer & Location Info */}
                        <div className="space-y-4 text-gray-800">
                            <div className="flex items-start">
                                <User className="w-5 h-5 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                                <div>
                                    <strong className="block">ลูกค้า:</strong>
                                    <span>{task.username}</span>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                                <div>
                                    <strong className="block">ที่อยู่:</strong>
                                    <span>{fullAddress}</span>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Calendar className="w-5 h-5 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                                <div>
                                    <strong className="block">วันที่แจ้ง:</strong>
                                    <span>{formatCreationDate(task.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Accept Task Button */}
                        {task.status === 'pending' && task.technician_id === null && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleAcceptTask}
                                    disabled={isAccepting}
                                    className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isAccepting ? (
                                        <>
                                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                                            กำลังดำเนินการ...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5 mr-2" />
                                            รับงานนี้
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Images */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
                            รูปภาพประกอบ
                        </h3>
                        {images.length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {images.map(image => (
                                    <div key={image._id} className="relative group">
                                        <img
                                            src={`${baseUrl}${image.image_path}`}
                                            alt={`ภาพประกอบงาน ${task.title}`}
                                            className="w-full h-auto object-cover rounded-lg shadow-md"
                                        />
                                        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-br-lg rounded-tl-lg">
                                            เพิ่มโดย: {image.added_by}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-gray-50 rounded-lg p-6">
                                <ImageIcon className="w-12 h-12 mb-2 text-gray-400" />
                                <p>ไม่มีรูปภาพประกอบสำหรับงานนี้</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.8s ease-out backwards; }
            `}</style>
        </div>
    );
};

export default TaskDetailsPage;