import type { Categoria, Producto } from "../types/catalogo";

export async function obtenerCategorias(): Promise<Categoria[]> {
  const respuesta = await fetch("/data/categorias.json");

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron cargar las categorías. Código: ${respuesta.status}`
    );
  }

  const categorias: Categoria[] = await respuesta.json();

  return categorias;
}

export async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await fetch("/data/productos.json");

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron cargar los productos. Código: ${respuesta.status}`
    );
  }

  const productos: Producto[] = await respuesta.json();

  return productos;
}