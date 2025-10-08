import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StatsCards = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600 animate-pulse">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</h3>
                        <div className={`${stat.color} w-10 h-10 rounded-full flex items-center justify-center bg-opacity-80`}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-4xl font-extrabold text-gray-900">{stat.count}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;