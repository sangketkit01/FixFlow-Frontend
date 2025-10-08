import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, X } from 'lucide-react';

const AdminTechEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const API_BASE_URL = 'http://localhost:8080/admin';

    useEffect(() => {
        if (location.state?.technician) {
            setForm(location.state.technician);
            setLoading(false);
        } else {
            fetchTechnician();
        }
    }, [id, location.state]);

    const fetchTechnician = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/technicians/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setForm(response.data);
        } catch (err) {
            console.error('Error fetching technician:', err);
            alert('ไม่สามารถโหลดข้อมูลช่างได้');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`${API_BASE_URL}/technicians/${id}`, form, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            alert('บันทึกข้อมูลสำเร็จ');
            navigate(`/admin/technicians/${id}`);
        } catch (err) {
            console.error('Error updating technician:', err);
            alert('บันทึกข้อมูลไม่สำเร็จ');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`/admin/technicians/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(`/admin/technicians/${id}`)}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        กลับไปที่รายละเอียดช่าง
                    </button>
                    
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">แก้ไขข้อมูลช่าง</h1>
                            <p className="text-gray-600 mt-2">แก้ไขข้อมูลช่าง {form.full_name}</p>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                                ข้อมูลส่วนตัว
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ชื่อ-นามสกุล
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={form.full_name || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                อีเมล
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                เบอร์โทรศัพท์
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                อายุ
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={form.age || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                บัตรประชาชน
                            </label>
                            <input
                                type="text"
                                name="id_card"
                                value={form.id_card || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                วันเกิด
                            </label>
                            <input
                                type="date"
                                name="birth_date"
                                value={form.birth_date ? new Date(form.birth_date).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Address Information */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                                ข้อมูลที่อยู่
                            </h3>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ที่อยู่
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={form.address || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                อำเภอ/เขต
                            </label>
                            <input
                                type="text"
                                name="district"
                                value={form.district || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                จังหวัด
                            </label>
                            <input
                                type="text"
                                name="province"
                                value={form.province || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                พื้นที่ทำงาน (อำเภอ)
                            </label>
                            <input
                                type="text"
                                name="working_area_district"
                                value={form.working_area_district || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                พื้นที่ทำงาน (จังหวัด)
                            </label>
                            <input
                                type="text"
                                name="working_area_province"
                                value={form.working_area_province || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 mr-2" />
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminTechEdit;