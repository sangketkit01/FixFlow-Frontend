import React from 'react';
import { AlertCircle } from 'lucide-react';

const DeleteModal = ({ 
    showDeleteModal, 
    techToDelete, 
    onDeleteCancel, 
    onDeleteConfirm 
}) => {
    if (!showDeleteModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
                <div className="flex justify-center mb-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันการลบช่าง</h3>
                <p className="text-gray-600 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบช่าง <br /> {techToDelete?.full_name}</p>
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={onDeleteCancel}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onDeleteConfirm}
                        className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center space-x-1"
                    >
                        <span>ยืนยันการลบ</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;