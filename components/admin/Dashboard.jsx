import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState([]);
    const [revenueData, setRevenueData] = useState({
        total_revenue: 0,
        total_payments: 0
    });
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
            setError("ไม่สามารถโหลดข้อมูลสถิติล่าสุดได้");
        }
    };

    // ฟังก์ชันดึงข้อมูลรายได้จาก payment_details
    const fetchRevenueStats = async () => {
        try {
            console.log('Fetching revenue stats from:', `${API_BASE_URL}/admin/stats/revenue`);
            
            const response = await axios.get(`${API_BASE_URL}/admin/stats/revenue`, {
                withCredentials: true
            });
            
            const data = response.data;
            console.log('Revenue stats data:', data);
            
            if (data.success) {
                setRevenueData(data.data);
            } else {
                throw new Error('Failed to fetch revenue data');
            }
            
        } catch (err) {
            console.error("Error fetching revenue stats:", err);
            setError("ไม่สามารถโหลดข้อมูลรายได้ได้");
        }
    };

    // ดึงข้อมูลทั้งหมด
    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchStats(),
                fetchRevenueStats()
            ]);
        } catch (err) {
            console.error("Error fetching all data:", err);
            setError("มีปัญหาในการโหลดข้อมูลบางส่วน");
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
                
                {/* Loading for Revenue Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="bg-gray-200 rounded-lg p-6 h-32"></div>
                </div>
            </div>
        );
    }

    return (
        <div>
            

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
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-violet-600 hover:shadow-xl transition-shadow duration-300">
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

            {/* Revenue Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                <div className="mt-6 bg-gradient-to-r from-violet-500 to-violet-400 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <DollarSign className="w-5 h-5" />
                                <span className="text-sm font-medium">รายได้รวมทั้งหมด</span>
                            </div>
                            <p className="text-3xl font-bold">
                                ฿{revenueData.total_revenue.toLocaleString()}
                            </p>
                            <p className="text-violet-100 text-sm mt-1">
                                จาก {revenueData.total_payments.toLocaleString()} รายการชำระเงิน
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-full">
                            <DollarSign className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;