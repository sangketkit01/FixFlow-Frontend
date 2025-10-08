import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/admin/Header'; 

// Helper Component สำหรับ Input Field (คงเดิม)
const InputField = ({ name, placeholder, value, onChange, type = 'text', label, required = false }) => (
    <div className="flex flex-col">
        {label && <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>}
        <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`border ${required ? 'border-blue-300' : 'border-gray-300'} px-4 py-2 rounded-lg w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
        />
    </div>
);

// Helper Component สำหรับ Header แต่ละส่วน (คงเดิม)
const SectionHeader = ({ title, description }) => (
    <div className="mb-4 border-b border-gray-300 pb-2 flex justify-between items-end">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 italic">{description}</p>
    </div>
);


const AddTechnician = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: '',
        email: '',
        phone: '',
        age: '',
        id_card: '',
        id_card_image_path: '',
        profile_path: '',
        address: '',
        district: '',
        province: '',
        working_area_district: '',
        working_area_province: '',
        birth_date: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // ส่งข้อมูลไป backend /admin/technicians
            const res = await axios.post('http://localhost:8080/admin/technicians', form, {
                withCredentials: true 
                // headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } 
            });

            if (res.status === 201) {
                alert('เพิ่มช่างสำเร็จ');
                navigate('/admin/home'); 
            }
        } catch (err) {
            console.error('Error adding technician:', err);
            alert('เกิดข้อผิดพลาด: ' + (err.response?.data?.message || err.message));
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 1. Header Component */}
            <Header />

            <div className="flex justify-center items-start py-10 px-4">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-full max-w-6xl border border-gray-200 shadow-lg">
                    <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-2">
                        เพิ่มข้อมูลช่าง
                    </h2>
                    
                    <SectionHeader title="ข้อมูลพื้นฐาน" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        <InputField
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            type="text"
                            required={true}
                            label="ชื่อ-นามสกุล "
                        />
                        
                        <InputField
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            required={true}
                            label="อีเมล "
                        />
                        
                        <InputField
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            type="tel"
                            required={true}
                            label="เบอร์โทรศัพท์ "
                        />
                        <InputField
                            name="birth_date"
                            value={form.birth_date}
                            onChange={handleChange}
                            type="date"
                            label="วันเกิด"
                        />
                        <InputField
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            type="number"
                            label="อายุ "
                        />
                        {/* Placeholder field to keep layout even, can be replaced or removed */}
                        <div className="hidden md:block"></div> 
                    </div>

                    {/* --- ส่วนที่ 2: ข้อมูลที่อยู่และพื้นที่ทำงาน (ไม่บังคับ) --- */}
                    <SectionHeader title="ข้อมูลที่อยู่และพื้นที่ทำงาน" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        <InputField
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            type="text"
                            label=" ที่อยู่ "
                        />
                        <InputField
                            name="district"
                            value={form.district}
                            onChange={handleChange}
                            type="text"
                            label=" อำเภอ/เขต "
                        />
                        <InputField
                            name="province"
                            value={form.province}
                            onChange={handleChange}
                            type="text"
                            label=" จังหวัด "
                        />
                        <InputField
                            name="working_area_district"
                            value={form.working_area_district}
                            onChange={handleChange}
                            type="text"
                            label="อำเภอ/เขตพื้นที่ทำงาน"
                        />
                        <InputField
                            name="working_area_province"
                            value={form.working_area_province}
                            onChange={handleChange}
                            type="text"
                            label="จังหวัดพื้นที่ทำงาน"
                        />
                    </div>

                    <SectionHeader title="ข้อมูลเอกสาร" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        <InputField
                            name="id_card"
                            placeholder="รหัสบัตรประชาชน 13 หลัก"
                            value={form.id_card}
                            onChange={handleChange}
                            type="text"
                            label="บัตรประชาชน"
                        />
                        {/* id_card_image_path และ profile_path สำหรับการอัปโหลดไฟล์ สามารถเพิ่มในภายหลังได้ */}
                    </div>

                    {/* --- ปุ่ม Submit/Cancel --- */}
                    <div className="flex justify-end mt-8 space-x-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/home')} 
                            className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-150"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150"
                        >
                            เพิ่มช่าง
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTechnician;