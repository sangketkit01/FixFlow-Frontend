import React from "react";
import { Edit2, Trash2 } from "lucide-react";
// import { useRouter } from "next/router";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TechnicianCard = ({ tech }) => {
  const navigate = useNavigate(); 

  const handleDelete = async () => {
    if (confirm("ยืนยันการลบช่างนี้หรือไม่?")) {
      await axios.delete(`http://localhost:5000/admin/${tech._id}`);
      window.location.reload();
    }
  };

  return (
    <div className="border p-4 rounded-md shadow-sm">
      <h2 className="font-bold text-lg">{tech.full_name}</h2>
      <p>เบอร์: {tech.phone}</p>
      <p>งานทั้งหมด: {tech.totalTasks}</p>
      <p>สำเร็จ: {tech.completedTasks}</p>
      <p>กำลังดำเนินงาน: {tech.inProgress}</p>

      <div className="flex justify-between mt-3">
        <button onClick={() => navigate(`/admin/TechnicianDetail?id=${tech._id}`)}>
          <Edit2 size={20} className="text-blue-500" />
        </button>
        <button onClick={handleDelete}>
          <Trash2 size={20} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default TechnicianCard;
