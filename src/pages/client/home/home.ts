import { logout } from "../../../utils/auth";
import {
  obtenerCategorias,
  obtenerProductos,
} from "../../../utils/catalogo";
import { addToCart, getCart } from "../../../utils/cart";
import type { Categoria, Producto } from "../../../types/catalogo";

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;

buttonLogout?.addEventListener("click", () => {
  logout();
});

const grid = document.getElementById(
  "productGrid"
) as HTMLDivElement;

const containerCategorias = document.getElementById(
  "categoryButtons"
) as HTMLDivElement;

const inputBusqueda = document.getElementById(
  "searchInput"
) as HTMLInputElement;

const noResults = document.getElementById(
  "noResults"
) as HTMLParagraphElement;

const selectOrden = document.getElementById(
  "sortSelect"
) as HTMLSelectElement;

let productos: Producto[] = [];
let categorias: Categoria[] = [];

let categoriaActiva: number | null = null;
let busqueda = "";

let orden = "nombre-asc";

const crearCard = (producto: Producto) => {
  const card = document.createElement("article");

  card.className = "product-card";

  card.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" />
    <h3>${producto.nombre}</h3>
    <p class="descripcion">${producto.descripcion}</p>
    <p class="precio">
      $${producto.precio.toLocaleString("es-AR")}
    </p>
    <button class="agregar" data-id="${producto.id}">
      Agregar al carrito
    </button>
  `;

  return card;
};

export const renderCatalog = () => {
  grid.innerHTML = "";

  const filtrados = productos.filter((producto) => {
    const coincideCategoria =
      categoriaActiva === null ||
      producto.categoriaId === categoriaActiva;

      

    const coincideNombre = producto.nombre
      .toLowerCase()
      .includes(busqueda);

    return (
      producto.disponible &&
      !producto.eliminado &&
      coincideCategoria &&
      coincideNombre
    );
  });

  filtrados.sort((a, b) => {
  switch (orden) {
    case "nombre-asc":
      return a.nombre.localeCompare(b.nombre, "es");

    case "nombre-desc":
      return b.nombre.localeCompare(a.nombre, "es");

    case "precio-asc":
      return a.precio - b.precio;

    case "precio-desc":
      return b.precio - a.precio;

    default:
      return 0;
  }
});

  noResults.hidden = filtrados.length > 0;

  filtrados.forEach((producto) => {
    grid.appendChild(crearCard(producto));
  });
};

const renderCategoryButtons = () => {
  const categoriasActivas = categorias.filter(
    (categoria) => !categoria.eliminado
  );

  const botones = categoriasActivas
    .map(
      (categoria) => `
        <button data-cat="${categoria.id}">
          ${categoria.nombre}
        </button>
      `
    )
    .join("");

  containerCategorias.innerHTML = `
    <button data-cat="" class="active">Todo</button>
    ${botones}
  `;
};

const onCategoryClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  const btn = target.closest(
    "button[data-cat]"
  ) as HTMLButtonElement | null;

  if (!btn) {
    return;
  }

  const cat = btn.dataset.cat ?? "";

  categoriaActiva = cat === "" ? null : Number(cat);

  const botones = containerCategorias.querySelectorAll("button");

  botones.forEach((boton) => {
    boton.classList.remove("active");
  });

  btn.classList.add("active");

  renderCatalog();
};

const onBusquedaInput = () => {
  busqueda = inputBusqueda.value.trim().toLowerCase();

  renderCatalog();
};

const updateCartQty = () => {
  const qtyEl = document.getElementById("cartQty");

  const totalQty = getCart().reduce(
    (total, item) => total + item.cantidad,
    0
  );

  if (qtyEl) {
    qtyEl.textContent = String(totalQty);
  }
};

const onGridClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  const btn = target.closest(
    "button.agregar"
  ) as HTMLButtonElement | null;

  if (!btn) {
    return;
  }

  const producto = productos.find(
    (p) => p.id === Number(btn.dataset.id)
  );

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
selectOrden.addEventListener("change", () => {
  orden = selectOrden.value;
  renderCatalog();
});

async function iniciarCatalogo(): Promise<void> {
  grid.textContent = "Cargando productos...";
  noResults.hidden = true;

  try {
    const [categoriasCargadas, productosCargados] = await Promise.all([
      obtenerCategorias(),
      obtenerProductos(),
    ]);

    categorias = categoriasCargadas;
    productos = productosCargados;

    renderCategoryButtons();
    renderCatalog();
    updateCartQty();
  } catch (error: unknown) {
    console.error("Error al cargar el catálogo:", error);

    noResults.hidden = true;
    grid.textContent = "No se pudo cargar el catálogo. Intente nuevamente.";
  }
}

iniciarCatalogo();