export function renderNav() {
  return `
    <nav>
      <a href="/api-crud/admin/inicio.html">Inicio</a>
      <a href="/api-crud/admin/productos/listado.html">Productos</a>
      <a href="/api-crud/admin/productos/altaProducto.html">Alta Producto</a>
    </nav>
  `;
}
export function insertNav() {
  document.body.insertAdjacentHTML('afterbegin', renderNav());
}
