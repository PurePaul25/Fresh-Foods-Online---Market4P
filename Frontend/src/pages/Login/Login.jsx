import React from "react";
import CustomToaster from "../../components/Toaster";
import LoginCard from "../../components/Login/LoginCard";

function Login() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <LoginCard />

      <CustomToaster />
    </div>
  );
}

export default Login;
