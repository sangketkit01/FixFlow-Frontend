import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../../../components/admin/Header';
import StatsCards from '../../../components/admin/StatsCards';
import TechniciansTable from '../../../components/admin/TechniciansTable';
import EditModal from '../../../components/admin/EditModal';
import StatusModal from '../../../components/admin/StatusModal';
import DeleteModal from '../../../components/admin/DeleteModal';
import FeedbackModal from '../../../components/admin/FeedbackModal';
import LoadingState from '../../../components/admin/LoadingState';
import ErrorDisplay from '../../../components/admin/ErrorDisplay';
import Dashboard from '../../../components/admin/Dashboard';

const AdminManage = () => {
    const navigate = useNavigate();
    
    // State Management
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    // Data States
    const [selectedTech, setSelectedTech] = useState(null);
    const [techToDelete, setTechToDelete] = useState(null);
    const [statusTech, setStatusTech] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const API_BASE_URL = 'http://localhost:8080';

    // ฟังก์ชันดึงข้อมูลช่างทั้งหมด (ทั้ง technicians และ registrations)
    const fetchAllTechnicians = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/admin/technicians-all`, {
                withCredentials: true 
            });
            setTechnicians(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching all technicians:", err);
            
            if (err.code === 'ERR_NETWORK') {
                setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
            } else if (err.response?.status === 401) {
                setError("กรุณาล็อกอินใหม่");
                setTimeout(() => navigate('/admin/login'), 2000);
            } else {
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTechnicians();
    }, []);

    // ฟังก์ชันจัดการการแก้ไขข้อมูลช่าง
    const handleEdit = (tech) => {
        if (tech.type === 'registration') {
            setFeedbackMessage('ไม่สามารถแก้ไขข้อมูลการสมัครที่รอดำเนินการได้');
            setIsSuccess(false);
            setShowFeedbackModal(true);
            return;
        }

        setSelectedTech(tech);
        setEditForm({
            id: tech._id, 
            full_name: tech.full_name,
            specialty: tech.specialty,
            phone: tech.phone,
            email: tech.email,
            age: tech.age,
            id_card: tech.id_card,
            address: tech.address,
            district: tech.district,
            province: tech.province,
            birth_date: tech.birth_date,
            working_area_district: tech.working_area_district,
            working_area_province: tech.working_area_province,
        });
        setShowEditModal(true);
    };

    // ฟังก์ชันบันทึกข้อมูลที่แก้ไข
    const handleSave = async () => {
        try {
            const techId = editForm.id;
            await axios.put(`${API_BASE_URL}/admin/technicians/${techId}`, editForm, {
                withCredentials: true
            });
            
            // อัพเดทข้อมูลใน state
            setTechnicians(technicians.map(tech => 
                tech._id === techId ? { ...tech, ...editForm } : tech
            ));
            setShowEditModal(false);
            setSelectedTech(null);
            
            setFeedbackMessage('บันทึกข้อมูลสำเร็จ');
            setIsSuccess(true);
            setShowFeedbackModal(true);
        } catch (err) {
            console.error("Error saving technician:", err);
            setFeedbackMessage("บันทึกข้อมูลไม่สำเร็จ");
            setIsSuccess(false);
            setShowFeedbackModal(true);
        }
    };

    // ฟังก์ชันจัดการสถานะช่าง
    const handleStatusClick = (tech) => {
        setStatusTech(tech);
        setShowStatusModal(true);
    };

    // ฟังก์ชันเปลี่ยนสถานะช่าง
    const handleStatusChange = async (newStatus) => {
        if (!statusTech) return;
        
        try {
            if (statusTech.type === 'registration') {
                // กรณีเป็น registration
                if (newStatus === 'approved') {
                    // อนุมัติและย้ายข้อมูล
                    await axios.post(
                        `${API_BASE_URL}/admin/registrations/${statusTech._id}/approve`, 
                        {}, 
                        { withCredentials: true }
                    );
                } else {
                    // เปลี่ยนสถานะอื่นๆ (rejected, pending)
                    await axios.put(
                        `${API_BASE_URL}/admin/registrations/status/${statusTech._id}`, 
                        { status: newStatus }, 
                        { withCredentials: true }
                    );
                }
            } else {
                // กรณีเป็น technician
                await axios.put(
                    `${API_BASE_URL}/admin/technicians/status/${statusTech._id}`, 
                    { status: newStatus }, 
                    { withCredentials: true }
                );
            }

            // อัพเดทสถานะใน state
            setTechnicians(prevTechs => prevTechs.map(tech => 
                tech._id === statusTech._id ? { ...tech, status: newStatus } : tech
            ));

            // แสดงข้อความแจ้งเตือน
            setFeedbackMessage(
                newStatus === 'approved' 
                    ? `อนุมัติช่าง ${statusTech.full_name} สำเร็จ` 
                    : newStatus === 'rejected'
                    ? `ปฏิเสธช่าง ${statusTech.full_name} สำเร็จ`
                    : `เปลี่ยนสถานะช่าง ${statusTech.full_name} เป็นรอดำเนินการสำเร็จ`
            );
            setIsSuccess(true);

            if (newStatus === 'approved' && statusTech.type === 'registration') {
                setTimeout(() => {
                    fetchAllTechnicians();
                }, 1000);
            }
        } catch (err) {
            console.error(`Error changing status:`, err);
            setFeedbackMessage(`เปลี่ยนสถานะไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
            setIsSuccess(false);
        } finally {
            setShowStatusModal(false);
            setShowFeedbackModal(true);
            setStatusTech(null);
        }
    };

    // ฟังก์ชันลบช่าง
    const handleDeleteAttempt = (tech) => {
        setTechToDelete(tech);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (techToDelete) {
            const techId = techToDelete._id;
            const techType = techToDelete.type;
            
            try {
                if (techType === 'technician') {
                    await axios.delete(`${API_BASE_URL}/admin/technicians/${techId}`, {
                        withCredentials: true
                    });
                } else {
                    await axios.delete(`${API_BASE_URL}/admin/registrations/${techId}`, {
                        withCredentials: true
                    });
                }

                setTechnicians(technicians.filter(tech => tech._id !== techId));
                setTechToDelete(null);
                setShowDeleteModal(false);

                setFeedbackMessage('ลบข้อมูลสำเร็จ');
                setIsSuccess(true);
                setShowFeedbackModal(true);
            } catch (err) {
                console.error("Error deleting:", err);
                setFeedbackMessage("ลบข้อมูลไม่สำเร็จ");
                setIsSuccess(false);
                setShowDeleteModal(false);
                setShowFeedbackModal(true);
            }
        }
    };

    const handleDeleteCancel = () => {
        setTechToDelete(null);
        setShowDeleteModal(false);
    };

    // ฟังก์ชันดูโปรไฟล์ช่าง
    const handleViewProfile = (tech) => {
        if (tech.type === 'registration' && tech.status !== 'approved') {
            setFeedbackMessage('⚠️ ยังไม่สามารถดูโปรไฟล์การสมัครที่รอดำเนินการได้');
            setIsSuccess(false);
            setShowFeedbackModal(true);
            return;
        }
        
        navigate(`/admin/technicians/${tech._id}`);
    };

    // ฟังก์ชันเพิ่มช่างใหม่
    const handleAddTechnician = () => {
        navigate('/admin/add-technician');
    };

    // ฟังก์ชันปิด Modal แจ้งเตือน
    const handleCloseFeedbackModal = () => {
        setShowFeedbackModal(false);
        setFeedbackMessage('');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                .font-inter { font-family: 'Inter', sans-serif; }
            `}</style>
            
            <Header />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ErrorDisplay error={error} />
                <Dashboard />

                {loading && <LoadingState />}

                <TechniciansTable 
                    technicians={technicians}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onViewProfile={handleViewProfile}
                    onEdit={handleEdit}
                    onDelete={handleDeleteAttempt}
                    onStatusClick={handleStatusClick}
                    onAddTechnician={handleAddTechnician}
                    loading={loading}
                />
            </main>

            <EditModal 
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                selectedTech={selectedTech}
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={handleSave}
            />

            <StatusModal 
                showStatusModal={showStatusModal}
                setShowStatusModal={setShowStatusModal}
                statusTech={statusTech}
                onStatusChange={handleStatusChange}
            />

            <DeleteModal 
                showDeleteModal={showDeleteModal}
                techToDelete={techToDelete}
                onDeleteCancel={handleDeleteCancel}
                onDeleteConfirm={handleDeleteConfirm}
            />

            <FeedbackModal 
                showFeedbackModal={showFeedbackModal}
                feedbackMessage={feedbackMessage}
                isSuccess={isSuccess}
                onClose={handleCloseFeedbackModal}
            />
        </div>
    );
};

export default AdminManage;