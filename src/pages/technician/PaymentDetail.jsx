import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusCircle, Trash2, Loader, CheckCircle, ArrowLeft } from "lucide-react";
import baseUrl from "../../../constants/ServerConstant";
import Navtech from "../../../components/technician/Navtech";

const PaymentDetailPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [details, setDetails] = useState([]);
    const [newDetail, setNewDetail] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchPayment = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseUrl}/technician/tasks/${taskId}/payment`, {
                withCredentials: true,
            });
            setPayment(res.data.payment);
            setDetails(res.data.details);
        } catch (err) {
            if (err.response?.status === 404) {
                // ยังไม่มี payment ให้สร้างใหม่เลย
                const create = await axios.post(
                    `${baseUrl}/technician/tasks/${taskId}/payment`,
                    { amount: 0, type: "other" },
                    { withCredentials: true }
                );
                setPayment(create.data.payment);
                setDetails([]);
            } else {
                alert(err.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayment();
    }, [taskId]);

    const handleAddDetail = async (e) => {
        e.preventDefault();
        if (!newDetail || !newPrice) return alert("กรอกข้อมูลให้ครบ");

        try {
            const res = await axios.post(
                `${baseUrl}/technician/payment-detail`,
                {
                    payment_id: payment._id,
                    detail: newDetail,
                    price: Number(newPrice),
                },
                { withCredentials: true }
            );
            setDetails((prev) => [...prev, res.data.paymentDetail]);
            setNewDetail("");
            setNewPrice("");
        } catch (err) {
            alert(err.response?.data?.message || "เพิ่มรายการไม่สำเร็จ");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("ต้องการลบรายการนี้ใช่ไหม?")) return;
        try {
            await axios.delete(`${baseUrl}/technician/payment-detail/${id}`, {
                withCredentials: true,
            });
            setDetails((prev) => prev.filter((d) => d._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "ลบไม่สำเร็จ");
        }
    };

    const totalAmount = details.reduce((sum, d) => sum + d.price, 0);

    const handleSaveAndBack = async () => {
        setSaving(true);
        try {
            await axios.post(
                `${baseUrl}/technician/tasks/${taskId}/payment`,
                { amount: totalAmount, type: "other" },
                { withCredentials: true }
            );
            navigate(`/technician/task-details/${taskId}`);
        } catch (err) {
            alert("บันทึกไม่สำเร็จ");
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                <Loader className="w-8 h-8 mr-3 animate-spin" /> กำลังโหลดข้อมูล...
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <Navtech />
            <main className="max-w-5xl mx-auto pt-24 px-6 pb-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">เพิ่มค่าใช้จ่าย</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" /> กลับ
                    </button>
                </div>

                <form
                    onSubmit={handleAddDetail}
                    className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-xl shadow"
                >
                    <input
                        type="text"
                        value={newDetail}
                        onChange={(e) => setNewDetail(e.target.value)}
                        placeholder="รายละเอียดค่าใช้จ่าย"
                        className="flex-1 border rounded-lg px-3 py-2"
                    />
                    <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="ราคา (บาท)"
                        className="w-40 border rounded-lg px-3 py-2"
                    />
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" /> เพิ่ม
                    </button>
                </form>

                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    {details.length > 0 ? (
                        <table className="w-full text-gray-800">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left py-2 px-3">รายละเอียด</th>
                                    <th className="text-right py-2 px-3">ราคา (บาท)</th>
                                    <th className="py-2 px-3 text-center">ลบ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.map((d) => (
                                    <tr key={d._id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-3">{d.detail}</td>
                                        <td className="py-2 px-3 text-right">{d.price.toLocaleString()}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => handleDelete(d._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="font-bold">
                                    <td className="text-right py-2 px-3">รวมทั้งหมด:</td>
                                    <td className="text-right py-2 px-3 text-green-600">
                                        {totalAmount.toLocaleString()} บาท
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-center py-10">
                            ยังไม่มีรายการค่าใช้จ่าย
                        </p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSaveAndBack}
                        disabled={saving}
                        className="flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow disabled:bg-gray-400"
                    >
                        {saving ? (
                            <>
                                <Loader className="w-5 h-5 mr-2 animate-spin" />
                                กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                บันทึกค่าใช้จ่ายและกลับ
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PaymentDetailPage;
