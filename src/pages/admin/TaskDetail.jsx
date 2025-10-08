import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Wrench, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Image,
  MessageSquare
} from 'lucide-react';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskImages, setTaskImages] = useState([]);
  const [payments, setPayments] = useState([]);

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    fetchTaskDetail();
  }, [id]);

  const fetchTaskDetail = async () => {
    try {
      setLoading(true);
      
      // ดึงข้อมูลงาน
      const taskResponse = await axios.get(`${API_BASE_URL}/tasks/${id}`, {
        withCredentials: true
      });
      
      setTask(taskResponse.data);
      
      // ดึงรูปภาพของงาน (ถ้ามี)
      try {
        const imagesResponse = await axios.get(`${API_BASE_URL}/tasks/${id}/images`, {
          withCredentials: true
        });
        setTaskImages(imagesResponse.data);
      } catch (imageError) {
        console.log('No images found for this task');
      }
      
      // ดึงข้อมูลการชำระเงิน (ถ้ามี)
      try {
        const paymentsResponse = await axios.get(`${API_BASE_URL}/tasks/${id}/payments`, {
          withCredentials: true
        });
        setPayments(paymentsResponse.data);
      } catch (paymentError) {
        console.log('No payments found for this task');
      }
      
    } catch (err) {
      console.error('Error fetching task details:', err);
      setError('ไม่สามารถโหลดข้อมูลงานได้');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'รอดำเนินการ' },
      accepted: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'รับงานแล้ว' },
      fixing: { color: 'bg-orange-100 text-orange-800', icon: Wrench, label: 'กำลังซ่อม' },
      successful: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'สำเร็จ' },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'ไม่สำเร็จ' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'ยกเลิก' },
      request_canceling: { color: 'bg-purple-100 text-purple-800', icon: AlertCircle, label: 'ขอยกเลิก' }
    };
    
    return statusMap[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: status };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลงาน...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            กลับ
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">ไม่พบข้อมูลงาน</h2>
          <p className="text-gray-600 mb-4">ไม่พบงานที่คุณกำลังค้นหา</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            กลับ
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(task.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            กลับ
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {statusInfo.label}
                </span>
                <span className="text-sm text-gray-500">
                  สร้างเมื่อ: {formatDate(task.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - ข้อมูลหลัก */}
          <div className="lg:col-span-2 space-y-6">
            {/* ข้อมูลงาน */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                รายละเอียดงาน
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดปัญหา</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[80px]">
                    {task.detail || 'ไม่มีรายละเอียดเพิ่มเติม'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทงาน</label>
                    <p className="text-gray-900">{task.task_type_id?.name || 'ไม่ระบุ'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สร้าง</label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ที่อยู่ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                ที่อยู่ในการซ่อม
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                  <p className="text-gray-900">{task.address}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">อำเภอ/เขต</label>
                    <p className="text-gray-900">{task.district}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
                    <p className="text-gray-900">{task.province}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* รูปภาพ */}
            {taskImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-purple-600" />
                  รูปภาพ ({taskImages.length})
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {taskImages.map((image, index) => (
                    <div key={image._id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost:8080${image.image_path}`}
                        alt={`Task image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(`http://localhost:8080${image.image_path}`, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - ข้อมูลผู้เกี่ยวข้องและสถานะ */}
          <div className="space-y-6">
            {/* ข้อมูลลูกค้า */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                ข้อมูลลูกค้า
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
                  <p className="text-gray-900">{task.username}</p>
                </div>
                
                {task.user_details && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                      <p className="text-gray-900">{task.user_details.full_name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                      <p className="text-gray-900">{task.user_details.phone}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                      <p className="text-gray-900">{task.user_details.email}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ข้อมูลช่าง (ถ้ามี) */}
            {task.technician_id && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Wrench className="w-5 h-5 mr-2 text-orange-600" />
                  ช่างผู้รับผิดชอบ
                </h2>
                
                <div className="space-y-3">
                  {task.technician_details ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อช่าง</label>
                        <p className="text-gray-900">{task.technician_details.full_name}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                        <p className="text-gray-900">{task.technician_details.phone}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                        <p className="text-gray-900">{task.technician_details.email}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">พื้นที่ทำงาน</label>
                        <p className="text-gray-900">
                          {task.technician_details.working_area_district}, {task.technician_details.working_area_province}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">กำลังโหลดข้อมูลช่าง...</p>
                  )}
                </div>
              </div>
            )}

            {/* ข้อมูลการชำระเงิน */}
            {payments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  การชำระเงิน
                </h2>
                
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status === 'completed' ? 'ชำระแล้ว' : 
                           payment.status === 'pending' ? 'รอชำระ' : 'ยกเลิก'}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>ประเภท: {payment.type}</p>
                        {payment.slip_image_path && (
                          <button
                            onClick={() => window.open(`http://localhost:8080${payment.slip_image_path}`, '_blank')}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            ดูสลิปการโอน
                          </button>
                        )}
                        <p className="text-xs text-gray-500">
                          อัปเดต: {formatDate(payment.updatedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline สถานะ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                ประวัติสถานะ
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">สร้างงาน</span>
                  <span className="text-sm text-gray-500">{formatDate(task.createdAt)}</span>
                </div>
                
                {task.updatedAt && task.updatedAt !== task.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">อัปเดตล่าสุด</span>
                    <span className="text-sm text-gray-500">{formatDate(task.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;