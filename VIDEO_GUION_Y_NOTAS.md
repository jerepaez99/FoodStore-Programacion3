# Food Store — Guion del video + notas técnicas

> Archivo de apoyo para la entrega. Cuatro secciones:
> 1. **Guion del video** (10–15 min, con cámara) — minuto a minuto.
> 2. **Decisiones técnicas y porqués** — todo lo construido, con el "por qué" de cada una.
> 3. **Registro de pasos** — cronología 1 → 7 con sub-pasos, tal como se desarrolló.
> 4. **Checklist de entrega** (video, .zip, .txt).
>
> Este archivo es documentación de apoyo; **no es obligatorio** incluirlo en el .zip,
> ya que el README.md cubre la descripción + instrucciones que pide la consigna.

---

# 1. GUION DEL VIDEO (10–15 min, con cámara)

**Consejos generales de grabación:**
- Compartí pantalla del browser (F11 o pestaña) + cámara en esquina. Dejá visible la terminal cuando muestres los comandos.
- Antes de grabar: `pnpm install && pnpm dev` y probá una vuelta completa para que no haya sorpresas.
- Hablá lento y en voz alta las decisiones ("acá elegí X porque Y") — es lo que evalúan.
- Si te equivocás, no cortes: corregí en vivo, muestra que entendés el problema.

## Bloque 0 — apertura + arranque (min 0–2)
- Saludo, presentá el proyecto: "Food Store: catálogo de productos, carrito persistente, búsqueda y filtrado".
- Terminal: `pnpm install`, `pnpm dev`, mostrá la URL en la terminal.
- Navegá al **login**, creá/ingerás un usuario `client` (el parcial hereda la TP de rutas). Explicá en 10 segundos que la auth es de la práctica base y **no** es objeto de esta evaluación (está en README).
- Llegá a la **home del cliente** → el catálogo aparece ya renderizado.

## Bloque 1 — arquitectura (min 2–4)
Dejá ver el explorador/architectura (o el árbol del README) y contá:
- Vite **multi-página**: `vite.config.ts` registra cada HTML como entrada (`clientHome`, `clientCart`), por eso NO usamos router.
- Estructura de la consigna: `types/` (interfaces `IProduct`, `ICartItem`, `ICategoria`), `data/data.ts` (fuentes de datos), `utils/cart.ts` (lógica del carrito), `pages/client/home` y `pages/client/cart`.
- Decidí **sin framework** porque la consigna lo exige: HTML + TS puro, Vite solo sirve y transforma.

## Bloque 2 — catálogo + búsqueda + filtro (min 4–7)
Demo en vivo, narrando:
1. **Búsqueda en vivo**: escribí "yog" → ve el producto aparecer filtrado. Escribí "zzz" → aparece el mensaje **"sin coincidencias"**. Borrá → vuelve el catálogo.
   - Detrás: el input dispara `renderCatalog()` a cada `input` (no `change`), y `renderCatalog` filtra por `nombre.includes(query)` + categoría.
2. **Filtro por categoría**: clic en "Frutas" → solo frutas. En "Lácteos" → lácteos.
   - Muestra la **combinación**: con "Lácteos" activo escribí "yog" → Yogur. Con "Frutas" + "yog" → mensaje sin coincidencias. (Esto demuestra que los dos filtros son independientes y se combinan.)
3. **Todo**: volvé al catálogo completo con el botón "Todo".

## Bloque 3 — carrito (min 7–11)
1. **Agregar**: en "Manzana" pulsás "Agregar al carrito" → `alert` de confirmación + **badge del carrito** en el header pasa a 1. Agregás Manzana de nuevo → badge 2, **sin duplicar el ítem** (incrementa cantidad). Agregás Leche → badge 3.
2. **Ir al carrito**: clic en "Carrito" → lista con **nombre, precio, cantidad** (Manzana x2, Leche x1) y **Total** correcto.
3. **Modificar cantidad**: botón "+" en Leche (x1→x2), "−" en Manzana (x2→x1). El **Total se recalcula** a cada cambio.
   - Mencioná: no se va a 0 — está acotado a mínimo 1 (`Math.max(1, …)`).
4. **Persistencia** (el punto fuerte): clic en F5 o recargá → **el carrito sigue lleno**.
   - Decí explícitamente: "estoy usando `localStorage` con la clave `'cart'`; por eso los datos sobreviven a la recarga y al salir/volver a la página".

