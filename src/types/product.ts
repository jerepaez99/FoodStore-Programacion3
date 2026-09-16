import type { ICategoria } from "./categoria";


export interface IProduct {
  id: number;
  eliminado: boolean;
  createdAt: string;
  nombre: string;
  descripcion: string;
  stock: number;
  imagen: string;
  precio: number;
  disponible: boolean;
  categorias: ICategoria[];
}

export interface ICartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}
