import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const FeedbackModal = ({ 
    showFeedbackModal, 
    feedbackMessage, 
    isSuccess, 
    onClose 
}) => {
    if (!showFeedbackModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
                <div className="flex justify-center mb-4">
                    {isSuccess ? (
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    ) : (
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    )}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {isSuccess ? 'สำเร็จ' : 'เกิดข้อผิดพลาด'}
                </h3>
                <p className="text-gray-600 mb-6">{feedbackMessage}</p>
                <button
                    onClick={onClose}
                    className={`w-full px-4 py-2 text-white rounded-lg ${
                        isSuccess 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                    ตกลง
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;