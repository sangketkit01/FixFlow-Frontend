import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle, TrendingUp, Users, Wrench, DollarSign, Star, UserCheck, UserX, User } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState([]);
    const [quickStats, setQuickStats] = useState({});
    const [technicianStats, setTechnicianStats] = useState({});
    const [recentTechnicians, setRecentTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:8080';

    // ฟังก์ชันดึงข้อมูลสถิติหลัก
    const fetchStats = async () => {
        try {
            console.log('Fetching stats from:', `${API_BASE_URL}/admin/stats/dashboard`);
            
            const response = await axios.get(`${API_BASE_URL}/admin/stats/dashboard`, {
                withCredentials: true
            });
            
            const data = response.data;
            console.log('Stats data:', data);
            
            const transformedStats = [
                { 
                    title: 'งานทั้งหมด', 
                    count: data.total || 0, 
                    change: data.total_change || 'N/A', 
                    color: 'bg-blue-500', 
                    icon: Clock,
                    description: 'จำนวนงานทั้งหมดในระบบ'
                },
                { 
                    title: 'งานสำเร็จ', 
                    count: data.successful || 0, 
                    change: data.successful_change || 'N/A', 
                    color: 'bg-green-500', 
                    icon: CheckCircle,
                    description: 'งานที่ดำเนินการสำเร็จ'
                },
                { 
                    title: 'กำลังดำเนินการ', 
                    count: data.pending || 0, 
                    change: data.pending_change || 'N/A', 
                    color: 'bg-yellow-500', 
                    icon: Clock,
                    description: 'งานที่กำลังดำเนินการ'
                },
                { 
                    title: 'ยกเลิก', 
                    count: data.cancelled || 0, 
                    change: data.cancelled_change || 'N/A', 
                    color: 'bg-red-500', 
                    icon: AlertCircle,
                    description: 'งานที่ถูกยกเลิก'
                }
            ];

            setStats(transformedStats);
            
        } catch (err) {
            console.error("Error fetching stats:", err);
            setError("⚠️ ไม่สามารถโหลดข้อมูลสถิติล่าสุดได้");
        }
    };

    // ฟังก์ชันดึงข้อมูลภาพรวมระบบ
    const fetchQuickStats = async () => {
        try {
            console.log('Fetching quick stats from:', `${API_BASE_URL}/admin/stats/overview`);
            
            const response = await axios.get(`${API_BASE_URL}/admin/stats/overview`, {
                withCredentials: true
            });
            
            const data = response.data;
            console.log('Quick stats data:', data);
            
            setQuickStats({
                totalTechnicians: data.total_technicians || 0,
                technicianChange: data.technician_change || '+0',
                totalServices: data.total_services || 0,
                servicesChange: data.services_change || '+0',
                monthlyRevenue: data.monthly_revenue || 0,
                revenueChange: data.revenue_change || '+0%',
                satisfactionRate: data.satisfaction_rate || 0,
                satisfactionChange: data.satisfaction_change || '+0'
            });
            
        } catch (err) {
            console.error("Error fetching quick stats:", err);
            
            // ถ้า endpoint นี้ยังไม่มี ให้ใช้ข้อมูลจาก endpoint อื่นหรือคำนวณเอง
            setQuickStats({
                totalTechnicians: 0,
                technicianChange: '+0',
                totalServices: 0,
                servicesChange: '+0',
                monthlyRevenue: 0,
                revenueChange: '+0%',
                satisfactionRate: 0,
                satisfactionChange: '+0'
            });
        }
    };

    // ฟังก์ชันดึงข้อมูลสถิติช่าง
    const fetchTechnicianStats = async () => {
        try {
            console.log('Fetching technician stats from:', `${API_BASE_URL}/admin/technicians/stats`);
            
            const response = await axios.get(`${API_BASE_URL}/admin/technicians/stats`, {
                withCredentials: true
            });
            
            const data = response.data;
            console.log('Technician stats data:', data);
            
            setTechnicianStats({
                total: data.total || 0,
                approved: data.approved || 0,
                pending: data.pending || 0,
                rejected: data.rejected || 0,
                active: data.active || 0,
                inactive: data.inactive || 0
            });
            
        } catch (err) {
            console.error("Error fetching technician stats:", err);
            
            // ถ้า endpoint นี้ยังไม่มี ให้ดึงข้อมูลจาก technicians list แล้วคำนวณเอง
            try {
                const techResponse = await axios.get(`${API_BASE_URL}/admin/technicians`, {
                    withCredentials: true
                });
                
                const technicians = techResponse.data;
                const total = technicians.length;
                const approved = technicians.filter(t => t.status === 'approved').length;
                const pending = technicians.filter(t => t.status === 'pending').length;
                const rejected = technicians.filter(t => t.status === 'rejected').length;
                const active = technicians.filter(t => t.isActive !== false).length;
                const inactive = technicians.filter(t => t.isActive === false).length;
                
                setTechnicianStats({
                    total,
                    approved,
                    pending,
                    rejected,
                    active,
                    inactive
                });
                
            } catch (secondErr) {
                console.error("Error calculating technician stats:", secondErr);
                setTechnicianStats({
                    total: 0,
                    approved: 0,
                    pending: 0,
                    rejected: 0,
                    active: 0,
                    inactive: 0
                });
            }
        }
    };

    // ฟังก์ชันดึงข้อมูลช่างล่าสุด
    const fetchRecentTechnicians = async () => {
        try {
            console.log('Fetching recent technicians from:', `${API_BASE_URL}/admin/technicians/recent`);
            
            const response = await axios.get(`${API_BASE_URL}/admin/technicians/recent`, {
                withCredentials: true
            });
            
            const data = response.data;
            console.log('Recent technicians data:', data);
            
            setRecentTechnicians(data.slice(0, 5)); // แสดงแค่ 5 คนล่าสุด
            
        } catch (err) {
            console.error("Error fetching recent technicians:", err);
            
            // ถ้า endpoint นี้ยังไม่มี ให้ดึงข้อมูลจาก technicians list แล้วเลือกมา 5 คนล่าสุด
            try {
                const techResponse = await axios.get(`${API_BASE_URL}/admin/technicians`, {
                    withCredentials: true
                });
                
                const technicians = techResponse.data;
                // เรียงตามวันที่สร้างล่าสุดมาแรก
                const sortedTechs = technicians
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5);
                
                setRecentTechnicians(sortedTechs);
                
            } catch (secondErr) {
                console.error("Error calculating recent technicians:", secondErr);
                setRecentTechnicians([]);
            }
        }
    };

    // ฟังก์ชันดึงข้อมูลทั้งหมด
    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchStats(),
                fetchQuickStats(),
                fetchTechnicianStats(),
                fetchRecentTechnicians()
            ]);
        } catch (err) {
            console.error("Error fetching all data:", err);
            setError("⚠️ มีปัญหาในการโหลดข้อมูลบางส่วน");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // ฟังก์ชันรีเฟรชข้อมูล
    const handleRefresh = () => {
        setError(null);
        fetchAllData();
    };

    // ฟังก์ชันแสดงสถานะช่าง
    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    ✅ อนุมัติ
                </span>;
            case 'pending':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    ⏳ รอดำเนินการ
                </span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    ❌ ปฏิเสธ
                </span>;
            default:
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    ❓ ไม่ทราบสถานะ
                </span>;
        }
    };

    if (loading) {
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600 animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
                
                {/* Loading for Technician Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item} className="bg-gray-100 p-4 rounded-lg">
                                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-8"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Refresh Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">แดชบอร์ดภาพรวม</h2>
                <button
                    onClick={handleRefresh}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <TrendingUp className="w-4 h-4" />
                    <span>รีเฟรชข้อมูล</span>
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                            <span className="text-yellow-700">{error}</span>
                        </div>
                        <button 
                            onClick={() => setError(null)}
                            className="text-yellow-600 hover:text-yellow-800"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</h3>
                            <div className={`${stat.color} w-10 h-10 rounded-full flex items-center justify-center bg-opacity-90 shadow-md`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-4xl font-extrabold text-gray-900 mb-1">{stat.count.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{stat.description}</p>
                            </div>
                            {stat.change !== 'N/A' && (
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    stat.change.toString().startsWith('+') 
                                        ? 'bg-green-100 text-green-700' 
                                        : stat.change.toString().startsWith('-')
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                                    <TrendingUp className={`w-3 h-3 ${
                                        stat.change.toString().startsWith('+') 
                                            ? 'text-green-600' 
                                            : stat.change.toString().startsWith('-')
                                            ? 'text-red-600'
                                            : 'text-gray-600'
                                    }`} />
                                    <span>{stat.change}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Technician Statistics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {/* Technician Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">สถิติช่าง</h3>
                        <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                            <div className="flex items-center space-x-2 mb-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">ช่างทั้งหมด</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-800">{technicianStats.total}</p>
                            <p className="text-xs text-blue-600">คนในระบบ</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
                            <div className="flex items-center space-x-2 mb-2">
                                <UserCheck className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">อนุมัติแล้ว</span>
                            </div>
                            <p className="text-2xl font-bold text-green-800">{technicianStats.approved}</p>
                            <p className="text-xs text-green-600">{Math.round((technicianStats.approved / technicianStats.total) * 100) || 0}% ของทั้งหมด</p>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg hover:bg-yellow-100 transition-colors">
                            <div className="flex items-center space-x-2 mb-2">
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-700">รอดำเนินการ</span>
                            </div>
                            <p className="text-2xl font-bold text-yellow-800">{technicianStats.pending}</p>
                            <p className="text-xs text-yellow-600">รอการตรวจสอบ</p>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg hover:bg-red-100 transition-colors">
                            <div className="flex items-center space-x-2 mb-2">
                                <UserX className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-700">ปฏิเสธ</span>
                            </div>
                            <p className="text-2xl font-bold text-red-800">{technicianStats.rejected}</p>
                            <p className="text-xs text-red-600">ไม่ผ่านการอนุมัติ</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors">
                            <div className="flex items-center space-x-2 mb-2">
                                <UserCheck className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-700">กำลังทำงาน</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-800">{technicianStats.active}</p>
                            <p className="text-xs text-purple-600">ช่างที่พร้อมทำงาน</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-2 mb-2">
                                <UserX className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">ไม่ใช้งาน</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{technicianStats.inactive}</p>
                            <p className="text-xs text-gray-600">ช่างที่หยุดทำงาน</p>
                        </div>
                    </div>
                </div>

                {/* Recent Technicians */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">ช่างล่าสุด</h3>
                        <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {recentTechnicians.length > 0 ? (
                            recentTechnicians.map((tech, index) => (
                                <div key={tech._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{tech.full_name}</p>
                                            <p className="text-xs text-gray-500">{tech.specialty || 'ช่างทั่วไป'}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={tech.status} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p>ไม่มีข้อมูลช่าง</p>
                            </div>
                        )}
                    </div>
                    {recentTechnicians.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <button 
                                onClick={() => window.location.href = '/admin/technicians'}
                                className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                ดูช่างทั้งหมด →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">ภาพรวมระบบ</h3>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                        <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">ช่างทั้งหมด</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-800">{quickStats.totalTechnicians}</p>
                        <p className="text-xs text-blue-600">{quickStats.technicianChange} จากเดือนที่แล้ว</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
                        <div className="flex items-center space-x-2 mb-2">
                            <Wrench className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">บริการ</span>
                        </div>
                        <p className="text-2xl font-bold text-green-800">{quickStats.totalServices}</p>
                        <p className="text-xs text-green-600">{quickStats.servicesChange} ประเภทบริการ</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors">
                        <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">รายได้</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-800">
                            {quickStats.monthlyRevenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-purple-600">{quickStats.revenueChange} เดือนนี้</p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg hover:bg-orange-100 transition-colors">
                        <div className="flex items-center space-x-2 mb-2">
                            <Star className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-700">ความพึงพอใจ</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-800">{quickStats.satisfactionRate}</p>
                        <p className="text-xs text-orange-600">{quickStats.satisfactionChange} / 5.0 คะแนน</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;