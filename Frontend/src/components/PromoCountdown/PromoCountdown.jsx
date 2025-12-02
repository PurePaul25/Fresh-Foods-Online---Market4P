import React from "react";
import Countdown from "react-countdown";

const PromoCountdown = () => {
  // Ngày kết thúc khuyến mãi
  const targetDate = new Date("2025-12-31T23:59:59");

  // Tuỳ chỉnh hiển thị
  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="border border-amber-600 p-4">
          <p className="text-2xl font-bold">{days}</p>
          <p className="text-sm">Ngày</p>
        </div>
        <div className="border border-amber-600 p-4">
          <p className="text-2xl font-bold">{hours}</p>
          <p className="text-sm">Giờ</p>
        </div>
        <div className="border border-amber-600 p-4">
          <p className="text-2xl font-bold">{minutes}</p>
          <p className="text-sm">Phút</p>
        </div>
        <div className="border border-amber-600 p-4">
          <p className="text-2xl font-bold">{seconds}</p>
          <p className="text-sm">Giây</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md text-center">
      <Countdown date={targetDate} renderer={renderer} />
    </div>
  );
};

export default PromoCountdown;
