import { navigate } from "./utils/navigate";
import type { IUser } from "./types/IUser";

const protectRoutes = (): void => {

    const userData = localStorage.getItem("userData")

    if (!userData) {
        navigate("/src/pages/auth/login/login.html")
        return;
    }
    
    const user = JSON.parse(userData) as IUser;

    const currentPath = window.location.pathname;

    if (
        currentPath.includes("/admin/") && user.role === "client"
    ) {
        navigate("/src/pages/client/home/home.html")
    }

    if (
        currentPath.includes("/client/") && user.role === "admin"
    ) {
        navigate("/src/pages/admin/home/home.html")
    }    

};

protectRoutes()
