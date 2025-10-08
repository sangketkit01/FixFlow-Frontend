import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Plus, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';


const EditTech = () => {
  // ========== States ==========
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State สำหรับสถิติ
  const [stats, setStats] = useState([
    { title: 'งานทั้งหมด', count: 0, change: '+0%', color: 'bg-blue-500', icon: Clock },
    { title: 'งานสำเร็จ', count: 0, change: '+0%', color: 'bg-green-500', icon: CheckCircle },
    { title: 'กำลังดำเนินการ', count: 0, change: '+0%', color: 'bg-yellow-500', icon: Clock },
    { title: 'ยกเลิก', count: 0, change: '0%', color: 'bg-red-500', icon: AlertCircle }
  ]);

  // State สำหรับฟอร์มแก้ไข
  const [editForm, setEditForm] = useState({
    username: '',
    full_name: '',
    email: '',
    phone: '',
    age: '',
    password: '',
    id_card: '',
    address: '',
    district: '',
    province: '',
    working_area_district: '',
    working_area_province: '',
    birth_date: ''
  });

  const getAuthHeaders = () => ({ 'Content-Type': 'application/json' });

  // ========== API Calls ==========
  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/technicians`, { method: 'GET', headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      const techData = result.data || result.technicians || result;
      setTechnicians(Array.isArray(techData) ? techData : []);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลช่างได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/technicians/statistics/summary`, { method: 'GET', headers: getAuthHeaders() });
      if (!response.ok) return;
      const result = await response.json();
      const data = result.data || result;
      setStats([
        { title: 'งานทั้งหมด', count: data.totalJobs || 0, change: data.totalJobsChange || '+0%', color: 'bg-blue-500', icon: Clock },
        { title: 'งานสำเร็จ', count: data.completedJobs || 0, change: data.completedJobsChange || '+0%', color: 'bg-green-500', icon: CheckCircle },
        { title: 'กำลังดำเนินการ', count: data.ongoingJobs || 0, change: data.ongoingJobsChange || '+0%', color: 'bg-yellow-500', icon: Clock },
        { title: 'ยกเลิก', count: data.cancelledJobs || 0, change: data.cancelledJobsChange || '0%', color: 'bg-red-500', icon: AlertCircle }
      ]);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const updateTechnician = async (techId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/technicians/${techId}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(updateData) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'ไม่สามารถอัพเดทข้อมูลได้');
    return result.data || result;
  };

  const deleteTechnician = async (techId) => {
    const response = await fetch(`${API_BASE_URL}/technicians/${techId}`, { method: 'DELETE', headers: getAuthHeaders() });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'ไม่สามารถลบข้อมูลได้');
    return result;
  };

  // ========== Event Handlers ==========
  const handleEdit = (tech) => {
    setSelectedTech(tech);
    const birthDateFormatted = tech.birth_date ? new Date(tech.birth_date).toISOString().split('T')[0] : '';
    setEditForm({ ...tech, password: '', birth_date: birthDateFormatted });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      const updateData = { ...editForm };
      if (!updateData.password) delete updateData.password;
      await updateTechnician(selectedTech._id || selectedTech.id, updateData);
      setTechnicians(technicians.map(tech => (tech._id === selectedTech._id || tech.id === selectedTech.id) ? { ...tech, ...updateData } : tech));
      setShowEditModal(false);
      setSelectedTech(null);
      alert('✅ บันทึกข้อมูลสำเร็จ');
      fetchTechnicians();
    } catch (err) {
      alert('❌ เกิดข้อผิดพลาด: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('⚠️ คุณต้องการลบช่างท่านนี้ใช่หรือไม่?')) {
      try {
        await deleteTechnician(id);
        setTechnicians(technicians.filter(tech => tech._id !== id && tech.id !== id));
        alert('✅ ลบข้อมูลสำเร็จ');
      } catch (err) {
        alert('❌ เกิดข้อผิดพลาด: ' + err.message);
      }
    }
  };

  const handleViewProfile = (tech) => {
    const techId = tech._id || tech.id;
    window.location.href = `/technician/${techId}`;
  };

  // ========== Effects ==========
  useEffect(() => {
    fetchTechnicians();
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 30000);
    return () => clearInterval(interval);
  }, []);

  // ========== Filtering ==========
  const filteredTechs = technicians.filter(tech => {
    const searchLower = searchTerm.toLowerCase();
    return (tech.full_name || '').toLowerCase().includes(searchLower)
      || (tech.username || '').toLowerCase().includes(searchLower)
      || (tech.email || '').toLowerCase().includes(searchLower)
      || (tech.phone || '').toLowerCase().includes(searchLower)
      || (tech.working_area_province || '').toLowerCase().includes(searchLower);
  });

  // ========== Render ==========
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">ระบบจัดการช่าง</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Admin User</span>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">AU</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <div>
              <p className="font-semibold">⚠️ เกิดข้อผิดพลาด</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
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
                  <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technicians List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">รายชื่อช่างทั้งหมด ({filteredTechs.length})</h2>
            <button onClick={() => window.location.href = '/add-technician'} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" /><span>เพิ่มช่าง</span>
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="ค้นหาช่าง..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ช่าง</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ติดต่อ</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">พื้นที่ทำงาน</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">อายุ</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTechs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">{searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ไม่พบข้อมูลช่าง'}</td>
                  </tr>
                ) : (
                  filteredTechs.map(tech => {
                    const techId = tech._id || tech.id;
                    return (
                      <tr key={techId} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleViewProfile(tech)}>
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {tech.full_name ? tech.full_name.charAt(0).toUpperCase() : 'T'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{tech.full_name || tech.username}</p>
                            <p className="text-xs text-gray-500">@{tech.username}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-800">{tech.phone || '-'}</p>
                          <p className="text-xs text-gray-500">{tech.email || '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-800">{tech.working_area_province || '-'}</p>
                          <p className="text-xs text-gray-500">{tech.working_area_district || '-'}</p>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-gray-800">{tech.age || '-'} ปี</span></td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button onClick={e => { e.stopPropagation(); handleEdit(tech); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="แก้ไข">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={e => { e.stopPropagation(); handleDelete(techId); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ลบ">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-800">แก้ไขข้อมูลช่าง</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ฟอร์มแก้ไขใส่ครบตามเดิม */}
              {/* Username */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">ชื่อผู้ใช้</label>
                <input type="text" value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* Full Name */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                <input type="text" value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* Email */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* Phone */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                <input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} maxLength="10" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* Birth Date */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">วันเกิด</label>
                <input type="date" value={editForm.birth_date} onChange={e => setEditForm({ ...editForm, birth_date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* Age */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">อายุ</label>
                <input type="number" value={editForm.age} onChange={e => setEditForm({ ...editForm, age: e.target.value })} min="18" max="70" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* ID Card */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">เลขบัตรประชาชน</label>
                <input type="text" value={editForm.id_card} onChange={e => setEditForm({ ...editForm, id_card: e.target.value })} maxLength="13" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* Password */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่านใหม่ <span className="text-gray-400">(เว้นว่างหากไม่เปลี่ยน)</span></label>
                <input type="password" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} placeholder="ใส่รหัสผ่านใหม่" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* Address */}
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">ที่อยู่</label>
                <input type="text" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* District */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">อำเภอ</label>
                <input type="text" value={editForm.district} onChange={e => setEditForm({ ...editForm, district: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* Province */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">จังหวัด</label>
                <input type="text" value={editForm.province} onChange={e => setEditForm({ ...editForm, province: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* Working Area District */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">อำเภอที่ทำงาน</label>
                <input type="text" value={editForm.working_area_district} onChange={e => setEditForm({ ...editForm, working_area_district: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              {/* Working Area Province */}
              <div><label className="block text-sm font-medium text-gray-700 mb-2">จังหวัดที่ทำงาน</label>
                <input type="text" value={editForm.working_area_province} onChange={e => setEditForm({ ...editForm, working_area_province: e.target.value })} placeholder="เช่น ขอนแก่น, กาฬสินธุ์" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t sticky bottom-0 bg-white">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">ยกเลิก</button>
              <button onClick={handleSave} className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTech;
