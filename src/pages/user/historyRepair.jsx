import React, { useState, useEffect } from "react";
import {
    Search,
    Calendar,
    Download,
    Eye,
    FileText,
    CheckCircle,
    Clock,
    DollarSign,
    Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainNav from "../../../components/user/MainNav";
import baseUrl from "../../../constants/ServerConstant";

const HistoryRepair = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${baseUrl}/user/history`, {
                    withCredentials: true,
                });
                setTasks(res.data);
            } catch (err) {
                console.error("❌ Error loading history:", err);
                setError("ไม่สามารถโหลดข้อมูลได้");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const years = ["all", "2025", "2024", "2023"];
    const months = [
        { value: "all", label: "ทั้งหมด" },
        { value: "01", label: "มกราคม" },
        { value: "02", label: "กุมภาพันธ์" },
        { value: "03", label: "มีนาคม" },
        { value: "04", label: "เมษายน" },
        { value: "05", label: "พฤษภาคม" },
        { value: "06", label: "มิถุนายน" },
        { value: "07", label: "กรกฎาคม" },
        { value: "08", label: "สิงหาคม" },
        { value: "09", label: "กันยายน" },
        { value: "10", label: "ตุลาคม" },
        { value: "11", label: "พฤศจิกายน" },
        { value: "12", label: "ธันวาคม" },
    ];

    const filteredItems = tasks.filter((t) => {
        const matchesSearch =
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.task_type_id?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.technician?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const date = new Date(t.updatedAt);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");

        const matchesYear = selectedYear === "all" || year === selectedYear;
        const matchesMonth = selectedMonth === "all" || month === selectedMonth;

        return matchesSearch && matchesYear && matchesMonth;
    });

    const renderStars = (rating = 5) =>
        [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
            >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
        ));

    if (loading)
        return (
            <div className="text-center mt-20 text-lg text-gray-600 animate-pulse">
                ⏳ กำลังโหลดข้อมูล...
            </div>
        );

    if (error)
        return (
            <div className="text-center mt-20 text-red-500 font-semibold">{error}</div>
        );

    return (
        <>
            <MainNav />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-20 mt-20">
                    <div className="max-w-6xl mx-auto text-center">
                        <Clock className="w-8 h-8 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold mb-4">ประวัติการซ่อม</h1>
                        <p className="text-purple-100 text-lg">
                            ดูข้อมูลการซ่อมที่เสร็จสิ้นแล้วทั้งหมด
                        </p>
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
                                    placeholder="ค้นหาชื่องาน, ประเภทเครื่อง, หรือช่าง..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* Year Filter */}
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="all">ทุกปี</option>
                                    {years.slice(1).map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Month Filter */}
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                >
                                    {months.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* History Cards */}
                    {filteredItems.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                ไม่พบประวัติการซ่อม
                            </h3>
                            <p className="text-gray-500">ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</p>
                        </div>
                    ) : (
                        filteredItems.map((t) => (
                            <div
                                key={t._id}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-purple-200 flex flex-col sm:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {t.task_type_id?.name || "ไม่ระบุประเภท"}
                                            </h3>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-300">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                เสร็จสิ้น
                                            </span>
                                        </div>
                                        <p className="text-gray-600 font-medium text-lg">
                                            {t.title}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">เสร็จเมื่อ</p>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {new Date(t.updatedAt).toLocaleDateString("th-TH")}
                                        </p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium flex items-center">
                                            <Wrench className="w-4 h-4 mr-2 text-purple-600" />
                                            รายละเอียดงาน
                                        </p>
                                        <p className="text-gray-800 font-semibold">{t.detail || "-"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-medium flex items-center">
                                            <Clock className="w-4 h-4 mr-2 text-purple-600" />
                                            วันที่แจ้ง
                                        </p>
                                        <p className="text-gray-800 font-semibold">
                                            {new Date(t.createdAt).toLocaleDateString("th-TH")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-medium flex items-center">
                                            <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                                            ค่าบริการ
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ฿{t.payment?.amount || 0}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-medium flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2 text-purple-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            ช่างผู้ซ่อม
                                        </p>
                                        <p className="text-gray-800 font-semibold">
                                            {t.technician?.full_name || "ไม่ระบุ"}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => navigate(`/user/task-detail/${t._id}`)}
                                        className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        ดูรายละเอียด
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default HistoryRepair;
