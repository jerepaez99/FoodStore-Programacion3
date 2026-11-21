import { navigate } from "./utils/navigate";
import type { Usuario } from "./types/usuario";

const LOGIN = "/src/pages/auth/login/login.html";
const ADMIN_HOME = "/src/pages/admin/home/home.html";
const CLIENT_HOME = "/src/pages/client/home/home.html";

const protectRoutes = (): void => {
  const userData = localStorage.getItem("userData");

  if (!userData) {
    navigate(LOGIN);
    return;
  }

  let usuario: Usuario;

  try {
    usuario = JSON.parse(userData) as Usuario;

    if (
      !usuario ||
      (usuario.rol !== "ADMIN" && usuario.rol !== "USUARIO")
    ) {
      throw new Error("La sesión no tiene un rol válido.");
    }
  } catch {
    localStorage.removeItem("userData");
    navigate(LOGIN);
    return;
  }

  const currentPath = window.location.pathname;

  if (currentPath.includes("/admin/") && usuario.rol !== "ADMIN") {
    navigate(CLIENT_HOME);
    return;
  }

  if (
    currentPath.includes("/client/cart/") &&
    usuario.rol !== "USUARIO"
  ) {
    navigate(ADMIN_HOME);
    return;
  }

  if (currentPath === "/" || currentPath === "/index.html") {
    navigate(usuario.rol === "ADMIN" ? ADMIN_HOME : CLIENT_HOME);
  }
};

protectRoutes();