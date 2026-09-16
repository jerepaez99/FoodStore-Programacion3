import { logout } from "../../../utils/auth";
import { getCart, getCartTotal, setCantidad, clearCart } from "../../../utils/cart";
import type { ICartItem } from "../../../types/product";

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

const itemList = document.getElementById("cartItems") as HTMLUListElement;
const emptyCart = document.getElementById("emptyCart") as HTMLParagraphElement;
const cartTotal = document.getElementById("cartTotal") as HTMLParagraphElement;
const clearCartButton = document.getElementById("clearCartButton") as HTMLButtonElement;

const crearItem = (item: ICartItem) => {
  const li = document.createElement("li");
  li.className = "cart-item";
  li.innerHTML = `
    <span class="nombre">${item.nombre}</span>
    <span class="precio">$${item.precio.toLocaleString("es-AR")}</span>
    <span class="cantidad">x${item.cantidad}</span>
    <button data-accion="restar" data-id="${item.id}">&minus;</button>
    <button data-accion="sumar" data-id="${item.id}">+</button>
  `;
  return li;
};

export const renderCart = () => {
  itemList.innerHTML = "";

  const items = getCart();
  const estaVacio = items.length === 0;

  emptyCart.hidden = !estaVacio;
  cartTotal.hidden = estaVacio;

  items.forEach((item) => {
    itemList.appendChild(crearItem(item));
  });

  cartTotal.textContent = `Total: $${getCartTotal().toLocaleString("es-AR")}`;
};

clearCartButton.addEventListener("click", () => {
  clearCart();
  renderCart();
});

const onItemsClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const btn = target.closest("button[data-accion]") as HTMLButtonElement | null;
  if (!btn) {
    return;
  }

  const accion = btn.dataset.accion ?? "";

  const id = Number(btn.dataset.id);

  if (Number.isNaN(id)) {
    return;
  }

  const item = getCart().find((producto) => producto.id === id);
  if (!item) {
    return;
  }

  const siguiente = accion === "sumar" ? item.cantidad + 1 : item.cantidad - 1;
  setCantidad(id, siguiente);
  renderCart();

};

itemList.addEventListener("click", onItemsClick);
renderCart();
