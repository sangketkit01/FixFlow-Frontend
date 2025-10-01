// src/components/Login/LeftSection.jsx
import React from 'react';

export const Toolbox = () => {
    const Tool = ({ type, delay }) => (
        <div
            className={`animate-bounce`}
            style={{ animationDelay: `${delay}s` }}
        >
            <div
                className={`
          ${type === "hammer" ? "w-10 h-20 bg-orange-400 rounded" : ""}
          ${type === "screwdriver" ? "w-8 h-24 bg-orange-400 rounded" : ""}
          ${type === "wrench" ? "w-9 h-20 bg-gray-400 rounded-full" : ""}
          ${type === "pliers" ? "w-8 h-20 bg-red-400 rounded" : ""}
        `}
            ></div>
        </div>
    );

    return (
        <div className="w-full max-w-[450px] mb-10 animate-float">
            <div className="w-[280px] h-[200px] bg-[#8b5a3c] rounded-lg shadow-lg mx-auto relative">
                <div className="w-[100px] h-[20px] bg-[#6b4a2c] rounded-t-lg absolute -top-3 left-1/2 -translate-x-1/2"></div>
                <div className="flex justify-around items-end p-6 h-full">
                    <Tool type="hammer" delay={0} />
                    <Tool type="screwdriver" delay={0.2} />
                    <Tool type="wrench" delay={0.4} />
                    <Tool type="pliers" delay={0.6} />
                </div>
            </div>
        </div>
    );
};

export const WelcomeText = () => (
    <div className="mt-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
            ยินดีต้อนรับสู่ <span className="text-orange-400">fix&ing</span>
        </h2>
        <p className="text-lg opacity-90">
            บริการซ่อมที่คุณไว้วางใจ<br />ช่างมืออาชีพพร้อมให้บริการ 24 ชั่วโมง
        </p>
    </div>
);

export const Stats = () => {
    const stats = [
        { number: "5,000+", label: "ช่างมืออาชีพ" },
        { number: "50,000+", label: "งานที่สำเร็จ" },
        { number: "4.9★", label: "คะแนนรีวิว" },
    ];
    return (
        <div className="flex gap-10 mt-10 justify-center text-white">
            {stats.map((s, i) => (
                <div key={i} className="text-center">
                    <span className="text-2xl font-bold block">{s.number}</span>
                    <span className="text-sm opacity-80">{s.label}</span>
                </div>
            ))}
        </div>
    );
};

export const LeftSection = () => (
    <div className="flex-1 bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 flex flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-white/10 rounded-full -top-36 -left-36"></div>
        <div className="absolute w-[300px] h-[300px] bg-white/10 rounded-full -bottom-24 -right-24"></div>
        <div className="absolute w-[150px] h-[150px] bg-orange-300/20 rounded-full top-1/2 left-10"></div>
        <div className="z-10">
            <Toolbox />
            <WelcomeText />
            <Stats />
        </div>
    </div>
);
