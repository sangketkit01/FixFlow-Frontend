import React, { useState, useEffect } from "react";
import axios from "axios";
import { Wrench, Upload, X, ImageIcon, CheckCircle2 } from "lucide-react";
import MainNav from "../../../components/user/MainNav";
import baseUrl from "../../../constants/ServerConstant";
import { useAuth } from "../../context/AuthContext";

const Rprepair = () => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        task_type_id: "",
        brand: "",
        model: "",
        issue: "",
        description: "",
        address: "",
        district: "",
        province: "",
        preferredDate: "",
        preferredTime: "",
    });

    const [images, setImages] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        axios
            .get(`${baseUrl}/task-type/get`)
            .then((res) => setTaskTypes(res.data))
            .catch((err) => console.error("โหลดประเภทเครื่องไม่สำเร็จ:", err));
    }, []);

    const commonIssues = [
        "ไม่ติด/เปิดไม่ได้",
        "ทำงานผิดปกติ",
        "มีเสียงดัง",
        "รั่วซึม",
        "ไม่เย็น/ไม่ร้อน",
        "มีกลิ่นแปลกๆ",
        "อื่นๆ",
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages].slice(0, 5));
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const data = new FormData();
            data.append("task_type_id", formData.task_type_id);
            data.append(
                "title",
                `${formData.brand || ""} ${formData.model || ""} (${formData.issue || ""})`
            );
            data.append("detail", formData.description);
            data.append("address", formData.address);
            data.append("district", formData.district);
            data.append("province", formData.province);

            images.forEach((img) => data.append("task_image", img.file));

            await axios.post(`${baseUrl}/task/create`, data, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setModalMessage("ส่งคำขอแจ้งซ่อมสำเร็จแล้ว!");
            setShowModal(true);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "❌ ส่งคำขอไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MainNav />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-20 mt-20">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                            <Wrench className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">แจ้งซ่อมเครื่องใช้ไฟฟ้า</h1>
                        <p className="text-blue-100 text-lg">
                            กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็วในการให้บริการ
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Device Info */}
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <Wrench className="w-5 h-5 text-blue-600" />
                                </div>
                                ข้อมูลเครื่องใช้ไฟฟ้า
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        ประเภทเครื่องใช้ไฟฟ้า <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="task_type_id"
                                        value={formData.task_type_id}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="">เลือกประเภทเครื่อง</option>
                                        {taskTypes.map((type) => (
                                            <option key={type._id} value={type._id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        ยี่ห้อ
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        placeholder="เช่น Samsung, LG, Panasonic"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        รุ่น
                                    </label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        placeholder="เช่น AR12345"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        อาการเสีย <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="issue"
                                        value={formData.issue}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="">เลือกอาการเสีย</option>
                                        {commonIssues.map((issue, index) => (
                                            <option key={index} value={issue}>
                                                {issue}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        รายละเอียดเพิ่มเติม
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="อธิบายอาการเสียหรือปัญหาที่พบโดยละเอียด..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Upload Images */}
                        <div className="p-8 bg-gray-50 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <ImageIcon className="w-5 h-5 text-blue-600 mr-2" />
                                แนบรูปภาพ (ถ้ามี)
                            </h2>

                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600 font-medium">คลิกเพื่ออัพโหลดรูปภาพ</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (สูงสุด 5 รูป)</p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Address */}
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">ที่อยู่สำหรับซ่อม</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">ที่อยู่</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">อำเภอ/เขต</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">จังหวัด</label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="p-8 bg-gray-50">
                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60"
                                >
                                    {loading ? "กำลังส่ง..." : "ส่งคำขอแจ้งซ่อม"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 text-center animate-fade-in">
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce-in" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">สำเร็จ!</h2>
                        <p className="text-gray-600 mb-6">{modalMessage}</p>
                        <button
                            onClick={() => {
                                setShowModal(false);
                                window.location.reload();
                            }}
                            className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Rprepair;
