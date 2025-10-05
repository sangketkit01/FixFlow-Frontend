import React, { useState } from 'react';
import { Search, Calendar, Download, Eye, FileText, CheckCircle, Clock, DollarSign, Wrench } from 'lucide-react';
import MainNav from "../../../components/user/MainNav";

const HistoryRepair = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');

    // ข้อมูลตัวอย่างประวัติการซ่อม
    const historyItems = [
        {
            id: 'RP001',
            deviceType: 'เครื่องปรับอากาศ',
            brand: 'Samsung',
            model: 'AR12345',
            issue: 'ไม่เย็น',
            reportDate: '2024-01-15',
            completedDate: '2024-01-18',
            duration: '3 วัน',
            technician: 'ช่าง สมชาย',
            cost: '2,500',
            rating: 5,
            status: 'completed',
            note: 'เปลี่ยนคอมเพรสเซอร์ใหม่'
        },
        {
            id: 'RP002',
            deviceType: 'ตู้เย็น',
            brand: 'LG',
            model: 'LG-7890',
            issue: 'มีเสียงดัง',
            reportDate: '2023-12-20',
            completedDate: '2023-12-22',
            duration: '2 วัน',
            technician: 'ช่าง วิชัย',
            cost: '1,800',
            rating: 4,
            status: 'completed',
            note: 'ทำความสะอาดและเปลี่ยนยางรอง'
        },
        {
            id: 'RP003',
            deviceType: 'เครื่องซักผ้า',
            brand: 'Panasonic',
            model: 'PAN-5555',
            issue: 'ไม่ปั่นแห้ง',
            reportDate: '2023-11-10',
            completedDate: '2023-11-12',
            duration: '2 วัน',
            technician: 'ช่าง สมชาย',
            cost: '1,500',
            rating: 5,
            status: 'completed',
            note: 'เปลี่ยนสายพาน'
        },
        {
            id: 'RP004',
            deviceType: 'ทีวี',
            brand: 'Sony',
            model: 'SONY-4K',
            issue: 'ภาพไม่ขึ้น',
            reportDate: '2023-10-05',
            completedDate: '2023-10-08',
            duration: '3 วัน',
            technician: 'ช่าง ประสิทธิ์',
            cost: '3,200',
            rating: 5,
            status: 'completed',
            note: 'เปลี่ยนแผงวงจร T-CON'
        },
        {
            id: 'RP005',
            deviceType: 'พัดลม',
            brand: 'Hatari',
            model: 'HT-2020',
            issue: 'ใบพัดหมุนช้า',
            reportDate: '2023-09-15',
            completedDate: '2023-09-16',
            duration: '1 วัน',
            technician: 'ช่าง วิชัย',
            cost: '500',
            rating: 4,
            status: 'completed',
            note: 'ทำความสะอาดและหล่อลื่น'
        },
        {
            id: 'RP006',
            deviceType: 'เตารีด',
            brand: 'Philips',
            model: 'PH-IRON',
            issue: 'ไม่ร้อน',
            reportDate: '2023-08-20',
            completedDate: '2023-08-21',
            duration: '1 วัน',
            technician: 'ช่าง สมชาย',
            cost: '800',
            rating: 5,
            status: 'completed',
            note: 'เปลี่ยนขดลวดความร้อน'
        }
    ];

    const years = ['all', '2024', '2023', '2022'];
    const months = [
        { value: 'all', label: 'ทั้งหมด' },
        { value: '01', label: 'มกราคม' },
        { value: '02', label: 'กุมภาพันธ์' },
        { value: '03', label: 'มีนาคม' },
        { value: '04', label: 'เมษายน' },
        { value: '05', label: 'พฤษภาคม' },
        { value: '06', label: 'มิถุนายน' },
        { value: '07', label: 'กรกฎาคม' },
        { value: '08', label: 'สิงหาคม' },
        { value: '09', label: 'กันยายน' },
        { value: '10', label: 'ตุลาคม' },
        { value: '11', label: 'พฤศจิกายน' },
        { value: '12', label: 'ธันวาคม' }
    ];

    // ฟังก์ชันกรองข้อมูล
    const filteredItems = historyItems.filter(item => {
        const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchTerm.toLowerCase());

        const itemYear = item.completedDate.split('-')[0];
        const itemMonth = item.completedDate.split('-')[1];

        const matchesYear = selectedYear === 'all' || itemYear === selectedYear;
        const matchesMonth = selectedMonth === 'all' || itemMonth === selectedMonth;

        return matchesSearch && matchesYear && matchesMonth;
    });

    // คำนวณสถิติ
    const totalRepairs = historyItems.length;

    // ฟังก์ชันแสดงดาว
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <svg
                key={index}
                className={`w-5 h-5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
            >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
        ));
    };

    return (
        <>
            <MainNav />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-20 mt-20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">ประวัติการซ่อม</h1>
                        <p className="text-purple-100 text-lg">ดูข้อมูลการซ่อมที่เสร็จสิ้นแล้วทั้งหมด</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
                
                    {/* Search and Filter */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="ค้นหารหัส, อุปกรณ์, ยี่ห้อ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Year Filter */}
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                                >
                                    <option value="all">ทุกปี</option>
                                    {years.slice(1).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Month Filter */}
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                                >
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* History Items List */}
                    <div className="space-y-4">
                        {filteredItems.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบประวัติการซ่อม</h3>
                                <p className="text-gray-500">ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง</p>
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-purple-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-bold text-gray-800">#{item.id}</h3>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-300">
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        เสร็จสิ้น
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 font-medium text-lg">{item.deviceType} - {item.brand} {item.model}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">เสร็จเมื่อ</p>
                                                <p className="text-lg font-semibold text-gray-800">{item.completedDate}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Problem */}
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600 font-medium flex items-center">
                                                    <Wrench className="w-4 h-4 mr-2 text-purple-600" />
                                                    อาการที่แจ้ง
                                                </p>
                                                <p className="text-gray-800 font-semibold">{item.issue}</p>
                                            </div>

                                            {/* Duration */}
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600 font-medium flex items-center">
                                                    <Clock className="w-4 h-4 mr-2 text-purple-600" />
                                                    ระยะเวลา
                                                </p>
                                                <p className="text-gray-800 font-semibold">{item.duration}</p>
                                                <p className="text-xs text-gray-500">แจ้ง: {item.reportDate}</p>
                                            </div>

                                            {/* Technician */}
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600 font-medium flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    ช่างผู้ซ่อม
                                                </p>
                                                <p className="text-gray-800 font-semibold">{item.technician}</p>
                                            </div>

                                            {/* Cost */}
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600 font-medium flex items-center">
                                                    <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                                                    ค่าบริการ
                                                </p>
                                                <p className="text-2xl font-bold text-green-600">฿{item.cost}</p>
                                            </div>

                                            {/* Rating */}
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600 font-medium flex items-center">
                                                    <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
                                                    คะแนน
                                                </p>
                                                <div className="flex gap-1">
                                                    {renderStars(item.rating)}
                                                </div>
                                            </div>

                                            {/* Note */}
                                            <div className="space-y-2 lg:col-span-1">
                                                <p className="text-sm text-gray-600 font-medium flex items-center">
                                                    <FileText className="w-4 h-4 mr-2 text-purple-600" />
                                                    หมายเหตุ
                                                </p>
                                                <p className="text-gray-800">{item.note}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                                        <div className="flex flex-wrap gap-3">
                                            <button className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200">
                                                <Eye className="w-4 h-4 mr-2" />
                                                ดูรายละเอียด
                                            </button>
                                            <button className="inline-flex items-center px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200">
                                                <Download className="w-4 h-4 mr-2" />
                                                ดาวน์โหลดใบเสร็จ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Summary Footer */}
                    {filteredItems.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <p className="text-gray-600 font-medium">
                                    แสดง <span className="font-bold text-purple-600">{filteredItems.length}</span> รายการ จากทั้งหมด {totalRepairs} รายการ
                                </p>
                                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                                    <Download className="w-5 h-5 mr-2" />
                                    ดาวน์โหลดสรุปทั้งหมด
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HistoryRepair;