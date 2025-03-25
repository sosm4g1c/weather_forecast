import { useState, useEffect } from "react";
import { format } from "date-fns";

const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Cập nhật mỗi giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  return (
    <div className="w-fit flex flex-col items-center px-4">
      {/* Đồng hồ chạy real-time */}
      <p className="text-2xmd ">
        {format(currentTime, "HH:mm:ss a")}
      </p>
    </div>
  );
};

export default RealTimeClock;
