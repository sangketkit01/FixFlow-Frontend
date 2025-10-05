import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, Package, Phone, MapPin
} from "lucide-react";
import MainNav from "../../../components/user/MainNav";
import { useAuth } from "../../context/AuthContext";
import baseUrl from "../../../constants/ServerConstant";
import { useNavigate } from "react-router-dom";

const StatusRepair = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const statusConfig = {
        pending: {
            label: "รอดำเนินการ",
            color: "bg-yellow-100 text-yellow-800 border-yellow-300",
            icon: Clock,
            iconColor: "text-yellow-600",
        },
        accepted: {
            label: "รอช่างเข้าซ่อม",
            color: "bg-blue-100 text-blue-800 border-blue-300",
            icon: AlertCircle,
            iconColor: "text-blue-600",
        },
        fixing: {
            label: "กำลังซ่อม",
            color: "bg-purple-100 text-purple-800 border-purple-300",
            icon: AlertCircle,
            iconColor: "text-purple-600",
        },
        cancelled: {
            label: "ยกเลิก",
            color: "bg-red-100 text-red-800 border-red-300",
            icon: XCircle,
            iconColor: "text-red-600",
        },
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get(`${baseUrl}/task/my-tasks`, {
                    withCredentials: true,
                });
                setTasks(res.data);
            } catch (err) {
                console.error("❌ โหลดรายการซ่อมไม่สำเร็จ:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter((item) => {
        const matchesSearch =
            item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.task_type_id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
                กำลังโหลดข้อมูล...
            </div>
        );
    }

    return (
        <>
            <MainNav />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-20 mt-20 text-center">
                    <h1 className="text-4xl font-bold mb-4">สถานะการซ่อม</h1>
                    <p className="text-purple-100 text-lg">ตรวจสอบความคืบหน้าการซ่อมของคุณ</p>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto px-6 -mt-8 pb-16">
                    {/* Search & Filter */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="ค้นหาด้วยชื่ออุปกรณ์หรือปัญหา..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                            >
                                <option value="all">ทั้งหมด</option>
                                <option value="pending">รอดำเนินการ</option>
                                <option value="accepted">รอช่างเข้าซ่อม</option>
                                <option value="fixing">กำลังซ่อม</option>
                                <option value="cancelled">ยกเลิก</option>
                            </select>
                        </div>
                    </div>

                    {/* Task Cards */}
                    {filteredTasks.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                ไม่พบรายการซ่อม
                            </h3>
                            <p className="text-gray-500">
                                ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง
                            </p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => {
                            const StatusIcon = statusConfig[task.status]?.icon || Clock;
                            const status = statusConfig[task.status] || statusConfig.pending;

                            return (
                                <div
                                    key={task._id}
                                    onClick={() => navigate(`/user/task-detail/${task._id}`)} // ✅ เมื่อคลิก navigate ไปหน้า detail
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 mb-6 cursor-pointer hover:-translate-y-1 transform duration-200"
                                >
                                    <div className="flex justify-between flex-wrap items-center mb-3">
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {task.task_type_id?.name || "ไม่ระบุ"}
                                        </h3>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${status.color}`}
                                        >
                                            <StatusIcon className={`w-4 h-4 mr-1 ${status.iconColor}`} />
                                            {status.label}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-2">{task.title}</p>
                                    <p className="text-gray-500">{task.detail}</p>

                                    <div className="flex items-center gap-2 mt-4 text-gray-700">
                                        <MapPin className="w-4 h-4" /> {task.address}, {task.district}, {task.province}
                                    </div>

                                    {task.technician_id && (
                                        <div className="flex items-center gap-2 mt-2 text-blue-600">
                                            <Phone className="w-4 h-4" /> ช่าง {task.technician_id.name} ({task.technician_id.phone})
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};

export default StatusRepair;
