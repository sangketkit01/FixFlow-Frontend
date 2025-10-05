import React, { useEffect, useState } from "react";
import { Wrench, Clock, CheckCircle, PlusCircle, History, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainNav from "../../../components/user/MainNav";
import baseUrl from "../../../constants/ServerConstant";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const UserHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [summary, setSummary] = useState({ pending: 0, fixing: 0, success: 0 });
    const [recentTasks, setRecentTasks] = useState([]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get(`${baseUrl}/user/dashboard`, { withCredentials: true });
                setSummary(res.data.summary);
                setRecentTasks(res.data.recentTasks);
            } catch (err) {
                console.error("Error loading dashboard:", err);
            }
        };
        fetchSummary();
    }, []);

    const cards = [
        { label: "รอดำเนินการ", icon: Clock, color: "bg-yellow-100 text-yellow-700", value: summary.pending },
        { label: "กำลังซ่อม", icon: Wrench, color: "bg-purple-100 text-purple-700", value: summary.fixing },
        { label: "เสร็จสิ้น", icon: CheckCircle, color: "bg-green-100 text-green-700", value: summary.success },
    ];

    return (
        <>
            <MainNav />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16 mt-20">
                    <div className="max-w-6xl mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold mb-2">
                            สวัสดี {user?.name || "ผู้ใช้"}
                        </h1>
                        <p className="text-purple-100">
                            ยินดีต้อนรับสู่ระบบแจ้งซ่อมเครื่องใช้ไฟฟ้า FixFlow
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {cards.map((card, i) => (
                            <div key={i} className={`rounded-2xl p-6 shadow-md ${card.color}`}>
                                <div className="flex items-center justify-between">
                                    <card.icon className="w-10 h-10 opacity-80" />
                                    <span className="text-3xl font-bold">{card.value}</span>
                                </div>
                                <p className="mt-3 font-medium">{card.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">การดำเนินการด่วน</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <button
                                onClick={() => navigate("/user/report-repair")}
                                className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 rounded-2xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                            >
                                <PlusCircle className="w-8 h-8 mb-2" />
                                <span className="text-lg font-semibold">แจ้งซ่อม</span>
                            </button>
                            <button
                                onClick={() => navigate("/user/status-repair")}
                                className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 text-white py-8 rounded-2xl shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all"
                            >
                                <Wrench className="w-8 h-8 mb-2" />
                                <span className="text-lg font-semibold">ตรวจสอบสถานะ</span>
                            </button>
                            <button
                                onClick={() => navigate("/user/history-repair")}
                                className="flex flex-col items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white py-8 rounded-2xl shadow-lg hover:from-green-700 hover:to-green-800 transition-all"
                            >
                                <History className="w-8 h-8 mb-2" />
                                <span className="text-lg font-semibold">ดูประวัติการซ่อม</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Repairs */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">งานซ่อมล่าสุดของคุณ</h2>
                        {recentTasks.length === 0 ? (
                            <div className="bg-white p-6 rounded-2xl text-center shadow">
                                <p className="text-gray-500">ยังไม่มีงานซ่อมล่าสุด</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow overflow-hidden divide-y">
                                {recentTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/user/task-detail/${task._id}`)}
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800">{task.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {task.task_type_id?.name} •{" "}
                                                {new Date(task.createdAt).toLocaleDateString("th-TH")}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${task.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : task.status === "fixing"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {task.status === "pending"
                                                ? "รอดำเนินการ"
                                                : task.status === "fixing"
                                                    ? "กำลังซ่อม"
                                                    : "เสร็จสิ้น"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Headphones className="w-10 h-10" />
                            <div>
                                <h3 className="text-xl font-semibold">ติดต่อฝ่ายบริการลูกค้า</h3>
                                <p className="text-sm text-purple-200">
                                    โทร 02-123-4567 หรืออีเมล support@fixflow.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserHome;
