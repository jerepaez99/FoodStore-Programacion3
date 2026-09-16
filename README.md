# Food Store — Carrito y Catálogo (Evaluación 1, Programación 3)

## ✍️ Descripción

Este es un proyecto de demostración creado con fines educativos. Partimos de una
aplicación multi-página construida con **Vite** y **TypeScript** (sin frameworks,
sin backend) y agregamos las funcionalidades solicitadas en la evaluación:

- **Catálogo de productos**: lista de productos renderizado dinámicamente en la
  página del cliente a partir de datos tipados.
- **Búsqueda en vivo por nombre**: se filtra mientras se escribe. Si no hay
  coincidencias, se muestra un mensaje indicándolo.
- **Filtro por categoría** desde el menú lateral, con opción de volver al
  catálogo completo.
- **Carrito de compras persistente** (en `localStorage`):
  - Agregar productos al carrito.
  - Ver nombre, precio y cantidad de cada ítem.
  - Si el producto ya está en el carrito, se aumenta su cantidad (no se
    duplica).
  - Modificar la cantidad (+ / −).
  - Calcular el total del carrito.

El carrito se guarda en `localStorage` bajo la clave `"cart"`, de modo que
sobrevive a recargas de página y a la navegación entre el catálogo y el carrito.

---

## ☕ Funcionalidades principales

| Función                        | Detalle                                                                    |
| ------------------------------ | -------------------------------------------------------------------------- |
| Catálogo dinámico              | Productos renderizados desde `src/data/data.ts`                            |
| Búsqueda por nombre (live)     | Filtrado mientras se escribe + mensaje "sin coincidencias"                 |
| Filtro por categoría           | Desde el menú lateral + botón para volver al catálogo completo             |
| Agregar al carrito             | Incrementa cantidad si ya existe, no duplica ítems                         |
| Vista del carrito              | Nombre, precio, cantidad y total                                           |
| Modificar cantidad             | Controles `+` / `−` por ítem                                               |
| Persistencia                   | `localStorage` (clave `"cart"`)                                            |

---

## 👤 Roles y páginas

La aplicación hereda la protección de rutas de la práctica base. Para esta
evaluación el foco está en la página del **cliente** (`CLIENT`):

- **Catálogo (home del cliente):** `src/pages/client/home/home.html`
- **Carrito:** `src/pages/client/cart/cart.html`

No se agrega backend ni persistencia de servidor. La autenticación se conserva
como en la práctica base (orientada a aprendizaje, ver aviso de seguridad abajo).

---

## ⚠️ ¡Importante! Nivel de Seguridad

La protección de rutas implementada **NO ES SEGURA** y no debe utilizarse en un
entorno de producción.

- **Razón**: La autenticación se basa en datos guardados en `localStorage`.
- **Riesgo**: cualquier usuario puede inspeccionar/modificar `localStorage` vía
  las herramientas de desarrollador.

Útil solo para fines de aprendizaje. La seguridad real debe ir en el **backend**.

---

## 🚀 Instalación y Uso

Se recomienda usar `pnpm`. Si no lo tenés instalado:

```bash
npm install -g pnpm
```

### Instalar dependencias

```bash
pnpm install
```

### Ejecutar el proyecto (modo desarrollo)

```bash
pnpm dev
```

La aplicación estará disponible en la URL que muestre la terminal (generalmente
`http://localhost:5173`). Navegá a la **home del cliente** para ver el catálogo,
y al **botón "Carrito"** para ver el carrito.

---

## ⚙️ ¿Cómo funciona?

### Catálogo, búsqueda y filtro (`src/pages/client/home/home.ts`)

1. Los productos provienen de `PRODUCTS` en `src/data/data.ts` (tipado con
   `IProduct`).
2. `renderCatalog()` pinta cada producto como una "card" dentro de
   `#productGrid`.
3. Se mantienen dos estados de filtrado: `categoriaActiva` (categoría o `null`)
   y `nombreQuery` (texto de búsqueda). A cada cambio se limpia el grid y se
   re-pinta la lista filtrada.
4. Si no hay productos coincidentes, se muestra el mensaje `#noResults`.
5. El botón "Agregar al carrito" llama a `addToCart(producto)` y muestra un
   feedback.

### Carrito (`src/utils/cart.ts` + `src/pages/client/cart/cart.ts`)

1. `getCart()` lee el arreglo de ítems (`ICartItem`) desde `localStorage`
   (clave `"cart"`).
2. `addToCart(producto)` busca por `id`: si existe, incrementa `cantidad`; si no,
   agrega un nuevo ítem. Guarda el resultado de vuelta en `localStorage`.
3. `setCantidad(id, cantidad)` actualiza la cantidad de un ítem (usado por los
   controles `+` / `−`).
4. `getCartTotal()` suma `precio * cantidad` de cada ítem.
5. `renderCart()` pinta la lista del carrito, muestra el mensaje de carrito
   vacío cuando corresponde, y actualiza el total.

---

## 📁 Estructura del Proyecto

```
/
├── src/
│   ├── pages/
│   │   ├── auth/               # Login / registro (práctica base)
│   │   ├── admin/              # páginas de administrador (práctica base)
│   │   └── client/             # páginas del cliente (foco de la evaluación)
│   │       ├── home/
│   │       │   ├── home.html   # Catálogo + búsqueda + filtro + carrito
│   │       │   └── home.ts     # Lógica del catálogo, búsqueda, filtro
│   │       └── cart/
│   │           ├── cart.html   # Vista del carrito
│   │           └── cart.ts     # Lógica del carrito (lista + total + +/-)
│   ├── types/
│   │   ├── product.ts          # IProduct, ICartItem
│   │   └── categoria.ts        # ICategoria
│   ├── data/
│   │   └── data.ts             # PRODUCTS, getCategories()
│   └── utils/
│       ├── auth.ts             # autenticación (práctica base)
│       ├── cart.ts             # getCart, addToCart, setCantidad, getCartTotal
│       ├── localStorage.ts
│       └── navigate.ts
├── package.json
├── vite.config.ts              # registra home + cart como páginas multi-page
└── README.md
```
