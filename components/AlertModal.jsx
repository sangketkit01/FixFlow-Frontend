import React from "react";

export default function AlertModal({ show, type = "success", title, message, onClose }) {
    if (!show) return null;

    const isSuccess = type === "success";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 text-center animate-fade-in">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div
                        className={`relative flex items-center justify-center w-16 h-16 rounded-full ${isSuccess ? "bg-green-100" : "bg-red-100"
                            }`}
                    >
                        {isSuccess ? (
                            <svg
                                className="w-10 h-10 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg
                                className="w-10 h-10 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                </div>

                <h2
                    className={`text-2xl font-bold mb-2 ${isSuccess ? "text-green-700" : "text-red-600"
                        }`}
                >
                    {title || (isSuccess ? "สำเร็จ!" : "เกิดข้อผิดพลาด")}
                </h2>
                <p className="text-gray-600 mb-6">{message || ""}</p>

                <button
                    onClick={onClose}
                    className={`w-full py-2 rounded-lg font-semibold text-white ${isSuccess
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        } transition`}
                >
                    ปิด
                </button>
            </div>
        </div>
    );
}