## Bloque 4 — detrás de las escenas (min 11–13)
Abrí el editor (VS Code) y mostrá los archivos, señalando una pieza clave de cada uno:
- `types/product.ts` → interfaces con prefijo `I` (`IProduct`, `ICartItem`).
- `utils/cart.ts` → `getCart` / `addToCart` / `setCantidad` / `getCartTotal` + `CART_KEY = "cart"`.
- `data/data.ts` → `PRODUCTS` y `getCategories()` (unión de categorías con `Set`).
- `pages/client/home/home.ts` → `renderCatalog()`, el listener con **delegación de eventos** por contenedor, y los dos estados de filtro (`categoriaActiva`, `nombreQuery`).
- `pages/client/cart/cart.ts` → `renderCart()` y el listener por `data-accion`.
- Mencioná los **tipos estrictos**: "sin `any` en el proyecto", tipos de import (`import type`).

## Bloque 5 — cierre (min 13–15)
- Resumí: qué hiciste y en qué orden (tipos → datos → lógica del carrito → páginas).
- Decí qué **no** incluíste y por qué: backend, autenticación completa, y estilos extensivos (style.css intencionalmente mínimo) — el parcial pide funcionalidad, no visual.
- Cierre de agradecimiento.

---

# 2. DECISIONES TÉCNICAS Y PORQUÉS

## 2.1 Arquitectura general
- **Vite multi-página, sin router ni librerías.** La consigna exige HTML + CSS + TypeScript con Vite, sin frameworks. En vez de una SPA con `react`/`vue`, cada vista (login, home, carrito) es su propio documento HTML y `vite.config.ts` los registra como entradas de `build.rollupOptions.input`. Por eso una página "navega" a la otra con un enlace `<a href>` normal, no con history router.
- **Separación estricta de capas** (exigida por la consigna):
  - `types/` → solo interfaces (`IProduct`, `ICartItem`, `ICategoria`). Sin lógica.
  - `data/data.ts` → solo fuentes de datos (`PRODUCTS`, `getCategories()`).
  - `utils/` → lógica reutilizable (`cart.ts`, `auth.ts` heredado).
  - `pages/` → render (HTML) y orquestación (TS) por vista.
  - Por qué: hace que cada pieza sea testeable y fácil de releer; el corrector puede ubicar cada responsabilidad de inmediato.

## 2.2 Modelos de datos
- **`IProduct`** tiene `id, nombre, descripcion, imagen, precio, categoria`. `id: number` es la **clave de identidad** que usamos para no duplicar en el carrito.
- **`ICartItem`** es `{ id, nombre, precio, cantidad }`. Decisión clave: es un **snapshot plano** del producto, NOT una referencia a `IProduct`.
  - *Por qué*: un ítem de carrito solo necesita lo esencial (nombre, precio, cantidad). Duplicar el `id` como clave permite buscarlo en el arreglo. Ser plano y tipado evita que alguien "le agregue" propiedades que en realidad no debe tener, y desacopla el carrito del cambio de `IProduct`.
- **`ICategoria`** = `{ nombre: string }`. Minimal por design (no hay backend que más).
- Convención de prefijo **`I`** en interfaces (exigido) y **`any` prohibido** — todo tipado; los imports de tipos usan `import type` (por `verbatimModuleSyntax`).

## 2.3 Lógica del carrito (`utils/cart.ts`)
Toda la comunicación con `localStorage` está **aislada aquí** (una sola fuente de verdad). Clave fija `CART_KEY = "cart"`.
- **`getCart()`**: lee `localStorage.getItem("cart")` y hace `JSON.parse`. Es **defensivo**: usa `raw ?? "[]"` (si está vacía, default a arreglo vacío) y envuelve en `try/catch` que devuelve `[]` si algo falla.
  - *Por qué*: el primer uso no tiene nada guardado; y `JSON.parse` lanza `SyntaxError` si el contenido está corrupto o es `""`/`undefined`. `catch` lo transforma en carrito vacío, nunca en app rota.
- **`addToCart(producto)`**: hace `getCart()`, busca por `id` con `.find`. Si existe → `cantidad += 1`; si no → `push` con `cantidad: 1`. Luego `JSON.stringify` de vuelta.
  - *Por qué*: la consigna dice "si ya está, no se duplica, se incrementa". Un solo punto de escritura garantiza consistencia.
- **`setCantidad(id, cantidad)`**: busca por `id` y asigna `cantidad`, acotado con `Math.max(1, cantidad)`.
  - *Por qué*: permite el `+`/`−` desde la vista del carrito. La cota **mínimo 1** (elegida deliberadamente) evita que el ítem desaparezca a 0 — si se quisiera eliminar, habría que borrar el ítem del arreglo, que la consigna no pide.
