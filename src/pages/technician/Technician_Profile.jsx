import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navtech from "../../../components/technician/Navtech";
import baseUrl from "../../../constants/ServerConstant";
import { useNavigate } from "react-router-dom";

export default function TechnicianProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        age: "",
        id_card: "",
        address: "",
        district: "",
        province: "",
        birth_date: "",
    });
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");


    useEffect(() => {
        const fetchTechnician = async () => {
            try {
                const res = await axios.get(`${baseUrl}/technician/profile`, { withCredentials: true });
                const tech = res.data.technician;
                setFormData({
                    full_name: tech.full_name || "",
                    email: tech.email || "",
                    phone: tech.phone || "",
                    age: tech.age || "",
                    id_card: tech.id_card || "",
                    address: tech.address || "",
                    district: tech.district || "",
                    province: tech.province || "",
                    birth_date: tech.birth_date ? tech.birth_date.split("T")[0] : "",
                });
                if (tech.profile_path) setPreview(`${baseUrl}${tech.profile_path.startsWith("/") ? "" : "/"}${tech.profile_path}`);
            } catch (err) {
                console.error(err);
                setError("ไม่สามารถโหลดข้อมูลช่างได้");
            }
        };
        fetchTechnician();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            if (profileImage) data.append("profile_image", profileImage);

            const res = await axios.put(`${baseUrl}/technician/profile`, data, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("อัปเดตข้อมูลสำเร็จ");
            setModalMessage("ข้อมูลของคุณได้รับการอัปเดตเรียบร้อยแล้ว");
            setShowModal(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "อัปเดตข้อมูลไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navtech />
            <br />
            <br />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10 px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">แก้ไขข้อมูลช่าง</h2>

                    {message && <div className="text-green-600 mb-3">{message}</div>}
                    {error && <div className="text-red-600 mb-3">{error}</div>}

                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ชื่อเต็ม</label>
                            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">อายุ</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">เลขบัตรประชาชน</label>
                            <input type="text" name="id_card" value={formData.id_card} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">วันเกิด</label>
                            <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ตำบล</label>
                            <input type="text" name="district" value={formData.district} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">จังหวัด</label>
                            <input type="text" name="province" value={formData.province} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200" />
                        </div>

                        {/* Upload Profile Image */}
                        <div className="md:col-span-2 flex flex-col items-center">
                            <div className="relative group cursor-pointer" onClick={handleFileClick}>
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Profile"
                                        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed rounded-full text-gray-400">
                                        อัปโหลดรูปโปรไฟล์
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <span className="text-white font-semibold">เปลี่ยนรูป</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>


                        <div className="md:col-span-2">
                            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md hover:shadow-lg transition disabled:opacity-50">
                                {loading ? "กำลังบันทึก..." : "อัปเดตข้อมูล"}
                            </button>
                        </div>
                    </form>
                </div>
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 text-center animate-fade-in">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                                    <svg
                                        className="w-10 h-10 text-green-500 animate-bounce-in"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-2">สำเร็จ!</h2>
                            <p className="text-gray-600 mb-6">{modalMessage}</p>

                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    navigate(0); // รีเฟรชหน้าเมื่อกดตกลง
                                }}
                                className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
                            >
                                ตกลง
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
