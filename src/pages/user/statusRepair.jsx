import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, Package, Phone, MapPin, Calendar } from 'lucide-react';
import MainNav from "../../../components/user/MainNav";

const StatusRepair = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // ข้อมูลตัวอย่างรายการซ่อม
    const repairItems = [
        {
            id: 'RP001',
            deviceType: 'เครื่องปรับอากาศ',
            brand: 'Samsung',
            model: 'AR12345',
            issue: 'ไม่เย็น',
            status: 'pending',
            date: '2024-01-15',
            time: 'เช้า (09:00 - 12:00)',
            address: '123 ถนนสุขุมวิท กรุงเทพฯ',
            phone: '081-234-5678',
            estimatedDate: '2024-01-20'
        },
        {
            id: 'RP002',
            deviceType: 'ตู้เย็น',
            brand: 'LG',
            model: 'LG-7890',
            issue: 'มีเสียงดัง',
            status: 'in-progress',
            date: '2024-01-14',
            time: 'บ่าย (13:00 - 16:00)',
            address: '456 ถนนพระราม 4 กรุงเทพฯ',
            phone: '082-345-6789',
            technician: 'ช่าง สมชาย',
            technicianPhone: '089-111-2222'
        },
        {
            id: 'RP003',
            deviceType: 'เครื่องซักผ้า',
            brand: 'Panasonic',
            model: 'PAN-5555',
            issue: 'ไม่ติด',
            status: 'completed',
            date: '2024-01-10',
            time: 'เย็น (16:00 - 18:00)',
            address: '789 ถนนรัชดาภิเษก กรุงเทพฯ',
            phone: '083-456-7890',
            completedDate: '2024-01-12',
            cost: '1,500'
        },
        {
            id: 'RP004',
            deviceType: 'ทีวี',
            brand: 'Sony',
            model: 'SONY-4K',
            issue: 'ทำงานผิดปกติ',
            status: 'cancelled',
            date: '2024-01-13',
            time: 'เช้า (09:00 - 12:00)',
            address: '321 ถนนเพชรบุรี กรุงเทพฯ',
            phone: '084-567-8901',
            cancelReason: 'ลูกค้ายกเลิก'
        }
    ];

    const statusConfig = {
        pending: {
            label: 'รอดำเนินการ',
            color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            icon: Clock,
            iconColor: 'text-yellow-600'
        },
        'in-progress': {
            label: 'กำลังดำเนินการ',
            color: 'bg-blue-100 text-blue-800 border-blue-300',
            icon: AlertCircle,
            iconColor: 'text-blue-600'
        },
        completed: {
            label: 'เสร็จสิ้น',
            color: 'bg-green-100 text-green-800 border-green-300',
            icon: CheckCircle,
            iconColor: 'text-green-600'
        },
        cancelled: {
            label: 'ยกเลิก',
            color: 'bg-red-100 text-red-800 border-red-300',
            icon: XCircle,
            iconColor: 'text-red-600'
        }
    };

    const filteredItems = repairItems.filter(item => {
        const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.deviceType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <MainNav />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-20 mt-20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                            <Package className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">สถานะการซ่อม</h1>
                        <p className="text-purple-100 text-lg">ตรวจสอบความคืบหน้าการซ่อมของคุณ</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
                    {/* Search and Filter */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาด้วยรหัส หรือชื่ออุปกรณ์..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                                >
                                    <option value="all">ทั้งหมด</option>
                                    <option value="pending">รอดำเนินการ</option>
                                    <option value="in-progress">กำลังดำเนินการ</option>
                                    <option value="completed">เสร็จสิ้น</option>
                                    <option value="cancelled">ยกเลิก</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Repair Items List */}
                    <div className="space-y-4">
                        {filteredItems.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบรายการซ่อม</h3>
                                <p className="text-gray-500">ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง</p>
                            </div>
                        ) : (
                            filteredItems.map((item) => {
                                const StatusIcon = statusConfig[item.status].icon;
                                return (
                                    <div key={item.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                                        {/* Card Header */}
                                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-purple-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-2xl font-bold text-gray-800">#{item.id}</h3>
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusConfig[item.status].color}`}>
                                                            <StatusIcon className={`w-4 h-4 mr-1 ${statusConfig[item.status].iconColor}`} />
                                                            {statusConfig[item.status].label}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 font-medium">{item.deviceType} - {item.brand} {item.model}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">วันที่แจ้ง</p>
                                                    <p className="text-lg font-semibold text-gray-800">{item.date}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Left Column */}
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <AlertCircle className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600 font-medium">อาการเสีย</p>
                                                            <p className="text-gray-800 font-semibold">{item.issue}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Clock className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600 font-medium">ช่วงเวลานัดหมาย</p>
                                                            <p className="text-gray-800 font-semibold">{item.time}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <MapPin className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600 font-medium">สถานที่</p>
                                                            <p className="text-gray-800 font-semibold">{item.address}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Column */}
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Phone className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600 font-medium">เบอร์ติดต่อ</p>
                                                            <p className="text-gray-800 font-semibold">{item.phone}</p>
                                                        </div>
                                                    </div>

                                                    {/* Status Specific Info */}
                                                    {item.status === 'pending' && item.estimatedDate && (
                                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Calendar className="w-5 h-5 text-yellow-600" />
                                                                <p className="text-sm font-semibold text-yellow-800">วันที่คาดว่าจะเริ่มซ่อม</p>
                                                            </div>
                                                            <p className="text-yellow-900 font-bold">{item.estimatedDate}</p>
                                                        </div>
                                                    )}

                                                    {item.status === 'in-progress' && item.technician && (
                                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                            <p className="text-sm font-semibold text-blue-800 mb-2">ช่างผู้รับผิดชอบ</p>
                                                            <p className="text-blue-900 font-bold">{item.technician}</p>
                                                            <p className="text-sm text-blue-700 mt-1">โทร: {item.technicianPhone}</p>
                                                        </div>
                                                    )}

                                                    {item.status === 'completed' && (
                                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                            <p className="text-sm font-semibold text-green-800 mb-2">ซ่อมเสร็จเมื่อ</p>
                                                            <p className="text-green-900 font-bold">{item.completedDate}</p>
                                                            <p className="text-sm text-green-700 mt-2">ค่าบริการ: ฿{item.cost}</p>
                                                        </div>
                                                    )}

                                                    {item.status === 'cancelled' && item.cancelReason && (
                                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                            <p className="text-sm font-semibold text-red-800 mb-1">เหตุผลที่ยกเลิก</p>
                                                            <p className="text-red-900">{item.cancelReason}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        {item.status !== 'cancelled' && item.status !== 'completed' && (
                                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                                                <div className="flex flex-wrap gap-3">
                                                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200">
                                                        ดูรายละเอียด
                                                    </button>
                                                    {item.status === 'pending' && (
                                                        <button className="px-6 py-2 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200">
                                                            ยกเลิก
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StatusRepair;