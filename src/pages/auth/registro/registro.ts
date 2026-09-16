import type { IUser } from "../../../types/IUser";

const form = document.querySelector<HTMLFormElement>("#form")
const inputEmail = document.querySelector<HTMLInputElement>("#email")
const inputPassword = document.querySelector<HTMLInputElement>("#password")

if (!form || !inputEmail || !inputPassword) {

    throw new Error("No se encontraron los elementos del formulario")

}

form.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value;

    const storedUsers = localStorage.getItem("users");

    const users: IUser[] = storedUsers
        ? (JSON.parse(storedUsers) as IUser[])
        : [];

    const emailExists = users.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
        alert("Ya existe un usuario registrado con ese email")
        return;
    }        

    const newUser: IUser = {
        email: email,
        password: password,
        role: "client",
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
});