- **`getCartTotal()`**: `reduce` de `precio * cantidad` **por línea** (no suma precios sueltos).
  - *Por qué*: el total correcto es la suma de (precio unitario × cantidad) por cada ítem.

## 2.4 Estado y render (patrones)
- **Dos variables de estado por vista, en el cierre del módulo**: `let categoriaActiva: string | null` y `let nombreQuery: string` (en `home.ts`). Un único `renderCatalog()` las lee.
  - *Por qué*: "single source of truth". A cada cambio de UI (categoría, búsqueda) no re-escribimos lógica dispersa; solo mutamos el estado y llamamos de nuevo a `renderCatalog()`. Menos chances de estados inconsistentes.
- **`renderCatalog()`** limpia el grid con `innerHTML = ""`, filtra, y repinta. El toggle del mensaje "sin coincidencias" se hace en un solo lugar: `noResults.hidden = filtrados.length > 0`.
  - *Por qué*: el mismo principio aplica a `renderCart()` (`emptyCart.hidden = !estaVacio`). La lógica de "mostrar/ocultar cuando está vacío" vive junto al render, no repartida.
- **Filtrado combinado e independiente**:
  ```
  coincideCategoria = !categoriaActiva || producto.categoria === categoriaActiva
  coincideNombre    = producto.nombre.toLowerCase().includes(nombreQuery)
  ```
  - `!categoriaActiva` → si no hay categoría activa, coincide cualquier cosa (short-circuit).
  - `nombreQuery` y `categoriaActiva` se combinan con `&&`, así **"Frutas" + "yog" = vacío** pero **"Lácteos" + "yog" = Yogur**.
  - *Por qué*: la búsqueda NO resetea el filtro de categoría y viceversa — dos dimensiones de filtro que el usuario puede cruzar, que es lo que hace la app más cercana a un catálogo real.
- **Delegación de eventos** (en ambas vistas): en vez de un listener por cada botón de cada card, hay **UN** `addEventListener` sobre el contenedor (`#productGrid`, `#categoryButtons`, `#cartItems`) y se usa `event.target.closest("selector")` para detectar cuál control se tocó.
  - *Por qué*: el grid se re-renderiza **todo el tiempo**; si colgáramos un listener a cada botón, se perderían con cada repint y habría que re-colgarlos. Con delegación, el listener vive en el contenedor (que persiste) y los eventos "suben" por burbuja. Menos listeners, menos escapes, más mantenible.
- **`data-*` + dataset** para pasar datos al DOM: `data-id`, `data-cat`, `data-accion`.
  - *Por qué*: es la forma estándar de "pegar" metadatos en un nodo sin estados adicionales ni closures por botón. Se lee con `element.dataset.x`.
  - *Detalle de tipos*: `dataset.*` devuelve `string | undefined`. Por eso usamos `?? "default"` antes de comparar (ej. `btn.dataset.cat ?? "todos"`), y `Number(...)` + `Number.isNaN` antes de un `===` con un `id` numérico. Eso es lo que evita bugs de `undefined` vs `"0"` y la comparación `string === number` que en JS siempre daría `false`.

## 2.5 Detalles de UI
- **Formateo de precios**: `precio.toLocaleString("es-AR")` → `$1.500` (punto como separador de milares). *Por qué*: coherencia de formato y de locale argentino.
- **Feedback de "agregado al carrito"**: `alert(...)` en `home.ts`. *Por qué*: la consigna pide feedback; `alert` es la forma más directa y legible sin añadir UI custom. En la **página del carrito**, el feedback es el propio **re-render**: al pulsar `+`/`−` se vuelve a llamar `renderCart()` y el total/se ve el cambio al instante — no hace falta un `alert` ahí, sería ruido.
- **Cota de cantidad mínima = 1** (ya dicho). Alternativa descartada: permitir 0 para borrar. *Por qué*: mantiene el contrato "no se eliminan ítems desde la vista" simple y predecible.
- **`style.css` mínimo**: decisión de enfoque (funcionalidad ante todo). La app es utilizable y accesible sin CSS; se prefiere invertir el esfuerzo en la correcta lógica y estructura que la consigna evalúa.

