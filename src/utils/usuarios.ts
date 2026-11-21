import type { UsuarioConPassword } from "../types/usuario";

export async function obtenerUsuarios(): Promise<UsuarioConPassword[]> {
  const respuesta = await fetch("/data/usuarios.json");

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron cargar los usuarios. Código: ${respuesta.status}`
    );
  }

  const usuarios: UsuarioConPassword[] = await respuesta.json();

  return usuarios;
}