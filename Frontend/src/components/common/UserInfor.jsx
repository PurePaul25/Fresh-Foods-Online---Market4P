import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function UserInfor() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = userData?.accessToken;  // Lấy token đúng chỗ

        if (!token) {
            console.error("Không có token trong localStorage");
            return;
        }

        fetch(`${API_URL}/api/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            credentials: 'include',  // nếu backend set cookie cho auth, còn không thì không cần
        })
            .then(res => res.json())
            .then(data => {
                setUser(data.user.displayName)
            })
            .catch(err => console.error("lỗi ", err));

    }, []);

    return <div>{user}</div>;
}

export default UserInfor