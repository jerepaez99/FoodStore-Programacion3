import type { Usuario } from "../../../types/usuario";
import { obtenerUsuarios } from "../../../utils/usuarios";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const mail = inputEmail.value.trim();
  const password = inputPassword.value;

  if (!mail || !password.trim()) {
    alert("Debe completar el correo y la contraseña.");
    return;
  }

  try {
    const usuarios = await obtenerUsuarios();

    const usuarioEncontrado = usuarios.find(
      (usuario) =>
        usuario.mail.toLowerCase() === mail.toLowerCase() &&
        usuario.password === password
    );

    if (!usuarioEncontrado) {
      alert("Correo o contraseña incorrectos.");
      return;
    }

    const usuarioSesion: Usuario = {
      id: usuarioEncontrado.id,
      nombre: usuarioEncontrado.nombre,
      apellido: usuarioEncontrado.apellido,
      mail: usuarioEncontrado.mail,
      celular: usuarioEncontrado.celular,
      rol: usuarioEncontrado.rol,
    };

    localStorage.setItem("userData", JSON.stringify(usuarioSesion));

    if (usuarioSesion.rol === "ADMIN") {
      navigate("/src/pages/admin/home/home.html");
    } else {
      navigate("/src/pages/client/home/home.html");
    }
  } catch (error: unknown) {
    console.error("No se pudo iniciar sesión:", error);
    alert("No se pudieron cargar los usuarios. Intente nuevamente.");
  }
});