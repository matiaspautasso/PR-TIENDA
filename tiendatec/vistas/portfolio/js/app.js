import { validarFormulario, limpiarFormulario, cargarFormulario, construirFormData } from './formulario.js';

const API = '/api/productos';
let productos = [];

// ── DOM refs ──────────────────────────────────────────────────────────────────
const grilla          = document.getElementById('grilla');
const feedback        = document.getElementById('feedback');
const buscar          = document.getElementById('buscar');
const filtroCat       = document.getElementById('filtro-categoria');
const filtroEstado    = document.getElementById('filtro-estado');
const contador        = document.getElementById('contador');
const overlay         = document.getElementById('overlay');
const overlayDetalle  = document.getElementById('overlay-detalle');
const panelTitulo     = document.getElementById('panel-titulo');
const formProducto    = document.getElementById('form-producto');
const hintImagen      = document.getElementById('hint-imagen');
const detalleContenido = document.getElementById('detalle-contenido');

// ── Feedback ──────────────────────────────────────────────────────────────────
function mostrarFeedback(msg, tipo = 'exito') {
    feedback.textContent = msg;
    feedback.className = `feedback ${tipo}`;
    clearTimeout(mostrarFeedback._t);
    mostrarFeedback._t = setTimeout(() => feedback.classList.add('hidden'), 4000);
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────
async function apiFetch(url, opciones = {}) {
    const res = await fetch(url, opciones);
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json };
}

// ── Cargar productos ──────────────────────────────────────────────────────────
export async function cargarProductos() {
    const { ok, data } = await apiFetch(API);
    if (!ok) { mostrarFeedback('No se pudieron cargar los productos.', 'error'); return; }
    productos = data.data || [];
    actualizarCategoriasSelect();
    aplicarFiltros();
}

function actualizarCategoriasSelect() {
    const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort();
    const actual = filtroCat.value;
    filtroCat.innerHTML = '<option value="">Todas las categorías</option>' +
        cats.map(c => `<option value="${c}"${c === actual ? ' selected' : ''}>${c}</option>`).join('');
}

