import React from 'react';
import { X, CheckCircle } from 'lucide-react';

const EditModal = ({ 
    showEditModal, 
    setShowEditModal, 
    selectedTech, 
    editForm, 
    setEditForm, 
    onSave 
}) => {
    if (!showEditModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-gray-800">แก้ไขข้อมูลช่าง: {selectedTech?.full_name}</h3>
                    <button 
                        onClick={() => setShowEditModal(false)} 
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                            <input
                                type="text"
                                value={editForm.full_name || ''}
                                onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ความเชี่ยวชาญ</label>
                            <select
                                value={editForm.specialty || ''}
                                onChange={(e) => setEditForm({...editForm, specialty: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ช่างไฟฟ้า">ช่างไฟฟ้า</option>
                                <option value="ช่างประปา">ช่างประปา</option>
                                <option value="ช่างแอร์">ช่างแอร์</option>
                                <option value="ช่างทั่วไป">ช่างทั่วไป</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                            <input
                                type="text"
                                value={editForm.phone || ''}
                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">อำเภอ</label>
                            <input
                                type="text"
                                value={editForm.district || ''}
                                onChange={(e) => setEditForm({...editForm, district: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">จังหวัด</label>
                            <input
                                type="text"
                                value={editForm.province || ''}
                                onChange={(e) => setEditForm({...editForm, province: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">อำเภอพื้นที่ทำงาน</label>
                            <input
                                type="text"
                                value={editForm.working_area_district || ''}
                                onChange={(e) => setEditForm({...editForm, working_area_district: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">จังหวัดพื้นที่ทำงาน</label>
                            <input
                                type="text"
                                value={editForm.working_area_province || ''}
                                onChange={(e) => setEditForm({...editForm, working_area_province: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                            <input
                                type="email"
                                value={editForm.email || ''}
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={onSave}
                            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>บันทึกข้อมูล</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;