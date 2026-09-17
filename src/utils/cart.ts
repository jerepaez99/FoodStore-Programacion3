import type { ICartItem, IProduct } from "../types/product";

export const CART_KEY = "cart";

export const getCart = (): ICartItem[] => {
  const raw = localStorage.getItem(CART_KEY);
  try {
    return JSON.parse(raw ?? "[]") as ICartItem[];
  } catch {
    return [];
  }
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

export const addToCart = (producto: IProduct) => {
  const cart = getCart();
  const existente = cart.find((item) => item.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    cart.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const setCantidad = (id: number, cantidad: number) => {
  const cart = getCart();
  const existente = cart.find((item) => item.id === id);
  if (existente) {
    existente.cantidad = Math.max(1, cantidad);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};


export const removeFromCart = (id: number): void => {
  const cart = getCart();

  const cartActualizado = cart.filter(
    (item) => item.id !== id
  );

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cartActualizado)
  );
};

export const getCartTotal = (): number => {
  return getCart().reduce((total, item) => total + item.precio * item.cantidad, 0);
};