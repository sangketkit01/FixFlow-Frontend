import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    User,
    MapPin,
    Calendar,
    ClipboardList,
    Wrench,
    CheckCircle,
    XCircle,
    Clock,
    Loader,
    AlertTriangle,
    Image as ImageIcon,
    Check,
} from "lucide-react";
import baseUrl from "../../../constants/ServerConstant";
import Navtech from "../../../components/technician/Navtech";

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
        case "pending":
            return {
                icon: <ExclamationCircle className="w-5 h-5" />,
                color: "bg-yellow-200 text-yellow-900",
                text: "รอดำเนินการ",
            };
        case "accepted":
            return {
                icon: <Wrench className="w-5 h-5" />,
                color: "bg-blue-200 text-blue-900",
                text: "รับงานเรียบร้อย",
            };
        case "fixing":
            return {
                icon: <Wrench className="w-5 h-5 animate-spin" />,
                color: "bg-indigo-200 text-indigo-900",
                text: "กำลังซ่อม",
            };
        case "payment":
            return {
                icon: <Clock className="w-5 h-5" />,
                color: "bg-purple-200 text-purple-900",
                text: "รอการชำระเงิน",
            };
        case "successful":
            return {
                icon: <CheckCircle className="w-5 h-5" />,
                color: "bg-green-200 text-green-900",
                text: "ซ่อมสำเร็จ",
            };
        case "cancelled":
            return {
                icon: <XCircle className="w-5 h-5" />,
                color: "bg-red-200 text-red-900",
                text: "ถูกยกเลิก",
            };
        default:
            return {
                icon: <Clock className="w-5 h-5" />,
                color: "bg-gray-200 text-gray-900",
                text: "ไม่ระบุ",
            };
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
    const [isCompleting, setIsCompleting] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);

    // 🔹 State สำหรับจัดการอัปโหลดรูปภาพ
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImageDescription, setNewImageDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [payment, setPayment] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [isLoadingPayment, setIsLoadingPayment] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);


    const [modal, setModal] = useState({ show: false, type: "", title: "", message: "" });


    useEffect(() => {
        const fetchPaymentInfo = async () => {
            try {
                const res = await axios.get(`${baseUrl}/technician/tasks/${taskId}/payment-info`, {
                    withCredentials: true,
                });
                setPayment(res.data.payment);
                setPaymentDetails(res.data.details);
            } catch (err) {
                if (err.response?.status !== 404) {
                    console.error("โหลดข้อมูลค่าใช้จ่ายไม่สำเร็จ:", err);
                }
            } finally {
                setIsLoadingPayment(false);
            }
        };
        if (taskId) fetchPaymentInfo();
    }, [taskId]);


    // 🔹 ดึงข้อมูลงาน
    const fetchTaskDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const [taskResponse, imagesResponse] = await Promise.all([
                axios.get(`${baseUrl}/technician/tasks/${taskId}`, {
                    withCredentials: true,
                }),
                axios.get(`${baseUrl}/technician/tasks/${taskId}/images`, {
                    withCredentials: true,
                }),
            ]);
            setTask(taskResponse.data.task);
            setImages(imagesResponse.data.images);
        } catch (err) {
            console.error("Failed to fetch task details:", err);
            const message =
                err.response?.data?.message || "ไม่สามารถโหลดข้อมูลงานได้";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (taskId) fetchTaskDetails();
    }, [taskId]);

    // ✅ ปุ่ม "รับงาน"
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

    // ✅ ปุ่ม "เสร็จสิ้นการซ่อม" → เปลี่ยนเป็น payment
    const handleCompleteRepair = async () => {
        setIsCompleting(true);
        try {
            const res = await axios.put(
                `${baseUrl}/technician/tasks/${task._id}/status`,
                { status: "payment" },
                { withCredentials: true }
            );

            setTask(res.data.task);
            setShowCompleteModal(true); // ✅ modal success เดิมใช้ได้เลย
        } catch (err) {
            console.error("Error updating task status:", err);

            setModal({
                show: true,
                type: "error",
                title: "อัปเดตสถานะไม่สำเร็จ",
                message:
                    err.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะงาน",
            });
        } finally {
            setIsCompleting(false);
        }
    };


    // ✅ อัปโหลดรูปภาพ
    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!newImageFile) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("task_image", newImageFile);
            formData.append("description", newImageDescription);
            formData.append("task_id", task._id);

            const res = await axios.post(
                `${baseUrl}/technician/tasks/${task._id}/upload-image`,
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const newImg = res.data.image;
            setImages((prev) => [newImg, ...prev]);
            setNewImageFile(null);
            setNewImageDescription("");
            setShowUploadForm(false);
            setPreviewImage(null);
        } catch (error) {
            console.error("Upload image error:", error);
            alert(
                error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ"
            );
        } finally {
            setIsUploading(false);
        }
    };

    const formatCreationDate = (dateString) => {
        if (!dateString) return "ไม่มีข้อมูล";
        const date = new Date(dateString);
        return date.toLocaleString("th-TH", {
            dateStyle: "long",
            timeStyle: "short",
        });
    };

    const handleCancelRepair = async () => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกงานนี้?")) return;
        try {
            await axios.put(
                `${baseUrl}/technician/tasks/${task._id}/request-cancel`,
                {},
                { withCredentials: true }
            );
            alert("ส่งคำขอยกเลิกงานสำเร็จ");
            await fetchTaskDetails(); // โหลดข้อมูลใหม่
        } catch (err) {
            console.error("Cancel repair failed:", err);
            alert(err.response?.data?.message || "ไม่สามารถยกเลิกงานได้");
        }
    };

    const [isConfirming, setIsConfirming] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleConfirmPayment = async () => {
        setShowPaymentModal(true);
    };



    if (loading)
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-600">
                <Loader className="w-10 h-10 animate-spin text-purple-600" />
                <span className="ml-4 text-xl font-semibold">
                    กำลังโหลดรายละเอียดงาน...
                </span>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex justify-center items-center p-4">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md max-w-lg w-full">
                    <div className="flex">
                        <AlertTriangle className="h-6 w-6 text-red-500 mr-4" />
                        <div>
                            <p className="font-bold text-lg">เกิดข้อผิดพลาด</p>
                            <p className="text-md">{error}</p>
                            <button
                                onClick={() => navigate(-1)}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                กลับไปหน้าก่อนหน้า
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

    if (!task)
        return (
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

                {/* ============================ รายละเอียดงาน ============================ */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-slide-up">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
                        <div
                            className={`flex items-center space-x-2 px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}
                        >
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
                            <div>
                                <strong>ลูกค้า:</strong> {task.username}
                            </div>
                        </div>
                        <div className="flex items-start">
                            <MapPin className="w-5 h-5 mr-3 mt-1 text-blue-500" />
                            <div>
                                <strong>ที่อยู่:</strong> {fullAddress}
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Calendar className="w-5 h-5 mr-3 mt-1 text-blue-500" />
                            <div>
                                <strong>วันที่แจ้ง:</strong> {formatCreationDate(task.createdAt)}
                            </div>
                        </div>
                    </div>

                    {task.status === "pending" && task.technician_id === null && (
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

                {/* ============================ รูปภาพประกอบ ============================ */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-8 animate-slide-up">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-between">
                        <span className="flex items-center">
                            <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
                            รูปภาพประกอบ
                        </span>
                        <button
                            onClick={() => setShowUploadForm(!showUploadForm)}
                            disabled={task.status === "successful" || task.status === "payment"}
                            className={`flex items-center px-3 py-1.5 text-white text-sm font-semibold rounded-lg shadow-md transition ${task.status === "successful" || task.status === "payment"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            + เพิ่มรูปภาพ
                        </button>
                    </h3>

                    {/* Form อัปโหลดรูป */}
                    {showUploadForm && (
                        <form
                            onSubmit={handleImageUpload}
                            className="mb-6 border border-gray-200 p-4 rounded-xl bg-gray-50"
                        >
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    เลือกรูปภาพ:
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setNewImageFile(file);
                                        setPreviewImage(file ? URL.createObjectURL(file) : null);
                                    }}
                                    required
                                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    รายละเอียดรูปภาพ:
                                </label>
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
                        <div className="flex flex-col gap-6 max-h-[40rem] overflow-y-auto pr-2">
                            {images.map((image) => (
                                <div
                                    key={image._id}
                                    className="flex flex-col md:flex-row bg-white border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                                >
                                    {/* ภาพทางซ้าย */}
                                    <div className="md:w-1/2 w-full h-72 md:h-56 overflow-hidden">
                                        <img
                                            src={baseUrl + "/images/tasks" + image.image_path}
                                            alt={`ภาพประกอบงาน ${task.title}`}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>

                                    {/* รายละเอียดทางขวา */}
                                    <div className="p-4 flex flex-col justify-between md:w-1/2">
                                        <div>
                                            <p className="text-gray-700 mb-3">
                                                {image.description?.trim() || "ยังไม่มีคำบรรยายรายละเอียด"}
                                            </p>
                                        </div>

                                        <div className="text-sm text-gray-500 bg-gray-50 border rounded-md p-2 text-right mt-2">
                                            เพิ่มโดย:{" "}
                                            {image.added_by === "technician" ? "ช่างผู้ซ่อม" : "ผู้แจ้งซ่อม"}
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

                {/* 💰 ส่วนค่าใช้จ่ายในการซ่อม */}
                <div
                    className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-slide-up mt-6"
                    style={{ animationDelay: "400ms" }}
                >
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <ClipboardList className="w-5 h-5 mr-2 text-green-500" />
                        ค่าใช้จ่ายในการซ่อม
                    </h3>

                    {isLoadingPayment ? (
                        <div className="flex items-center text-gray-500">
                            <Loader className="w-5 h-5 mr-2 animate-spin" /> กำลังโหลดข้อมูลค่าใช้จ่าย...
                        </div>
                    ) : !payment ? (
                        <p className="text-gray-500 text-center py-6">
                            ยังไม่มีข้อมูลค่าใช้จ่ายสำหรับงานนี้
                        </p>
                    ) : (
                        <>
                            {/* ตารางแสดงรายละเอียด */}
                            <table className="w-full text-gray-800 border-t border-gray-200 mb-6">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="text-left py-2 px-3">รายละเอียด</th>
                                        <th className="text-right py-2 px-3">ราคา (บาท)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentDetails.length > 0 ? (
                                        paymentDetails.map((d) => (
                                            <tr key={d._id} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-3">{d.detail}</td>
                                                <td className="text-right py-2 px-3">
                                                    {d.price.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center text-gray-500 py-4">
                                                ยังไม่มีรายละเอียดค่าใช้จ่าย
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="font-bold text-green-600 bg-green-50">
                                        <td className="py-2 px-3 text-right">รวมทั้งหมด</td>
                                        <td className="py-2 px-3 text-right">
                                            {payment.amount?.toLocaleString()} บาท
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* ถ้ามี slip */}
                            {payment.type === "transfer" && payment.slip_image_path && (
                                <div className="mt-4">
                                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                                        หลักฐานการโอนเงิน:
                                    </h4>
                                    <img
                                        src={baseUrl + payment.slip_image_path}
                                        alt="หลักฐานการโอนเงิน"
                                        className="w-full max-w-sm rounded-xl border shadow-md mx-auto"
                                    />
                                </div>
                            )}

                            {/* ปุ่มยืนยันการชำระเงิน */}
                            {task.status === "payment" && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={handleConfirmPayment}
                                        className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:scale-95"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        ยืนยันการชำระเงิน
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>


                {/* ✅ ปุ่มเสร็จสิ้นการซ่อม */}
                {task.status === "fixing" && (
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        {/* 🔧 ปุ่มเพิ่ม/แก้ไขค่าใช้จ่าย */}
                        <button
                            onClick={() => navigate(`/technician/tasks/${task._id}/payment-detail`)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                        >
                            <ClipboardList className="w-5 h-5" />
                            เพิ่ม / แก้ไขค่าใช้จ่าย
                        </button>

                        {/* ✅ ปุ่มเสร็จสิ้นการซ่อม */}
                        <button
                            onClick={handleCompleteRepair}
                            disabled={isCompleting}
                            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 ${isCompleting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                        >
                            {isCompleting ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    กำลังอัปเดต...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    เสร็จสิ้นการซ่อม
                                </>
                            )}
                        </button>

                        {/* ❌ ปุ่มยกเลิกการซ่อม */}
                        <button
                            onClick={handleCancelRepair}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                        >
                            <XCircle className="w-5 h-5" />
                            ยกเลิกการซ่อม
                        </button>
                    </div>
                )}


            </main>

            {/* 🎉 Modal แจ้งอัปเดตสถานะสำเร็จ */}
            {showCompleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in-up">
                        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            อัปเดตสำเร็จ!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            งานนี้ถูกเปลี่ยนสถานะเป็น{" "}
                            <strong className="text-green-600">“รอการชำระเงิน”</strong> แล้ว 🎉
                        </p>
                        <button
                            onClick={() => setShowCompleteModal(false)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}

            {/* 💬 Modal ยืนยันการชำระเงิน */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-[90%] max-w-md animate-fade-in-up">
                        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            ยืนยันการชำระเงิน?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            ตรวจสอบยอดชำระแล้วใช่หรือไม่? เมื่อยืนยันแล้วงานนี้จะถือว่า{" "}
                            <strong className="text-green-600">“ซ่อมสำเร็จ”</strong>
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={async () => {
                                    setIsConfirming(true);
                                    try {
                                        await axios.put(
                                            `${baseUrl}/technician/tasks/${task._id}/confirm-payment`,
                                            {},
                                            { withCredentials: true }
                                        );
                                        setShowPaymentModal(false);
                                        setTask({ ...task, status: "successful" });
                                    } catch (err) {
                                        console.error("confirm payment error:", err);
                                    } finally {
                                        setIsConfirming(false);
                                    }
                                }}
                                disabled={isConfirming}
                                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
                            >
                                {isConfirming ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" /> กำลังยืนยัน...
                                    </>
                                ) : (
                                    "ยืนยัน"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center w-[90%] max-w-md animate-fade-in-up">
                        {modal.type === "error" ? (
                            <XCircle className="w-14 h-14 text-red-500 mx-auto mb-3" />
                        ) : (
                            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                        )}
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{modal.title}</h2>
                        <p className="text-gray-600 mb-6">{modal.message}</p>
                        <button
                            onClick={() => setModal({ show: false })}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}

            <SuccessModal message={successMessage} onClose={() => setSuccessMessage(null)} />
            <ErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />
        </div>

    );
};

export default TaskDetailsPage;
