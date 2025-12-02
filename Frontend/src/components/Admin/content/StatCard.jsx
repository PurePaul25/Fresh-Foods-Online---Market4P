import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { FaArrowUp } from "react-icons/fa";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// Sử dụng React.memo để component này chỉ render lại khi prop 'stat' thay đổi
const StatCard = React.memo(({ stat }) => {
  return (
    <motion.div
      className={`p-4 rounded-lg shadow-md flex items-center space-x-4 ${stat.bgColor} text-gray-800 dark:text-gray-200`}
      variants={itemVariants}
    >
      <div className="p-3 bg-white rounded-full">{stat.icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {stat.title}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="text-[22px] font-bold leading-tight">
            <CountUp
              end={stat.value}
              duration={2.5}
              separator=","
              suffix={stat.suffix || ""}
            />
          </p>
          {stat.comparison && (
            <span
              className={`flex items-center text-xs font-semibold shrink-0 ${
                stat.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              <FaArrowUp
                className={`mr-0.5 ${
                  !stat.isPositive && "transform rotate-180"
                }`}
              />
              {stat.comparison}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Thêm displayName để dễ debug
StatCard.displayName = "StatCard";

export default StatCard;