// ── Filtros ───────────────────────────────────────────────────────────────────
function aplicarFiltros() {
    const txt = buscar.value.toLowerCase();
    const cat = filtroCat.value;
    const est = filtroEstado.value;
    const filtrados = productos.filter(p =>
        (!txt || p.nombre.toLowerCase().includes(txt)) &&
        (!cat || p.categoria === cat) &&
        (!est || p.estado === est)
    );
    contador.textContent = `${filtrados.length} producto${filtrados.length !== 1 ? 's' : ''}`;
    renderizarGrilla(filtrados);
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderizarGrilla(lista) {
    if (lista.length === 0) {
        grilla.innerHTML = '<p class="empty-state">No hay productos disponibles.</p>';
        return;
    }
    grilla.innerHTML = lista.map(p => `
        <article class="card" data-id="${p.producto_id}">
            <div class="card-img">
                <img src="/api/imagenes/${p.imagen}" alt="${escHtml(p.nombre)}"
                     onerror="this.style.display='none'">
                <span class="badge badge-${p.estado}">${p.estado}</span>
            </div>
            <div class="card-body">
                <p class="card-nombre">${escHtml(p.nombre)}</p>
                <p class="card-categoria">${escHtml(p.categoria || '—')}</p>
                <div class="card-meta">
                    <span class="card-precio">$${Number(p.precio).toLocaleString('es-AR')}</span>
                    <span class="card-stock">Stock: ${p.stock}</span>
                </div>
            </div>
            <div class="card-acciones">
                <button class="btn btn-ghost" onclick="window._verDetalle(${p.producto_id})">Ver</button>
                <button class="btn btn-secondary" onclick="window._editarProducto(${p.producto_id})">Editar</button>
                <button class="btn btn-danger" onclick="window._eliminarProducto(${p.producto_id},'${escHtml(p.nombre)}')">Eliminar</button>
            </div>
        </article>
    `).join('');
}

function escHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c =>
        ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ── Panel formulario ──────────────────────────────────────────────────────────
function abrirPanel(titulo) {
    panelTitulo.textContent = titulo;
    overlay.classList.remove('hidden');
}
function cerrarPanel() {
    overlay.classList.add('hidden');
    limpiarFormulario();
    hintImagen.textContent = '';
}

// ── CRUD ──────────────────────────────────────────────────────────────────────
window._editarProducto = async (id) => {
    const { ok, data } = await apiFetch(`${API}/${id}`);
    if (!ok) { mostrarFeedback('No se pudo cargar el producto.', 'error'); return; }
    cargarFormulario(data.data);
    hintImagen.textContent = data.data.imagen ? `Actual: ${data.data.imagen}` : '';
    abrirPanel('Editar producto');
};

window._verDetalle = async (id) => {
    const { ok, data } = await apiFetch(`${API}/${id}`);
    if (!ok) { mostrarFeedback('No se pudo cargar el producto.', 'error'); return; }
    const p = data.data;
    detalleContenido.innerHTML = `
        ${p.imagen ? `<img src="/api/imagenes/${p.imagen}" alt="${escHtml(p.nombre)}" class="detalle-img">` : ''}
        <div class="detalle-grid">
            <div class="detalle-campo full">
                <span class="detalle-label">Nombre</span>
                <span class="detalle-valor">${escHtml(p.nombre)}</span>
            </div>
            <div class="detalle-campo full">
                <span class="detalle-label">Descripción</span>
                <span class="detalle-valor">${escHtml(p.descripcion || '—')}</span>
            </div>
            <div class="detalle-campo">
                <span class="detalle-label">Precio</span>
                <span class="detalle-valor">$${Number(p.precio).toLocaleString('es-AR')}</span>
            </div>
            <div class="detalle-campo">
                <span class="detalle-label">Stock</span>
                <span class="detalle-valor">${p.stock}</span>
            </div>
            <div class="detalle-campo">
                <span class="detalle-label">Categoría</span>
                <span class="detalle-valor">${escHtml(p.categoria || '—')}</span>
            </div>
            <div class="detalle-campo">
                <span class="detalle-label">Estado</span>
                <span class="detalle-valor"><span class="badge badge-${p.estado}">${p.estado}</span></span>
            </div>
        </div>
        <div class="detalle-acciones">
            <button class="btn btn-secondary" onclick="window._editarProducto(${p.producto_id}); document.getElementById('overlay-detalle').classList.add('hidden')">Editar</button>
        </div>
    `;
    overlayDetalle.classList.remove('hidden');
};

window._eliminarProducto = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    const { ok, data } = await apiFetch(`${API}/${id}`, { method: 'DELETE' });
    if (ok) {
        mostrarFeedback(data.mensaje || 'Producto eliminado.');
        await cargarProductos();
    } else {
        mostrarFeedback(data.mensaje || 'No se pudo eliminar.', 'error');
    }
};

// ── Submit formulario ─────────────────────────────────────────────────────────
formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const id = document.getElementById('f-id').value;
    const esEdicion = Boolean(id);
    const formData = construirFormData();

    const url    = esEdicion ? `${API}/${id}` : API;
    const metodo = esEdicion ? 'PUT' : 'POST';

    const { ok, data } = await apiFetch(url, { method: metodo, body: formData });
    if (ok) {
        mostrarFeedback(data.mensaje || (esEdicion ? 'Producto modificado.' : 'Producto creado.'));
        cerrarPanel();
        await cargarProductos();
    } else {
        mostrarFeedback(data.mensaje || 'Error al guardar.', 'error');
    }
});

// ── Eventos ───────────────────────────────────────────────────────────────────
document.getElementById('btn-nuevo').addEventListener('click', () => {
    limpiarFormulario();
    abrirPanel('Nuevo producto');
});
document.getElementById('btn-cerrar-panel').addEventListener('click', cerrarPanel);
document.getElementById('btn-cancelar').addEventListener('click', cerrarPanel);
document.getElementById('btn-cerrar-detalle').addEventListener('click', () =>
    overlayDetalle.classList.add('hidden'));
overlay.addEventListener('click', e => { if (e.target === overlay) cerrarPanel(); });
overlayDetalle.addEventListener('click', e => { if (e.target === overlayDetalle) overlayDetalle.classList.add('hidden'); });
buscar.addEventListener('input', aplicarFiltros);
filtroCat.addEventListener('change', aplicarFiltros);
filtroEstado.addEventListener('change', aplicarFiltros);

// ── Init ──────────────────────────────────────────────────────────────────────
cargarProductos();
