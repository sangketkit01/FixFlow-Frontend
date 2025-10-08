import React from 'react';
import { Clock } from 'lucide-react';

const LoadingState = () => {
    return (
        <div className="text-center py-10 text-blue-600 text-lg flex items-center justify-center space-x-2">
            <Clock className="w-5 h-5 animate-spin" />
            <span>กำลังดึงข้อมูล...</span>
        </div>
    );
};

export default LoadingState;