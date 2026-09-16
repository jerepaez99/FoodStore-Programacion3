import { logout } from "../../../utils/auth";
import { PRODUCTS, getCategories } from "../../../data/data";
import { addToCart, getCart } from "../../../utils/cart";
import type { IProduct } from "../../../types/product";

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

const grid = document.getElementById("productGrid") as HTMLDivElement;

let categoriaActiva: number | null = null;

let busqueda = "";

const crearCard = (producto: IProduct) => {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h3>${producto.nombre}</h3>
    <p class="descripcion">${producto.descripcion}</p>
    <p class="precio">$${producto.precio.toLocaleString("es-AR")}</p>
    <button class="agregar" data-id="${producto.id}">Agregar al carrito</button>
  `;
  return card;
};

export const renderCatalog = () => {
  grid.innerHTML = "";

  const filtrados = PRODUCTS.filter((producto) => {
    const coincideCategoria =
      !categoriaActiva || producto.categorias.some(categoria => categoria.id === categoriaActiva)
    const coincideNombre = producto
      .nombre.toLowerCase()
      .includes(busqueda);
    return coincideCategoria && coincideNombre;
  });

  const noResults = document.getElementById("noResults") as HTMLParagraphElement;
  noResults.hidden = filtrados.length > 0;

  filtrados.forEach((producto) => {
    grid.appendChild(crearCard(producto));
  });
};

const containerCategorias = document.getElementById(
  "categoryButtons"
) as HTMLDivElement;

const renderCategoryButtons = () => {
  const categorias = getCategories();

  const botones = categorias
    .map(
      (categoria) =>
        `<button data-cat="${categoria.id}">${categoria.nombre}</button>`
    )
    .join("");

  containerCategorias.innerHTML = `
    <button data-cat="" class="active">Todo</button>
    ${botones}
  `;
};

const onCategoryClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const btn = target.closest("button[data-cat]") as HTMLButtonElement | null;
  if (!btn) {
    return;
  }

  const cat = btn.dataset.cat ?? "";
  categoriaActiva = cat === "" ? null : parseInt(cat);

  const botones = containerCategorias.querySelectorAll("button");

  botones.forEach((boton) => {
    boton.classList.remove("active");
  });

  btn.classList.add("active");

  renderCatalog();
};

const inputBusqueda = document.getElementById(
  "searchInput"
) as HTMLInputElement;

const onBusquedaInput = () => {
  busqueda = inputBusqueda.value.trim().toLowerCase();
  renderCatalog();
};

const updateCartQty = () => {
  const qtyEl = document.getElementById("cartQty");
  const totalQty = getCart().reduce((n, item) => n + item.cantidad, 0);
  if (qtyEl) {
    qtyEl.textContent = String(totalQty);
  }
};

const onGridClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const btn = target.closest("button.agregar");
  if (!btn) {
    return;
  }

  const producto = PRODUCTS.find((p) => p.id === Number((btn as HTMLButtonElement).dataset.id));
  console.log(producto)
  if (!producto) {
    return;
  }
  
  addToCart(producto);
  updateCartQty();
  alert(`${producto.nombre} agregado al carrito.`);
};

grid.addEventListener("click", onGridClick);
containerCategorias.addEventListener("click", onCategoryClick);
inputBusqueda.addEventListener("input", onBusquedaInput);
renderCatalog();
renderCategoryButtons();
updateCartQty();
