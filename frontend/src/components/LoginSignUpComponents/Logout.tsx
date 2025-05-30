import { useEffect } from "react";

const Logout = () => {
    useEffect(() => {
        return () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("userID");
            localStorage.removeItem("userRole");
            window.location.href = `/`;
        };
    });
    return "see you later alligator";
};

export default Logout;