import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    User, MapPin, Calendar, ClipboardList,
    Wrench, CheckCircle, XCircle, Clock,
    Loader, AlertTriangle, Image as ImageIcon,
    Check
} from 'lucide-react';
import baseUrl from '../../../constants/ServerConstant';
import Navtech from '../../../components/technician/Navtech';
import { Modal } from 'bootstrap';



// Icon สถานะ
const ExclamationCircle = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
        />
    </svg>
);


const SuccessModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 m-4 max-w-md w-full transform animate-modal-pop-in">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-green-100">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">สำเร็จ!</h2>
                </div>

                <p className="text-gray-600 mb-8 ml-16">{message}</p>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-white font-semibold rounded-lg bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
};

const ErrorModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 m-4 max-w-md w-full transform animate-modal-pop-in">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-red-100">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">เกิดข้อผิดพลาด</h2>
                </div>

                <p className="text-gray-600 mb-8 ml-16">{message}</p>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-white font-semibold rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
};


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

    // 🔹 State สำหรับจัดการอัปโหลดรูปภาพ
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImageDescription, setNewImageDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);


    // 🔹 ฟังก์ชันอัปโหลดรูปภาพ
    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!newImageFile) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", newImageFile);
            formData.append("description", newImageDescription);
            formData.append("task_id", task._id);

            const res = await fetch(`${baseUrl}/api/upload-image`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("อัปโหลดไม่สำเร็จ");

            const newImg = await res.json();
            setImages((prev) => [newImg, ...prev]); // เพิ่มรูปใหม่ไปบนสุด
            setNewImageFile(null);
            setNewImageDescription("");
            setShowUploadForm(false);
        } catch (error) {
            console.error(error);
            Modal("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
        } finally {
            setIsUploading(false);
        }
    };

    // 🔹 ดึงข้อมูลงาน
    useEffect(() => {
        const fetchTaskDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const [taskResponse, imagesResponse] = await Promise.all([
                    axios.get(`${baseUrl}/technician/tasks/${taskId}`, { withCredentials: true }),
                    axios.get(`${baseUrl}/technician/tasks/${taskId}/images`, { withCredentials: true })
                ]);
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
        if (taskId) fetchTaskDetails();
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
            Modal(`เกิดข้อผิดพลาดในการรับงาน: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsAccepting(false);
        }
    };

    const formatCreationDate = (dateString) => {
        if (!dateString) return 'ไม่มีข้อมูล';
        const date = new Date(dateString);
        return date.toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' });
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center text-gray-600">
            <Loader className="w-10 h-10 animate-spin text-purple-600" />
            <span className="ml-4 text-xl font-semibold">กำลังโหลดรายละเอียดงาน...</span>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex justify-center items-center p-4">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md max-w-lg w-full">
                <div className="flex">
                    <AlertTriangle className="h-6 w-6 text-red-500 mr-4" />
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

    if (!task) return (
        <div className="min-h-screen flex justify-center items-center">
            <p>ไม่พบข้อมูลงาน</p>
        </div>
    );

    const statusInfo = getStatusInfo(task.status);
    const fullAddress = `${task.address}, อ.${task.district}, จ.${task.province}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <Navtech />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        รายละเอียดงาน
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* รายละเอียดงาน */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-slide-up">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
                            <div className={`flex items-center space-x-2 px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}>
                                {statusInfo.icon}
                                <span>{statusInfo.text}</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                                <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
                                อาการ/รายละเอียดที่แจ้ง
                            </h3>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border">
                                {task.detail || "ไม่มีรายละเอียดเพิ่มเติม"}
                            </p>
                        </div>

                        <div className="space-y-4 text-gray-800">
                            <div className="flex items-start">
                                <User className="w-5 h-5 mr-3 mt-1 text-blue-500" />
                                <div><strong>ลูกค้า:</strong> {task.username}</div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 mr-3 mt-1 text-blue-500" />
                                <div><strong>ที่อยู่:</strong> {fullAddress}</div>
                            </div>
                            <div className="flex items-start">
                                <Calendar className="w-5 h-5 mr-3 mt-1 text-blue-500" />
                                <div><strong>วันที่แจ้ง:</strong> {formatCreationDate(task.createdAt)}</div>
                            </div>
                        </div>

                        {task.status === 'pending' && task.technician_id === null && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleAcceptTask}
                                    disabled={isAccepting}
                                    className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-400"
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

                    {/* 🔹 ส่วนรูปภาพ */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-between">
                            <span className="flex items-center">
                                <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
                                รูปภาพประกอบ
                            </span>
                            <button
                                onClick={() => setShowUploadForm(!showUploadForm)}
                                className="flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition"
                            >
                                + เพิ่มรูปภาพ
                            </button>
                        </h3>

                        {/* ฟอร์มอัปโหลด */}
                        {showUploadForm && (
                            <form onSubmit={handleImageUpload} className="mb-6 border border-gray-200 p-4 rounded-xl bg-gray-50">
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">เลือกรูปภาพ:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setNewImageFile(file);

                                            // สร้าง preview
                                            if (file) {
                                                setPreviewImage(URL.createObjectURL(file));
                                            } else {
                                                setPreviewImage(null);
                                            }
                                        }}
                                        required
                                        className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>

                                {/* พรีวิวรูป */}
                                {previewImage && (
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-700 mb-1">พรีวิวรูปภาพ:</p>
                                        <img
                                            src={previewImage}
                                            alt="พรีวิวรูป"
                                            className="w-full h-[600px] object-contain rounded-lg border"
                                        />
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดรูปภาพ:</label>
                                    <textarea
                                        value={newImageDescription}
                                        onChange={(e) => setNewImageDescription(e.target.value)}
                                        placeholder="ใส่คำบรรยายรูปภาพ..."
                                        rows={3}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition disabled:bg-gray-400"
                                    >
                                        {isUploading ? "กำลังอัปโหลด..." : "อัปโหลด"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* แสดงรูปทั้งหมด */}
                        {images.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[30rem] overflow-y-auto pr-2">
                                {images.map((image) => (
                                    <div
                                        key={image._id}
                                        className="bg-white border rounded-2xl shadow-md overflow-hidden flex flex-col"
                                    >
                                        {/* รูปภาพ */}
                                        <div className="w-full h-56 overflow-hidden">
                                            <img
                                                src={`${baseUrl}${image.image_path}`}
                                                alt={`ภาพประกอบงาน ${task.title}`}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>

                                        {/* รายละเอียดใต้รูป */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <p className="text-sm text-gray-700 mb-2">
                                                {image.description?.trim() || "ยังไม่มีคำบรรยายรายละเอียด"}
                                            </p>
                                            <div className="mt-auto text-xs text-gray-500 bg-gray-50 border rounded-md p-1 text-right">
                                                เพิ่มโดย: {image.added_by}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 bg-gray-50 rounded-lg p-6">
                                <ImageIcon className="w-12 h-12 mb-2 text-gray-400" />
                                <p>ไม่มีรูปภาพประกอบสำหรับงานนี้</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <SuccessModal message={successMessage} onClose={() => setSuccessMessage(null)} />
            <ErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />
        </div>

    );
};

export default TaskDetailsPage;