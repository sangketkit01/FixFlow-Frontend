import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../../constants/ServerConstant";

export default function TechnicianRegister() {
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
    const [idCardImage, setIdCardImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false); // 👈 เปลี่ยนจาก string เป็น boolean
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setIdCardImage(file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });
            if (idCardImage) {
                data.append("technician_registration_id_card_image", idCardImage);
            }

            const res = await axios.post(baseUrl + "/technician/register", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Register success:", res.data);
            setSuccess(true); // ✅ โชว์ modal
        } catch (err) {
            console.error(err);
            if (err.response?.data?.errors) {
                setError(err.response.data.errors.map((e) => e.msg).join(", "));
            } else {
                setError("สมัครไม่สำเร็จ ลองใหม่อีกครั้ง");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 via-white to-purple-200 px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 mt-[30px]">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                    สมัครเป็น <span className="text-purple-600">Technician</span>
                </h1>

                {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fullname */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">เบอร์โทร</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">อายุ</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* ID card */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">เลขบัตรประชาชน</label>
                        <input
                            type="text"
                            name="id_card"
                            value={formData.id_card}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Birth date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">วันเกิด</label>
                        <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* District */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">อำเภอ/เขต</label>
                        <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Province */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">จังหวัด</label>
                        <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Upload ID card image */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">อัปโหลดรูปบัตรประชาชน</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 w-full" />
                        {previewImage && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <img src={previewImage} alt="ID Card Preview" className="w-64 rounded-lg border shadow" />
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md hover:shadow-lg transition disabled:opacity-50"
                        >
                            {loading ? "กำลังสมัคร..." : "สมัครเป็น Technician"}
                        </button>
                    </div>
                </form>
            </div>

            {/* ✅ Success Modal */}
            {success && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className="text-lg font-bold text-green-600 mb-4">สมัครสำเร็จ!</h2>
                        <p className="text-gray-700 mb-6">คุณได้สมัครเป็น Technician เรียบร้อยแล้ว</p>
                        <button
                            onClick={() => navigate("/technician/home")}
                            className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                        >
                            ไปหน้า Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
