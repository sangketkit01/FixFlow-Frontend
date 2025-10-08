// TechniciansTable.jsx
import React from 'react';
import { Search, Plus, Edit, Trash2, UserCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

const TechniciansTable = ({ 
    technicians, 
    searchTerm, 
    onSearchChange, 
    onViewProfile, 
    onEdit, 
    onDelete, 
    onStatusClick,
    onAddTechnician,
    loading 
}) => {
    
    const filteredTechnicians = technicians.filter(tech =>
        tech.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.phone?.includes(searchTerm) ||
        tech.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSpecialtyBadge = (tech) => {
        const specialty = tech.specialty || "ช่างทั่วไป";
        
        const getBadgeColor = (spec) => {
            switch(spec.toLowerCase()) {
                case 'ช่างแอร์':
                    return 'bg-blue-100 text-blue-800 border-blue-200';
                case 'ช่างไฟ':
                    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                case 'ช่างประปา':
                    return 'bg-green-100 text-green-800 border-green-200';
                case 'ช่างอิเล็กทรอนิกส์':
                    return 'bg-purple-100 text-purple-800 border-purple-200';
                default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
            }
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getBadgeColor(specialty)}`}>
                {specialty}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRegistrationDate = (tech) => {
        return tech.createdAt || tech.created_at || '-';
    };

   const TaskStatsCompact = ({ tech }) => {
    if (tech.type !== 'technician') {
        return (
            <div className="text-center">
                <span className="text-gray-400 text-xs">-</span>
            </div>
        );
    }

    const totalTasks = tech.total_tasks || 0;
    const successfulTasks = tech.successful_tasks || 0;
    const fixingTasks = tech.fixing_tasks || 0;

    return (
        <div className="flex items-center justify-center space-x-4">
            {/* งานทั้งหมด */}
            <div className="text-center">
                <div className="text-sm font-bold text-blue-600">{totalTasks}</div>
                <div className="flex items-center justify-center space-x-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-[10px] text-gray-600">ทั้งหมด</span>
                </div>
            </div>

            {/* งานกำลังทำ */}
            <div className="text-center">
                <div className="text-sm font-bold text-yellow-600">{fixingTasks}</div>
                <div className="flex items-center justify-center space-x-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span className="text-[10px] text-gray-600">กำลังทำ</span>
                </div>
            </div>

            {/* งานสำเร็จ */}
            <div className="text-center">
                <div className="text-sm font-bold text-green-600">{successfulTasks}</div>
                <div className="flex items-center justify-center space-x-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-[10px] text-gray-600">สำเร็จ</span>
                </div>
            </div>
        </div>
    );
};

    

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">จัดการช่าง</h2>
                    <p className="text-gray-600 mt-1">
                        รายชื่อ
                        <span className="ml-2 text-sm text-gray-500">
                            (ทั้งหมด {filteredTechnicians.length} รายการ)
                        </span>
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาช่าง..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                        />
                    </div>
                    
                    <button
                        onClick={onAddTechnician}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>เพิ่มช่าง</span>
                    </button>
                </div>
            </div>

            {/* ตารางแสดงข้อมูล */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">ชื่อ-สกุล</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">สถานะ</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">เบอร์โทร</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">อีเมล</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">สถิติงาน</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTechnicians.map((tech) => (
                            <tr 
                                key={tech._id} 
                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                onClick={() => onViewProfile(tech)}
                            >
                                <td className="py-4 px-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{tech.full_name}</p>
                                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                                            <p className="flex items-center">
                                               
                                            </p>
                                            <p>
                                                เข้าร่วมเมื่อ: {formatDate(getRegistrationDate(tech))}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    {getSpecialtyBadge(tech)}
                                </td>
                                <td className="py-4 px-4">
                                    <StatusBadge status={tech.status} />
                                </td>
                                <td className="py-4 px-4 text-gray-600">{tech.phone}</td>
                                <td className="py-4 px-4 text-gray-600">{tech.email}</td>
                                <td className="py-4 px-4">
                                    <TaskStatsCompact tech={tech} />
                                </td>
                                <td className="py-4 px-4">
                                    
                                    <td className="py-4 px-4">
    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
        {tech.status !== 'approved' && (
            <button
                onClick={() => onStatusClick(tech)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="จัดการสถานะ"
            >
                <UserCheck className="w-4 h-4" />
            </button>
        )}

        {/* <button
            onClick={() => onEdit(tech)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="แก้ไขข้อมูล"
        >
            <Edit className="w-4 h-4" />
        </button> */}
        
        <button
            onClick={() => onDelete(tech)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="ลบข้อมูล"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    </div>
</td>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredTechnicians.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        ไม่พบข้อมูลช่าง
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechniciansTable;