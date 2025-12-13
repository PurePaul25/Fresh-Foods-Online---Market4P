import { useEffect, useState } from "react";

function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser.displayName || parsedUser.name || "User");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return <div>{user || "Guest"}</div>;
}

export default UserInfo;
