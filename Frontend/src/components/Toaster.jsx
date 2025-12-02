import React from "react";
import { Toaster } from "react-hot-toast";

const CustomToaster = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          whiteSpace: "nowrap",
          maxWidth: "90vw",
          padding: "12px 16px",
          color: "#374151",
          borderRadius: "8px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "#FFFFFF",
          },
          style: {
            background: "#F0FDF4",
            border: "1px solid #15803D",
          },
        },
        error: {
          style: {
            background: "#FEF2F2",
            border: "1px solid #B91C1C",
          },
        },
      }}
    />
  );
};

export default CustomToaster;
