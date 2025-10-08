import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle, TrendingUp, Users, Wrench, DollarSign, Star } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState([]);
    const [quickStats, setQuickStats] = useState({});
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
            
            const response = await axios.get(`${API_BASE_URL}/admin/stats/dashboard`, {
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

    // ฟังก์ชันดึงข้อมูลทั้งหมด
    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchStats(),
                fetchQuickStats()
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

    if (loading) {
        return (
            <div>
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
                
                {/* Loading for Quick Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="bg-gray-100 p-4 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-12 mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-20"></div>
                            </div>
                        ))}
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
                            <span className="text-sm font-medium text-blue-700">ช่างทั้งหมด </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-800">{quickStats.totalTechnicians}</p>                    </div>
                    
                   
                    
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
                    
                   
                </div>
            </div>

            
        </div>
    );
};

export default Dashboard;