import type { IUser } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;


form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const valueEmail = inputEmail.value.trim();
  const valuePassword = inputPassword.value;

  const storedUsers = localStorage.getItem("users");

  if (!storedUsers) {
    alert("No hay usuarios registrados");
    return;
  }

  const users = JSON.parse(storedUsers) as IUser[]

  const foundUser = users.find(
    (user) =>
      user.email.toLowerCase() === valueEmail.toLowerCase() &&
      user.password === valuePassword
  );

  if (!foundUser) {
    alert("Email o contraseña incorrectos")
    return;
  }

  localStorage.setItem("userData", JSON.stringify(foundUser));
    
  if (foundUser.role === "admin") {
      navigate("/src/pages/admin/home/home.html");
    } else if (foundUser.role === "client") {
      navigate("/src/pages/client/home/home.html");
    }  

});