## 2.6 Calidad y convenciones
- **Sin `any` en `src/`** — verificado. Tipado estricto (`"strict"`, `noUnusedLocals`, `verbatimModuleSyntax`, `erasableSyntaxOnly` que impide `enum`/`namespace`).
- **Compila**: `pnpm exec tsc --noEmit` verde.
- **Demostraciones en vivo (Node `--experimental-webstorage`)** para validar `cart.ts`, el filtrado de `home.ts` y el render de `cart.ts`, antes de confiarlo al browser.
- **Estructura de la consigna respetada al 100%** y `vite.config.ts` ya registraba la página del carrito como entrada multi-página.

---

# 3. REGISTRO DE PASOS (orden cronológico, 1 → 7)

Cronología exacta de cómo se construyó el parcial. Cada paso se validó
(`tsc` verde + demo en Node con `--experimental-webstorage`) antes de pasar al
siguiente.

## Paso 1 — Tipos (fundación)
Dejar claras las "formas" de los datos antes de escribir una línea de lógica.
- **1.1 `IProduct`** — `{ id, nombre, descripcion, imagen, precio, categoria }`. `id: number` es la clave de identidad. *Por qué:* todo lo demás (no duplicar en carrito, filtrar) se apoya en este modelo.
- **1.2 `ICartItem`** — `{ id, nombre, precio, cantidad }`. *Por qué:* ítem de carrito como **snapshot plano** (no referencia a `IProduct`): solo lleva lo que el carrito necesita y se desacopla de cambios en `IProduct`.
- **1.3 `ICategoria`** — `{ nombre: string }`. *Por qué:* mínima; hay que tipar la respuesta de `getCategories()` (no `any`).
- **1.4 Limpieza** — se eliminaron los placeholders vacíos `types/IProduct.ts` y `types/ICategoria.ts` (mal nombrados) y se usaron los nombres que pide la consigna: `product.ts` / `categoria.ts`. *Por qué:* una sola fuente de verdad por tipo, con la nomenclatura exigida.

## Paso 2 — Datos (fuentes)
Dar contenido real al catálogo tipado.
- **2.1 `PRODUCTS`** en `data/data.ts` — 8 productos en 4 categorías (Frutas, Verduras, Lácteos, Panadería). *Por qué:* fuente única y tipada; la home y el carrito leen de acá, no repiten datos.
- **2.2 `getCategories()`** — usa un `Set<string>` para extraer las categorías **únicas** (de primera aparición). *Por qué:* evita repeticiones y es O(n).
- **2.3 Imágenes placeholder** — 8 PNG en `public/img/` (generados con Pillow). *Por qué:* la app es funcional y con imagen; se pueden reemplazar por fotos reales sin tocar código.

## Paso 3 — Lógica del carrito (`utils/cart.ts`)
Aislar TODA la comunicación con `localStorage` en un solo módulo (clave `"cart"`).
- **3.1 `CART_KEY`** + imports de tipos (`ICartItem`, `IProduct` vía `import type`). *Por qué:* una sola constante de clave y tipos correctos desde el arranque.
- **3.2 `getCart()`** — `raw ?? "[]"` + `try/catch` → `[]`. *Por qué:* primer uso vacío y JSON corrupto nunca rompen la app.
- **3.3 `addToCart(producto)`** — `find` por `id`: si existe `cantidad += 1`, si no `push` con `cantidad: 1`. *Por qué:* cumple "incrementa, no duplica".
- **3.4 `setCantidad(id, cantidad)`** — asigna con `Math.max(1, cantidad)`. *Por qué:* habilita `+`/`−`; la cota mínima 1 evita eliminar el ítem (la consigna no pide borrar).
- **3.5 `getCartTotal()`** — `reduce` de `precio * cantidad` **por línea**. *Por qué:* el total correcto es la suma de (precio × cantidad) por ítem, no la suma de precios sueltos.
- **3.6 Demo en vivo (Node)** — validar antes del browser: no duplicar, incrementar, clamp a 1, total exacto.

