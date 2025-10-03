import React, { useState, useEffect } from 'react';
import axios from 'axios';

// คอมโพเนนต์สำหรับแสดงผลการ์ดงานแต่ละใบ
const TaskCard = ({ task }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-200 text-yellow-800';
            case 'fixing': return 'bg-blue-200 text-blue-800';
            case 'successful': return 'bg-green-200 text-green-800';
            case 'failed': return 'bg-red-200 text-red-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                </span>
            </div>
            <p className="text-gray-600 mt-2">{task.detail}</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700"><strong>ลูกค้า:</strong> {task.username?.firstName} {task.username?.lastName}</p>
                <p className="text-sm text-gray-500"><strong>ที่อยู่:</strong> {task.address}, {task.district}, {task.province}</p>
                <p className="text-sm text-gray-500 mt-1"><strong>แจ้งเมื่อ:</strong> {new Date(task.createdAt).toLocaleString()}</p>
            </div>
        </div>
    );
};

// คอมโพเนนต์หลักสำหรับแสดงหน้ารายการงาน
const MyTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // เรียก API โดยไม่ต้องใส่ host เพราะ proxy จัดการให้แล้ว
                const response = await axios.get('http://localhost:8080/technician/tasks/my-tasks', config);
                
                console.log('Data from API:', response.data);

                const tasksData = Array.isArray(response.data)
                    ? response.data
                    : response.data.tasks || [];

                setTasks(tasksData);

            } catch (err) {
                console.error("API error:", err.response || err.message);
                const message = err.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
                setError(message);
                setTasks([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) {
        return <div className="text-center p-10">กำลังโหลดข้อมูลงาน...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">รายการงานของฉัน</h1>
            
            {error && (
                 <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                     <p>{error}</p>
                 </div>
            )}

            {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map(task => (
                    <TaskCard key={task._id} task={task} />
                ))
            ) : (
                !error && <p>ยังไม่มีงานที่ได้รับมอบหมาย</p>
            )}
        </div>
    );
};

export default MyTasksPage;
