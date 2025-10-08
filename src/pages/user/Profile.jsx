import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import baseUrl from "../../../constants/ServerConstant";
import MainNav from "../../../components/user/MainNav";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../../components/AlertModal";

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
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const [modal, setModal] = useState({
        show: false,
        type: "success",
        title: "",
        message: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                gender: user.gender || "other",
            });
            setPreview(
                user.profile_path
                    ? `${baseUrl}/${user.profile_path}`
                    : `${baseUrl}/images/user_profile.png`
            );
        }
    }, [user]);

    const handleFileClick = () => fileInputRef.current.click();

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
            setModal({
                show: true,
                type: "success",
                title: "อัปเดตโปรไฟล์สำเร็จ",
                message: "ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว 🎉",
            });
        } catch (err) {
            console.error(err);
            setModal({
                show: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: err.response?.data?.message || "ไม่สามารถอัปเดตโปรไฟล์ได้",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setModal({
                show: true,
                type: "error",
                title: "รหัสผ่านไม่ตรงกัน",
                message: "กรุณากรอกรหัสผ่านใหม่ให้ตรงกัน",
            });
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
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setModal({
                show: true,
                type: "success",
                title: "เปลี่ยนรหัสผ่านสำเร็จ",
                message: "รหัสผ่านของคุณถูกอัปเดตเรียบร้อยแล้ว 🔐",
            });
        } catch (err) {
            setModal({
                show: true,
                type: "error",
                title: "เกิดข้อผิดพลาด",
                message: err.response?.data?.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MainNav />
            <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200 py-10 px-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-10 mt-16">
                    <div className="relative group cursor-pointer" onClick={handleFileClick}>
                        <img
                            src={preview}
                            alt="Profile"
                            className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <span className="text-white text-sm font-semibold">เปลี่ยนรูป</span>
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
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">ข้อมูลส่วนตัว</h3>

                    <form
                        onSubmit={handleProfileUpdate}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
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
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">เปลี่ยนรหัสผ่าน</h3>

                    <form
                        onSubmit={handlePasswordUpdate}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
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

                {/* ✅ Modal */}
                <AlertModal
                    show={modal.show}
                    type={modal.type}
                    title={modal.title}
                    message={modal.message}
                    onClose={() => setModal({ show: false, type: "success", title: "", message: "" })}
                />
            </div>
        </>
    );
}
