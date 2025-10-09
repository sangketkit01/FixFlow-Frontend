import React from 'react';
import { X, UserCheck, UserX, Clock, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

const StatusModal = ({ 
    showStatusModal, 
    setShowStatusModal, 
    statusTech, 
    onStatusChange 
}) => {
    if (!showStatusModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">จัดการสถานะช่าง</h3>
                    <button 
                        onClick={() => setShowStatusModal(false)}
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">{statusTech?.full_name}</h4>
                            <p className="text-sm text-gray-500">{statusTech?.specialty}</p>
                        </div>
                    </div>
                    <div className="text-center mb-4">
                        <p className="text-gray-600">สถานะปัจจุบัน:</p>
                        <div className="mt-2">
                            <StatusBadge status={statusTech?.status} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">เปลี่ยนสถานะเป็น:</p>
                    
                    <button
                        onClick={() => onStatusChange('approved')}
                        className="w-full flex items-center justify-between p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <UserCheck className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-green-700">อนุมัติ</p>
                                <p className="text-xs text-green-600">อนุญาตการสมัครเป็นช่าง</p>
                            </div>
                        </div>
                        <UserCheck className="w-5 h-5 text-green-600" />
                    </button>

                    <button
                        onClick={() => onStatusChange('rejected')}
                        className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <UserX className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-red-700">ปฏิเสธ</p>
                                <p className="text-xs text-red-600">ไม่อณุญาตการสมัครเป็นช่าง</p>
                            </div>
                        </div>
                        <UserX className="w-5 h-5 text-red-600" />
                    </button>

                    {/* <button
                        onClick={() => onStatusChange('pending')}
                        className="w-full flex items-center justify-between p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Clock className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-yellow-700">รอดำเนินการ</p>
                                <p className="text-xs text-yellow-600">รอการตรวจสอบและอนุมัติ</p>
                            </div>
                        </div>
                        <Clock className="w-5 h-5 text-yellow-600" />
                    </button> */}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => setShowStatusModal(false)}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;