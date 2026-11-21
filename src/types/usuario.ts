export type RolUsuario = "ADMIN" | "USUARIO";

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    mail: string;
    celular: string;
    rol: RolUsuario;
}

export interface UsuarioConPassword extends Usuario {
    password: string;
}

