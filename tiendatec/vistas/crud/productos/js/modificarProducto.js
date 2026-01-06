export function modificarProducto() {
  const form = document.getElementById('form-modificar-producto');
  const mensaje = document.getElementById('mensaje');
  // Suponiendo que el producto a modificar se pasa por querystring ?id=123
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    mensaje.textContent = 'No se especificó producto a modificar.';
    form.style.display = 'none';
    return;
  }
  // Cargar datos actuales
  fetch(`/api-crud/productos/${id}`)
    .then(res => res.json())
    .then(productos => {
      if (productos.length > 0) {
        const prod = productos[0];
        form.nombre.value = prod.nombre;
        form.precio.value = prod.precio;
        form.stock.value = prod.stock;
      } else {
        mensaje.textContent = 'Producto no encontrado.';
        form.style.display = 'none';
      }
    });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = new FormData(form);
    try {
      const res = await fetch(`/api-crud/productos/${id}`, {
        method: 'PUT',
        body: datos
      });
      if (res.ok) {
        mensaje.textContent = 'Producto modificado correctamente.';
      } else {
        mensaje.textContent = 'Error al modificar el producto.';
      }
    } catch (err) {
      mensaje.textContent = 'Error de red.';
    }
  });
}
