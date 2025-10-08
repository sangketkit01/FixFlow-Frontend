import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Edit2, Phone, Mail, MapPin, Calendar, User, CreditCard, X, Trash2, CheckCircle } from 'lucide-react'; // เพิ่ม CheckCircle
import Header from '../../../components/admin/Header';

const TechnicianDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [technician, setTechnician] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // 1. เพิ่ม State สำหรับ Success Modal
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const API_BASE_URL = 'http://localhost:8080/admin';

    useEffect(() => {
        fetchTechnicianDetail();
    }, [id]);

    const fetchTechnicianDetail = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/technicians/${id}`, { withCredentials: true });
            setTechnician(response.data);
            setFormData({
                ...response.data,
                password: '',
            });
        } catch (err) {
            console.error('Error fetching technician details:', err);
            setError('ไม่สามารถโหลดข้อมูลช่างได้');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setFormData({
            ...technician,
            password: '',
        });
    };

    // New handler for closing success modal
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                age: Number(formData.age),
                birth_date: formData.birth_date ? new Date(formData.birth_date) : null
            };

            if (!payload.password) {
                payload.password = technician.password;
            }

            const requiredFields = [
                'full_name',
                'email',
                'phone',
                'age',
                'id_card',
                'id_card_image_path',
                'birth_date', 'address',
                'district',
                'province',
                'working_area_district',
                'working_area_province'
            ];
            for (let field of requiredFields) {
                if (!payload[field]) {
                    alert(`กรุณากรอกข้อมูล: ${field}`);
                    setSaving(false);
                    return;
                }
            }

            await axios.put(`${API_BASE_URL}/technicians/${id}`, payload, { withCredentials: true });

            // 2. ปรับปรุงส่วนแจ้งเตือน:
            setTechnician(payload);
            setFormData({ ...payload, password: '' });
            setShowEditModal(false);
            setShowSuccessModal(true); // แสดง Success Modal แทน alert
            // alert('บันทึกข้อมูลสำเร็จ'); // ลบ alert เดิมออก
        } catch (err) {
            console.error('Error updating technician:', err.response?.data || err);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`${API_BASE_URL}/technicians/${id}`, { withCredentials: true });
            alert('ลบข้อมูลสำเร็จ');
            navigate('/admin/home');
        } catch (err) {
            console.error('Error deleting technician:', err);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">

                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-6 text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">

                <div className="text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-lg text-gray-700 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/admin/home')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            กลับหน้าหลัก
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!technician) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">

                <div className="text-center">
                    <p className="text-lg text-gray-600">ไม่พบข้อมูลช่าง</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <Header />
            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-6xl">

                <div className="pt-16">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-violet-600 via-violet-500 to-violet-400 p-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-white mb-2">{technician.full_name}</h1>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                                    <p className="text-3xl font-bold text-blue-600 mb-1">{technician.total_tasks || 0}</p>
                                    <p className="text-sm font-medium text-gray-600">งานทั้งหมด</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                                    <p className="text-3xl font-bold text-green-600 mb-1">{technician.successful_tasks || 0}</p>
                                    <p className="text-sm font-medium text-gray-600">งานสำเร็จ</p>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
                                    <p className="text-3xl font-bold text-yellow-600 mb-1">{technician.fixing_tasks || 0}</p>
                                    <p className="text-sm font-medium text-gray-600">กำลังดำเนินการ</p>
                                </div>
                            </div>

                            {/* Information Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Personal Information */}
                                <div className="bg-gray-50 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <div className="w-1 h-5 bg-blue-600 rounded-full mr-3"></div>
                                        ข้อมูลส่วนตัว
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem icon={<User className="w-5 h-5" />} label="ชื่อ-นามสกุล" value={technician.full_name} />
                                        <InfoItem icon={<Calendar className="w-5 h-5" />} label="อายุ" value={`${technician.age} ปี`} />
                                        <InfoItem icon={<Calendar className="w-5 h-5" />} label="วันเกิด" value={new Date(technician.birth_date).toLocaleDateString('th-TH')} />
                                        <InfoItem icon={<CreditCard className="w-5 h-5" />} label="บัตรประชาชน" value={technician.id_card} />
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gray-50 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <div className="w-1 h-5 bg-blue-600 rounded-full mr-3"></div>
                                        ข้อมูลติดต่อ
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem icon={<Phone className="w-5 h-5" />} label="เบอร์โทรศัพท์" value={technician.phone} />
                                        <InfoItem icon={<Mail className="w-5 h-5" />} label="อีเมล" value={technician.email} />
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="lg:col-span-2 bg-gray-50 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <div className="w-1 h-5 bg-blue-600 rounded-full mr-3"></div>
                                        ข้อมูลที่อยู่
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <InfoItem icon={<MapPin className="w-5 h-5" />} label="ที่อยู่" value={technician.address} />
                                        <InfoItem icon={<MapPin className="w-5 h-5" />} label="อำเภอ/เขต" value={technician.district} />
                                        <InfoItem icon={<MapPin className="w-5 h-5" />} label="จังหวัด" value={technician.province} />
                                        {technician.working_area_district && (
                                            <InfoItem icon={<MapPin className="w-5 h-5" />} label="พื้นที่ทำงาน (อำเภอ)" value={technician.working_area_district} />
                                        )}
                                        {technician.working_area_province && (
                                            <InfoItem icon={<MapPin className="w-5 h-5" />} label="พื้นที่ทำงาน (จังหวัด)" value={technician.working_area_province} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <Edit2 className="w-5 h-5 mr-2" />
                                    แก้ไขข้อมูล
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <Trash2 className="w-5 h-5 mr-2" />
                                    ลบข้อมูล
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">แก้ไขข้อมูลช่าง</h2>
                            <button
                                onClick={handleCloseModal}
                                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                            <div className="space-y-5">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                                        <div className="w-1 h-4 bg-blue-600 rounded-full mr-2"></div>
                                        ข้อมูลส่วนตัว
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">อายุ</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">วันเกิด</label>
                                            <input
                                                type="date"
                                                name="birth_date"
                                                value={formData.birth_date?.split('T')[0] || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">บัตรประชาชน</label>
                                            <input
                                                type="text"
                                                name="id_card"
                                                value={formData.id_card || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                                        <div className="w-1 h-4 bg-blue-600 rounded-full mr-2"></div>
                                        ข้อมูลติดต่อ
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                                        <div className="w-1 h-4 bg-blue-600 rounded-full mr-2"></div>
                                        ข้อมูลที่อยู่
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">อำเภอ/เขต</label>
                                            <input
                                                type="text"
                                                name="district"
                                                value={formData.district || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
                                            <input
                                                type="text"
                                                name="province"
                                                value={formData.province || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">พื้นที่ทำงาน (อำเภอ)</label>
                                            <input
                                                type="text"
                                                name="working_area_district"
                                                value={formData.working_area_district || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">พื้นที่ทำงาน (จังหวัด)</label>
                                            <input
                                                type="text"
                                                name="working_area_province"
                                                value={formData.working_area_province || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>


                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสบัตรประชาชน (รูปภาพ)</label>
                                            <input
                                                type="text"
                                                name="id_card_image_path"
                                                value={formData.id_card_image_path || ''}
                                                onChange={handleInputChange}
                                                placeholder="เว้นว่างหากไม่เปลี่ยนรูป"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors duration-200 text-sm font-medium"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการลบข้อมูล</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                คุณต้องการลบข้อมูลช่าง <span className="font-semibold">{technician.full_name}</span> ใช่หรือไม่?<br />
                            </p>
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors duration-200 text-sm font-medium"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleting ? 'กำลังลบ...' : 'ลบข้อมูล'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Success Alert Modal (ใหม่) */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4 animate-bounce">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">บันทึกข้อมูลสำเร็จ! ✅</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                ข้อมูลช่างได้รับการอัปเดตเรียบร้อยแล้ว
                            </p>
                            <button
                                onClick={handleCloseSuccessModal}
                                className="w-full px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                            >
                                ตกลง
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
        <div className="text-blue-600 mt-0.5">{icon}</div>
        <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 mb-0.5">{label}</p>
            <p className="text-gray-900 font-medium text-sm">{value || '-'}</p>
        </div>
    </div>
);

export default TechnicianDetail;