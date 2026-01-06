export function altaProducto() {
  const form = document.getElementById('form-alta-producto');
  const mensaje = document.getElementById('mensaje');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = new FormData(form);
    try {
      const res = await fetch('/api-crud/productos', {
        method: 'POST',
        body: datos
      });
      if (res.ok) {
        mensaje.textContent = 'Producto dado de alta correctamente.';
        form.reset();
      } else {
        mensaje.textContent = 'Error al dar de alta el producto.';
      }
    } catch (err) {
      mensaje.textContent = 'Error de red.';
    }
  });
}
