import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    User,
    MapPin,
    Calendar,
    ClipboardList,
    Image as ImageIcon,
    Upload,
    Trash2,
    XCircle,
    CheckCircle,
    Loader,
} from "lucide-react";
import baseUrl from "../../../constants/ServerConstant";
import MainNav from "../../../components/user/MainNav";

const getStatusInfo = (status) => {
    switch (status) {
        case "payment":
            return { color: "bg-purple-200 text-purple-900", text: "รอการชำระเงิน" };
        case "fixing":
            return { color: "bg-indigo-200 text-indigo-900", text: "กำลังซ่อม" };
        case "accepted":
            return { color: "bg-blue-200 text-blue-900", text: "รอช่างเข้าซ่อม" };
        case "successful":
            return { color: "bg-green-200 text-green-900", text: "ซ่อมสำเร็จ" };
        case "cancelled":
            return { color: "bg-red-200 text-red-900", text: "ยกเลิกแล้ว" };
        default:
            return { color: "bg-gray-200 text-gray-800", text: "ไม่ระบุ" };
    }
};

export default function UserTaskDetail() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [images, setImages] = useState([]);
    const [payment, setPayment] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState([]);

    const [newImage, setNewImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [newSlip, setNewSlip] = useState(null);
    const [previewSlip, setPreviewSlip] = useState(null);
    const [uploadingSlip, setUploadingSlip] = useState(false);

    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ show: false, title: "", message: "" });
    const [canceling, setCanceling] = useState(false);

    const fetchTask = async () => {
        try {
            const res = await axios.get(`${baseUrl}/user/tasks/${taskId}`, {
                withCredentials: true,
            });
            setTask(res.data.task);
            setImages(res.data.images || []);
            setPayment(res.data.payment || null);
            setPaymentDetails(res.data.paymentDetails || []);
        } catch (err) {
            console.error("❌ โหลดข้อมูลงานไม่สำเร็จ:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    const statusInfo = getStatusInfo(task?.status);

    // ✅ Upload Task Image
    const handleUploadImage = async (e) => {
        e.preventDefault();
        if (!newImage) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("task_image", newImage);
            formData.append("description", "");
            formData.append("task_id", task._id);

            await axios.post(`${baseUrl}/user/tasks/${taskId}/upload-image`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setModal({
                show: true,
                title: "อัปโหลดรูปภาพสำเร็จ",
                message: "เพิ่มรูปภาพประกอบเรียบร้อยแล้ว",
            });
            setNewImage(null);
            setPreviewImage(null);
            fetchTask();
        } catch (err) {
            console.error("❌ Upload image error:", err);
            setModal({
                show: true,
                title: "เกิดข้อผิดพลาด",
                message: err.response?.data?.message || "ไม่สามารถอัปโหลดรูปภาพได้",
            });
        } finally {
            setUploading(false);
        }
    };

    // ✅ Upload Slip
    const handleUploadSlip = async (e) => {
        e.preventDefault();
        if (!newSlip) return;
        setUploadingSlip(true);
        try {
            const formData = new FormData();
            formData.append("slip_image", newSlip);
            await axios.post(`${baseUrl}/user/tasks/${taskId}/upload-slip`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            setModal({
                show: true,
                title: "ส่งสลิปสำเร็จ",
                message: "สลิปของคุณถูกส่งไปให้ช่างตรวจสอบแล้ว",
            });
            setNewSlip(null);
            setPreviewSlip(null);
            fetchTask();
        } catch (err) {
            console.error("❌ Upload slip error:", err);
            setModal({
                show: true,
                title: "เกิดข้อผิดพลาด",
                message: err.response?.data?.message || "อัปโหลดสลิปไม่สำเร็จ",
            });
        } finally {
            setUploadingSlip(false);
        }
    };

    // ✅ Delete Slip
    const handleDeleteSlip = async () => {
        try {
            await axios.delete(`${baseUrl}/user/tasks/${taskId}/delete-slip`, {
                withCredentials: true,
            });
            setModal({
                show: true,
                title: "ลบสลิปสำเร็จ",
                message: "สลิปของคุณถูกลบเรียบร้อยแล้ว",
            });
            fetchTask();
        } catch (err) {
            console.error("❌ Delete slip error:", err);
            setModal({
                show: true,
                title: "เกิดข้อผิดพลาด",
                message: "ไม่สามารถลบสลิปได้",
            });
        }
    };

    // ✅ Request Cancel
    const handleCancelTask = async () => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการขอยกเลิกงานนี้?")) return;
        setCanceling(true);
        try {
            await axios.put(`${baseUrl}/user/tasks/${taskId}/request-cancel`, {}, { withCredentials: true });
            setModal({
                show: true,
                title: "ส่งคำขอยกเลิกแล้ว",
                message: "ช่างจะตรวจสอบคำขอยกเลิกของคุณ",
            });
            fetchTask();
        } catch (err) {
            console.error("❌ Cancel error:", err);
            setModal({
                show: true,
                title: "เกิดข้อผิดพลาด",
                message: "ไม่สามารถส่งคำขอยกเลิกได้",
            });
        } finally {
            setCanceling(false);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                <Loader className="w-8 h-8 animate-spin text-purple-500 mr-2" /> กำลังโหลดข้อมูล...
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
            <MainNav />
            <main className="max-w-6xl mx-auto pt-24 pb-16 px-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
                        <span className={`px-3 py-1 rounded-full font-semibold text-sm ${statusInfo.color}`}>
                            {statusInfo.text}
                        </span>
                    </div>

                    <p className="text-gray-600 mb-4">{task.detail || "ไม่มีรายละเอียดเพิ่มเติม"}</p>
                    <div className="space-y-2 text-gray-700">
                        <div className="flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /> {task.username}</div>
                        <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-500" /> {task.address}, {task.district}, {task.province}</div>
                        <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" /> {new Date(task.createdAt).toLocaleString("th-TH")}</div>
                    </div>
                </div>

                {/* 🔹 Upload Image */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex justify-between items-center">
                        <span className="flex items-center"><ImageIcon className="w-5 h-5 mr-2 text-purple-500" /> รูปภาพประกอบ</span>
                    </h2>

                    <form onSubmit={handleUploadImage} className="border p-4 rounded-lg bg-gray-50 mb-6">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setNewImage(file);
                                setPreviewImage(file ? URL.createObjectURL(file) : null);
                            }}
                            className="w-full text-sm text-gray-600 mb-3 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                        {previewImage && (
                            <img src={previewImage} alt="preview" className="w-full h-72 object-contain rounded-lg border mb-3" />
                        )}
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold disabled:bg-gray-400"
                        >
                            {uploading ? "กำลังอัปโหลด..." : "เพิ่มรูปภาพ"}
                        </button>
                    </form>

                    {images.length > 0 ? (
                        <div className="flex flex-col gap-6">
                            {images.map((img) => (
                                <div key={img._id} className="flex flex-col md:flex-row bg-white border rounded-xl shadow-sm overflow-hidden">
                                    <div className="md:w-1/2 w-full h-64 overflow-hidden">
                                        <img src={baseUrl + "/images/tasks/" + img.image_path} alt="task" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 md:w-1/2 flex flex-col justify-between">
                                        <p className="text-gray-700">{img.description || "ไม่มีคำอธิบาย"}</p>
                                        <p className="text-sm text-gray-500 text-right bg-gray-50 mt-2 rounded-md p-1">
                                            เพิ่มโดย: {img.added_by === "technician" ? "ช่างผู้ซ่อม" : "ผู้แจ้งซ่อม"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">ไม่มีรูปภาพประกอบ</div>
                    )}
                </div>

                {/* 💰 Payment Info */}
                {payment && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <ClipboardList className="w-5 h-5 mr-2 text-green-500" /> ค่าใช้จ่ายในการซ่อม
                        </h3>
                        <table className="w-full text-gray-800 border-t border-gray-200 mb-4">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="text-left py-2 px-3">รายละเอียด</th>
                                    <th className="text-right py-2 px-3">ราคา (บาท)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentDetails.map((d) => (
                                    <tr key={d._id} className="border-b">
                                        <td className="py-2 px-3">{d.detail}</td>
                                        <td className="text-right py-2 px-3">{d.price.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="font-bold text-green-600 bg-green-50">
                                    <td className="py-2 px-3 text-right">รวมทั้งหมด</td>
                                    <td className="py-2 px-3 text-right">{payment.amount.toLocaleString()} บาท</td>
                                </tr>
                            </tbody>
                        </table>

                        {task.status === "payment" && (
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">แนบสลิปการโอนเงิน:</h4>
                                {payment.slip_image_path ? (
                                    <div className="relative mb-3">
                                        <img
                                            src={baseUrl + "/images/payment/" + payment.slip_image_path}
                                            alt="slip"
                                            className="w-full max-w-sm rounded-lg border shadow-md"
                                        />
                                        <button
                                            onClick={handleDeleteSlip}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleUploadSlip}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setNewSlip(file);
                                                setPreviewSlip(file ? URL.createObjectURL(file) : null);
                                            }}
                                            className="mb-3 text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                        />
                                        {previewSlip && (
                                            <img src={previewSlip} alt="preview slip" className="w-full max-w-sm rounded-lg border mb-3" />
                                        )}
                                        <button
                                            type="submit"
                                            disabled={uploadingSlip}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:bg-gray-400"
                                        >
                                            {uploadingSlip ? "กำลังอัปโหลด..." : "ส่งสลิป"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ❌ Cancel Task */}
                {(task.status === "accepted" || task.status === "fixing") && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={handleCancelTask}
                            disabled={canceling}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition disabled:bg-gray-400"
                        >
                            <XCircle className="w-5 h-5" />
                            {canceling ? "กำลังส่งคำขอ..." : "ขอยกเลิกงาน"}
                        </button>
                    </div>
                )}

                {/* Modal */}
                {modal.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
                            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{modal.title}</h2>
                            <p className="text-gray-600 mb-6">{modal.message}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
