export async function cargarProductos() {
  const tbody = document.querySelector('#tabla-productos tbody');
  tbody.innerHTML = '';
  try {
    const res = await fetch('/api-crud/productos');
    const productos = await res.json();
    productos.forEach(prod => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${prod.nombre}</td>
        <td>${prod.precio}</td>
        <td>${prod.stock}</td>
        <td><img src="/api/imagenes/${prod.imagen}" alt="${prod.nombre}" style="max-width:60px;"></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="4">No se pudieron cargar los productos.</td></tr>';
  }
}
