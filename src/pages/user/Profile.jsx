import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import baseUrl from "../../../constants/ServerConstant";
import MainNav from "../../../components/user/MainNav";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "other",
    });
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");


    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                gender: user.gender || "other",
            });

            if (user.profile_path) {
                setPreview(`${baseUrl}/${user.profile_path}`);
            } else {
                setPreview(`${baseUrl}/images/user_profile.png`);
            }
        }
    }, [user]);

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            if (profileImage) data.append("user_profile_image", profileImage);

            const res = await axios.put(`${baseUrl}/user/profile`, data, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUser(res.data.user);
            setMessage("อัปเดตโปรไฟล์สำเร็จแล้ว");
            setShowModal(true)
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดต");
        } finally {
            setLoading(false);
            setTimeout(() => navigate(0), 1000);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("รหัสผ่านใหม่ไม่ตรงกัน");
            setLoading(false);
            return;
        }

        try {
            await axios.put(
                `${baseUrl}/user/change-password`,
                {
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                },
                { withCredentials: true }
            );
            setMessage("เปลี่ยนรหัสผ่านสำเร็จแล้ว");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setShowModal(true)
        } catch (err) {
            setError(err.response?.data?.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
        } finally {
            setLoading(false);
            setTimeout(() => navigate(0), 1000);
        }
    };

    return (
        <>
            <MainNav />
            <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200 py-10 px-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-10 mt-16">
                    <div
                        className="relative group cursor-pointer"
                        onClick={handleFileClick}
                    >
                        <img
                            src={preview}
                            alt="Profile"
                            className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <span className="text-white text-sm font-semibold">
                                เปลี่ยนรูป
                            </span>
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <h2 className="mt-4 text-xl font-bold text-gray-800">{user?.username}</h2>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>

                {/* Profile Info Section */}
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 mb-10">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                        ข้อมูลส่วนตัว
                    </h3>

                    {message && <div className="text-green-600 mb-3">{message}</div>}
                    {error && <div className="text-red-600 mb-3">{error}</div>}

                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ชื่อจริง</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-purple-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-purple-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-purple-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">เพศ</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-purple-200"
                            >
                                <option value="male">ชาย</option>
                                <option value="female">หญิง</option>
                                <option value="other">อื่น ๆ</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md hover:shadow-lg transition disabled:opacity-50"
                            >
                                {loading ? "กำลังบันทึก..." : "อัปเดตข้อมูล"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Section */}
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                        เปลี่ยนรหัสผ่าน
                    </h3>

                    <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">รหัสผ่านปัจจุบัน</label>
                            <input
                                type="password"
                                value={passwordData.oldPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                                }
                                className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-purple-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">รหัสผ่านใหม่</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                                }
                                className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-purple-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ยืนยันรหัสผ่านใหม่</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                }
                                className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-purple-200"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md hover:shadow-lg transition disabled:opacity-50"
                            >
                                {loading ? "กำลังอัปเดต..." : "อัปเดตรหัสผ่าน"}
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
                            <p className="text-gray-600 mb-6">{modalMessage || "ดำเนินการเสร็จสิ้นเรียบร้อยแล้ว"}</p>

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


            </div>
        </>
    );
}
