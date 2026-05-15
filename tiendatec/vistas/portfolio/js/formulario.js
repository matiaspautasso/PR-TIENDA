// Refs
const fId          = () => document.getElementById('f-id');
const fNombre      = () => document.getElementById('f-nombre');
const fDescripcion = () => document.getElementById('f-descripcion');
const fPrecio      = () => document.getElementById('f-precio');
const fStock       = () => document.getElementById('f-stock');
const fCategoria   = () => document.getElementById('f-categoria');
const fImagen      = () => document.getElementById('f-imagen');
const fEstado      = () => document.getElementById('f-estado');

function setError(id, msg) {
    const el = document.getElementById(`err-${id}`);
    if (el) el.textContent = msg;
}
function clearError(id) {
    const el = document.getElementById(`err-${id}`);
    if (el) el.textContent = '';
}

export function validarFormulario() {
    let valido = true;

    clearError('nombre'); clearError('precio'); clearError('stock'); clearError('estado');

    const nombre = fNombre().value.trim();
    if (!nombre) {
        setError('nombre', 'El nombre es obligatorio.');
        valido = false;
    }

    const precio = parseFloat(fPrecio().value);
    if (!fPrecio().value || isNaN(precio) || precio <= 0) {
        setError('precio', 'El precio debe ser mayor a 0.');
        valido = false;
    }

    const stock = parseInt(fStock().value);
    if (fStock().value === '' || isNaN(stock) || stock < 0) {
        setError('stock', 'El stock debe ser 0 o mayor.');
        valido = false;
    }

    const estado = fEstado().value;
    if (!['activo', 'inactivo'].includes(estado)) {
        setError('estado', 'Estado inválido.');
        valido = false;
    }

    return valido;
}

export function limpiarFormulario() {
    fId().value          = '';
    fNombre().value      = '';
    fDescripcion().value = '';
    fPrecio().value      = '';
    fStock().value       = '';
    fCategoria().value   = '';
    fEstado().value      = 'activo';
    fImagen().value      = '';
    ['nombre', 'precio', 'stock', 'estado'].forEach(clearError);
}

export function cargarFormulario(producto) {
    fId().value          = producto.producto_id;
    fNombre().value      = producto.nombre        ?? '';
    fDescripcion().value = producto.descripcion   ?? '';
    fPrecio().value      = producto.precio        ?? '';
    fStock().value       = producto.stock         ?? '';
    fCategoria().value   = producto.categoria     ?? '';
    fEstado().value      = producto.estado        ?? 'activo';
    fImagen().value      = '';
}

export function construirFormData() {
    const fd = new FormData();
    fd.append('nombre',      fNombre().value.trim());
    fd.append('descripcion', fDescripcion().value.trim());
    fd.append('precio',      fPrecio().value);
    fd.append('stock',       fStock().value);
    fd.append('categoria',   fCategoria().value.trim());
    fd.append('estado',      fEstado().value);
    const archivo = fImagen().files[0];
    if (archivo) fd.append('imagen', archivo);
    return fd;
}