## Paso 4 — Catálogo (`pages/client/home`)
- **4.1 `home.html`** (estático) — sidebar con `#searchInput` + `#categoryButtons`, `#noResults` (`hidden`), grid `#productGrid`, link `#cartLink` con badge `#cartQty`. *Por qué:* el esqueleto/IDs ya existen, así el TS solo enlaza.
- **4.2 `renderCatalog()`** — limpia el grid, filtra, pinta cards con `crearCard()`. *Por qué:* render único y puramente derivado del estado.
- **4.3 Filtro por categoría** — botones desde `getCategories()` + botón "Todo" (`data-cat`), estado `categoriaActiva: string | null` (short-circuit `!categoriaActiva || ...`). *Por qué:* `null` = "sin filtro" y combina limpio con búsqueda.
- **4.4 Búsqueda en vivo** — listener en `input` (no `change`), `nombreQuery = value.trim().toLowerCase()`; toggle `#noResults.hidden = filtrados.length > 0`. *Por qué:* filtra mientras se escribe; los dos filtros son **independientes y se combinan** (`&&`).
- **4.5 Agregar al carrito** — listener delegado sobre `#productGrid` (`closest("button.agregar")` + `data-id`), `addToCart`, `alert` de feedback, y actualización del **badge** (`#cartQty`) vía `reduce` de cantidades. *Por qué:* un solo listener sobrevive a los re-renders; feedback visible obligatorio por consigna.
- **4.6 Demos en vivo (Node 24)** — `PRODUCTS.filter()` para 4.3 y combinación nombre + categoría para 4.4 (8 casos OK / validando "Frutas+yog = vacío", "Lácteos+yog = Yogur").
- **4.7 Limpieza** — se eliminaron los placeholders vacíos en `src/pages/client/home/cart/` (mal ubicados); la consigna exige que el carrito viva en `src/pages/client/`.

## Paso 5 — Vista del carrito (`pages/client/cart`)
- **5.1 `cart.html`** — `#emptyCart` (`hidden`), `#cartItems`, `#cartTotal`. *Por qué:* mismo esquema ID→TS que en la home.
- **5.2 `renderCart()`** — toggle `#emptyCart`/`#cartTotal` según `estaVacio`, pinta `crearItem()` por ítem y setea `cartTotal.textContent = "Total: $" + getCartTotal().toLocaleString("es-AR")`. *Por qué:* la lógica de vacío/total vive junto al render, como en `renderCatalog`.
- **5.3 `+`/`−`** — **delegación de eventos** sobre `#cartItems` (`closest("button[data-accion]")`), `data-accion` = `"sumar"|"restar"` + `data-id` → `setCantidad(id, cantidad ∓ 1)` → re-render. *Por qué:* un solo listener sobrevive a los re-renders; `+`/`−` comparten lógica con una variable `siguiente`.
- **5.4 Demo en vivo (Node 24)** — 6 escenas: carrito vacío → agregar Manzana/Leche → incrementar sin duplicar → `+` → `−` → **clamp** al mínimo 1 → total correcto.
- **5.5 Verificación en browser real** — probó el usuario: catálogo → carrito → `+`/`−` → recargar → persistencia. ✔

## Paso 6 — Acabado (polish)
- **6.1 Estilos** — se **optó por omitir** por decisión del usuario; `style.css` se queda vacío. *Por qué:* el parcial evalúa funcionalidad/estructura, no visual; la app funciona accesible sin CSS.
- **6.2 README** — reescrito para el Food Store: descripción, tabla de funciones, aviso de seguridad heredado, `pnpm install` / `pnpm dev`, "cómo funciona" (catálogo + carrito) y estructura. *Por qué:* la consigna exige una descripción + instrucciones de ejecución.
- **6.3 Checklist de rubro (PASS)** — `tsc --noEmit` verde · 0 `any` en `src/` · 9 archivos obligatorios presentes (types, data, utils/cart, home/{html,ts}, cart/{html,ts}, style.css) · clave `localStorage` = `"cart"`.
- **6.4 Guion + notas** — este mismo archivo (`VIDEO_GUION_Y_NOTAS.md`).

## Paso 7 — Entrega (la hace el usuario)
- **7.1** Video 10–15 min con cámara, siguiendo el guion (sección 1).
- **7.2** `.zip` del proyecto (ideal sin `node_modules`).
- **7.3** `.txt` con el **link** del video.
- **7.4** Verificar que el `.zip` + `.txt` estén en la carpeta de entrega y el link funcione.

---

## 4. CHECKLIST DE ENTREGA
- [ ] Video 10–15 min con cámara (guion arriba) → subido y link copiado.
- [ ] `README.md` con descripción + instrucciones (ya está).
- [ ] `.txt` con el **link del video**.
- [ ] **`.zip`** del proyecto (idealmente sin `node_modules`).
  - Comando de referencia (PowerShell, desde la carpeta del proyecto):
    ```
    Compress-Archive -Path . -DestinationPath ..\FoodStore_Parcial.zip
    ```
    (Si querés excluir `node_modules`, comprimir solo las carpetas/`src`, `public`, `*.ts`, `*.json`, `*.md`, `*.pdf` o usar `git archive`.)
- [ ] Revisar que el .txt y el .zip estén en la carpeta de entrega y que el link funcione.
