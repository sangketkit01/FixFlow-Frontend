import React, { useState } from 'react';
import { Search, Edit2, Trash2, Plus, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';




const TechnicianList = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { title: 'งานทั้งหมด', count: 150, change: '+11%', color: 'bg-blue-500', icon: Clock },
    { title: 'งานสำเร็จ', count: 105, change: '+8.5%', color: 'bg-green-500', icon: CheckCircle },
    { title: 'กำลังดำเนินการ', count: 42, change: '+25%', color: 'bg-yellow-500', icon: Clock },
    { title: 'ยกเลิก', count: 3, change: '-40%', color: 'bg-red-500', icon: AlertCircle }
  ];

  const [technicians, setTechnicians] = useState([
    {
      id: 1,
      name: 'Abdullah Al-Abed Brown',
      specialty: 'ไฟฟ้า',
      phone: '098-765-4321',
      email: 'abdullah@repair.com',
      totalJobs: 45,
      completedJobs: 42,
      ongoingJobs: 3,
      avatar: '👨🏻',
      joinDate: '01/01/2023',
      birthDate: '15/06/1990',
      age: 34,
      address: '123/45 ถ.มิตรภาพ',
      district: 'เมืองขอนแก่น',
      province: 'ขอนแก่น',
      working_area_province: 'ขอนแก่น, กาฬสินธุ์'
    }
  ]);

  const [editForm, setEditForm] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    birthDate: '',
    age: '',
    address: '',
    district: '',
    province: '',
    working_area_province: ''
  });

  const handleEdit = (tech) => {
    setSelectedTech(tech);
    setEditForm({
      name: tech.name,
      specialty: tech.specialty,
      phone: tech.phone,
      email: tech.email,
      birthDate: tech.birthDate,
      age: tech.age,
      address: tech.address,
      district: tech.district,
      province: tech.province,
      working_area_province: tech.working_area_province
    });
    setShowEditModal(true);
  };

  const handleSave = () => {
    setTechnicians(technicians.map(tech => 
      tech.id === selectedTech.id ? { ...tech, ...editForm } : tech
    ));
    setShowEditModal(false);
    setSelectedTech(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบช่างท่านนี้ใช่หรือไม่?')) {
      setTechnicians(technicians.filter(tech => tech.id !== id));
    }
  };

  const handleViewProfile = (tech) => {
    // นำทางไปหน้าโปรไฟล์พร้อมส่งข้อมูล
    navigate(`/technician/${tech.id}`, { state: { technician: tech } });
  };

  const filteredTechs = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ระบบจัดการช่าง</h1>
              <p className="text-sm text-gray-500 mt-1">Central Clinic Dindra</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Md Rayhan Islam</span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                MR
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-800">{stat.count}</p>
                    <p className="text-xs text-gray-500 mt-1">วันนี้</p>
                  </div>
                  <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technicians List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">รายชื่อช่างทั้งหมด</h2>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span>เพิ่มช่าง</span>
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาช่างหรือความเชี่ยวชาญ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ช่าง</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ความเชี่ยวชาญ</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ติดต่อ</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">งานทั้งหมด</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">สำเร็จ</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">ดำเนินการ</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTechs.map((tech) => (
                  <tr 
                    key={tech.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewProfile(tech)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xl">
                          {tech.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{tech.name}</p>
                          <p className="text-xs text-gray-500">เข้าร่วม: {tech.joinDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {tech.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800">{tech.phone}</p>
                      <p className="text-xs text-gray-500">{tech.email}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-semibold text-gray-800">{tech.totalJobs}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {tech.completedJobs}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        {tech.ongoingJobs}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(tech);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(tech.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">แก้ไขข้อมูลช่าง</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">

            
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ความเชี่ยวชาญ</label>
                  <select
                    value={editForm.specialty}
                    onChange={(e) => setEditForm({...editForm, specialty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ไฟฟ้า">ไฟฟ้า</option>
                    <option value="ประปา">ประปา</option>
                    <option value="แอร์">แอร์</option>
                    <option value="ช่างทั่วไป">ช่างทั่วไป</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">วันเกิด</label>
                  <input
                    type="text"
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">อายุ</label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ที่อยู่</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">อำเภอ</label>
                  <input
                    type="text"
                    value={editForm.district}
                    onChange={(e) => setEditForm({...editForm, district: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">จังหวัด</label>
                  <input
                    type="text"
                    value={editForm.province}
                    onChange={(e) => setEditForm({...editForm, province: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">พื้นที่ทำงาน</label>
                  <input
                    type="text"
                    value={editForm.working_area_province}
                    onChange={(e) => setEditForm({...editForm, working_area_province: e.target.value})}
                    placeholder="เช่น ขอนแก่น, กาฬสินธุ์"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianList;