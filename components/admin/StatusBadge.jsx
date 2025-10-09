import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved':
                return {
                    label: 'อนุมัติแล้ว',
                    className: 'bg-green-100 text-green-800 border-green-200'
                };
            case 'pending':
                return {
                    label: 'รอดำเนินการ',
                    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
                };
            case 'rejected':
                return {
                    label: 'ปฏิเสธ',
                    className: 'bg-red-100 text-red-800 border-red-200'
                };
            default:
                return {
                    label: status || 'ไม่ระบุ',
                    className: 'bg-gray-100 text-gray-800 border-gray-200'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}>
            {config.label}
        </span>
    );
};

export default StatusBadge;