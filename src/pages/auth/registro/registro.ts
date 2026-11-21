import type { Usuario } from "../../../types/usuario";
import { obtenerUsuarios } from "../../../utils/usuarios";
import { navigate } from "../../../utils/navigate";

const form = document.querySelector<HTMLFormElement>("#form");
const inputNombre = document.querySelector<HTMLInputElement>("#nombre");
const inputEmail = document.querySelector<HTMLInputElement>("#email");
const inputPassword = document.querySelector<HTMLInputElement>("#password");

if (!form || !inputNombre || !inputEmail || !inputPassword) {
  throw new Error("No se encontraron los elementos del formulario.");
}

form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const nombre = inputNombre.value.trim();
  const mail = inputEmail.value.trim();
  const password = inputPassword.value;

  if (!nombre || !mail) {
    alert("El nombre y el correo son obligatorios.");
    return;
  }

  if (password.length < 6 || !password.trim()) {
    alert("La contraseña debe tener al menos 6 caracteres y no solo espacios.");
    return;
  }

  try {
    const usuarios = await obtenerUsuarios();

    const mailRegistrado = usuarios.some(
      (usuario) => usuario.mail.toLowerCase() === mail.toLowerCase()
    );

    if (mailRegistrado) {
      alert("Ya existe un usuario registrado con ese correo.");
      return;
    }

    const nuevoUsuario: Usuario = {
      id: Date.now(),
      nombre,
      apellido: "",
      mail,
      celular: "",
      rol: "USUARIO",
    };

    localStorage.setItem("userData", JSON.stringify(nuevoUsuario));

    navigate("/src/pages/client/home/home.html");
  } catch (error: unknown) {
    console.error("No se pudo completar el registro:", error);
    alert("No se pudo completar el registro. Intente nuevamente.");
  }
});