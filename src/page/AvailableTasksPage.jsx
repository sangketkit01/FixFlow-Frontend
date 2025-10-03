import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AvailableTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAvailableTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            // const token = localStorage.getItem('authToken'); //  <-- ปิดบรรทัดนี้ไปก่อน

            // ❗️ วาง Token ที่ได้จากการล็อกอินใน Postman/Insomnia ตรงนี้
            const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGFjNzM4YzkwYjQ2MGE1ZGM3MmNiNyIsImlhdCI6MTc1OTMwMjQwMCwiZXhwIjoxNzU5Mzg4ODAwfQ.some_very_long_signature_string"; //  <-- ต้องเป็นข้อความยาวๆ แบบนี้

            const config = {
                headers: {
                    Authorization: `Bearer ${testToken}` // ใช้ Token ที่เรา Hardcode ไว้
                }
            };

            const response = await axios.get('/api/tasks/unassigned', config);

            if (Array.isArray(response.data)) {
                setTasks(response.data);
            } else {
                console.warn("API response is not an array:", response.data);
                setTasks([]);
            }
        } catch (err) {
            const message = err.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
            setError(message);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAvailableTasks();
    }, []);

    const handleAcceptTask = async (taskId) => {
        if (!window.confirm("คุณต้องการรับงานนี้ใช่หรือไม่?")) return;

        try {
            // ✅ 2. แก้ไข: เพิ่ม config ที่มี Token เข้าไปในการเรียก API
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.patch(`/api/technician/tasks/${taskId}/accept`, {}, config);

            alert(response.data.message);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (err) {
            const message = err.response?.data?.message || "ไม่สามารถรับงานได้";
            alert(`เกิดข้อผิดพลาด: ${message}`);
        }
    };

    if (loading) return <div>กำลังโหลดรายการงานที่ว่าง...</div>;

    return (
        <div>
            <h1>งานที่ยังว่าง</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {tasks.length > 0 ? (
                tasks.map(task => (
                    <div key={task._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
                        <h3>{task.title}</h3>
                        <p>รายละเอียด: {task.detail}</p>
                        <p>ที่อยู่: {task.address}</p>
                        <button onClick={() => handleAcceptTask(task._id)} style={{ marginTop: '10px' }}>
                            รับงานนี้
                        </button>
                    </div>
                ))
            ) : (
                !error && <p>ตอนนี้ยังไม่มีงานว่าง</p>
            )}
        </div>
    );
};

export default AvailableTasksPage;