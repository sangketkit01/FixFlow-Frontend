import React, { useState } from "react";
import axios from "axios";
import Navtech from "../../../components/technician/Navtech";
import baseUrl from "../../../constants/ServerConstant";

export default function TechnicianChangePassword() {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${baseUrl}/technician/change-password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { withCredentials: true }
      );

      setMessage("เปลี่ยนรหัสผ่านสำเร็จแล้ว");
      setShowModal(true);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navtech />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 px-6">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            เปลี่ยนรหัสผ่าน
          </h2>

          {message && <div className="text-green-600 mb-3">{message}</div>}
          {error && <div className="text-red-600 mb-3">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                รหัสผ่านปัจจุบัน
              </label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, oldPassword: e.target.value })
                }
                className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                รหัสผ่านใหม่
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ยืนยันรหัสผ่านใหม่
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "กำลังอัปเดต..." : "อัปเดตรหัสผ่าน"}
            </button>
          </form>
        </div>

        {/* Modal แสดงผลสำเร็จ */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 text-center animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                  <svg
                    className="w-10 h-10 text-green-500 animate-bounce-in"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">สำเร็จ!</h2>
              <p className="text-gray-600 mb-6">รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว</p>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                ตกลง
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
