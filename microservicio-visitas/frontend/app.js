/* ═══════════════════════════════════════════════════════
   Ubikasa — Gestión de Visitas | Application Logic
   ═══════════════════════════════════════════════════════ */

const BASE_URL = 'http://localhost:3003';

// ── State ──
let allVisitas = [];
let lastResponse = null;

// ── DOM References ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── API Helper ──
async function apiRequest(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  updateResponsePanel(method, url, null, null, true);

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    updateResponsePanel(method, url, res.status, data, false);
    return { status: res.status, data };
  } catch (err) {
    const errorData = { success: false, message: `Error de red: ${err.message}` };
    updateResponsePanel(method, url, 0, errorData, false);
    throw err;
  }
}

// Estado del servicio check
async function checkHealth() {
  const statusDot = $('#health-dot');
  const statusText = $('#health-text');

  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();

    if (data.success) {
      statusDot.className = 'status-dot status-dot--online';
      statusText.textContent = 'Servicio activo';
    } else {
      statusDot.className = 'status-dot status-dot--offline';
      statusText.textContent = 'Error en servicio';
    }
  } catch {
    statusDot.className = 'status-dot status-dot--offline';
    statusText.textContent = 'Desconectado';
  }
}

// ── Toast Notifications ──
function showToast(message, type = 'info') {
  const container = $('#toast-container');
  const icons = { success: '✓', error: '✕', info: 'ℹ' };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type]}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast--exit');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Response Panel ──
function updateResponsePanel(method, url, statusCode, data, loading) {
  const panel = $('#response-panel');

  if (loading) {
    panel.innerHTML = `
      <div class="response-panel__header">
        <span class="response-panel__method response-panel__method--${method.toLowerCase()}">${method}</span>
        <span class="response-panel__url">${url}</span>
        <span class="response-panel__status-code" style="opacity:0.5">...</span>
      </div>
      <div class="response-panel__body">
        <div class="loading-overlay"><span class="spinner"></span> Esperando respuesta...</div>
      </div>
    `;
    return;
  }

  const isSuccess = statusCode >= 200 && statusCode < 400;
  const statusClass = isSuccess ? 'success' : 'error';
  const displayUrl = url.replace(BASE_URL, '');

  panel.innerHTML = `
    <div class="response-panel__header">
      <span class="response-panel__method response-panel__method--${method.toLowerCase()}">${method}</span>
      <span class="response-panel__url">${displayUrl}</span>
      <span class="response-panel__status-code response-panel__status-code--${statusClass}">${statusCode || 'ERR'}</span>
    </div>
    <div class="response-panel__body">${syntaxHighlight(JSON.stringify(data, null, 2))}</div>
  `;
}

// ── JSON Syntax Highlighting ──
function syntaxHighlight(json) {
  if (!json) return '';
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|\bnull\b)/g,
    (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'json-key' : 'json-string';
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

// ── Create Visit ──
async function handleCreateVisit(e) {
  e.preventDefault();

  const propiedadId = Number($('#create-propiedad-id').value);
  const arrendadorId = Number($('#create-arrendador-id').value);
  const fecha = $('#create-fecha').value;
  const hora = $('#create-hora').value;

  if (!propiedadId || !arrendadorId || !fecha || !hora) {
    showToast('Todos los campos son obligatorios', 'error');
    return;
  }

  try {
    const { status, data } = await apiRequest('POST', '/visitas', {
      propiedadId,
      arrendadorId,
      fecha,
      hora,
    });

    if (data.success) {
      showToast(data.message, 'success');
      $('#create-form').reset();
      loadAllVisitas();
    } else {
      showToast(data.message, 'error');
    }
  } catch {
    showToast('No se pudo conectar con el servidor', 'error');
  }
}

// ── Load All Visitas ──
async function loadAllVisitas() {
  const container = $('#visitas-container');
  container.innerHTML = '<div class="loading-overlay"><span class="spinner"></span> Cargando visitas...</div>';

  try {
    const { status, data } = await apiRequest('GET', '/visitas');

    if (data.success) {
      allVisitas = data.data || [];
      renderVisitas(allVisitas, container);
      $('#visitas-count').textContent = `${allVisitas.length} visita${allVisitas.length !== 1 ? 's' : ''}`;
    } else {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">⚠️</div><div class="empty-state__text">${data.message}</div></div>`;
    }
  } catch {
    container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🔌</div><div class="empty-state__text">No se pudo conectar con el servidor</div><div class="empty-state__hint">Verifica que el backend esté corriendo en el puerto 3003</div></div>';
  }
}

// ── Render Visitas ──
function renderVisitas(visitas, container) {
  if (!visitas || visitas.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📋</div><div class="empty-state__text">No hay visitas registradas</div><div class="empty-state__hint">Crea un cupo de visita usando el formulario</div></div>';
    return;
  }

  container.innerHTML = visitas.map((v, i) => {
    const status = getVisitaStatus(v);
    const statusLabel = { libre: 'Libre', reservada: 'Reservada', completada: 'Completada' };
    const fechaFormatted = formatDate(v.fecha);

    return `
      <div class="visita-card visita-card--${status}" style="animation-delay: ${i * 0.05}s" id="visita-card-${v.id}">
        <div class="visita-card__top">
          <span class="visita-card__id">#${v.id}</span>
          <span class="visita-card__status visita-card__status--${status}">${statusLabel[status]}</span>
        </div>
        <div class="visita-card__details">
          <div class="visita-card__detail">
            <span class="visita-card__detail-label">📅 Fecha</span>
            <span class="visita-card__detail-value">${fechaFormatted}</span>
          </div>
          <div class="visita-card__detail">
            <span class="visita-card__detail-label">🕐 Hora</span>
            <span class="visita-card__detail-value">${v.hora}</span>
          </div>
          <div class="visita-card__detail">
            <span class="visita-card__detail-label">🏠 Propiedad</span>
            <span class="visita-card__detail-value">${v.propiedadId}</span>
          </div>
          <div class="visita-card__detail">
            <span class="visita-card__detail-label">👤 Arrendador</span>
            <span class="visita-card__detail-value">${v.arrendadorId}</span>
          </div>
          ${v.visitanteId !== null ? `
          <div class="visita-card__detail">
            <span class="visita-card__detail-label">🧑 Visitante</span>
            <span class="visita-card__detail-value">${v.visitanteId}</span>
          </div>` : ''}
        </div>
        <div class="visita-card__actions">
          ${status === 'libre' ? `
            <button class="btn btn--success btn--sm" onclick="openAgendarModal(${v.id})" id="btn-agendar-${v.id}">📅 Agendar</button>
          ` : ''}
          ${status === 'reservada' ? `
            <button class="btn btn--warning btn--sm" onclick="handleCancelar(${v.id})" id="btn-cancelar-${v.id}">✕ Cancelar</button>
            <button class="btn btn--info btn--sm" onclick="handleCompletar(${v.id})" id="btn-completar-${v.id}">✓ Completar</button>
          ` : ''}
          <button class="btn btn--danger btn--sm" onclick="handleEliminar(${v.id})" id="btn-eliminar-${v.id}">🗑 Eliminar</button>
        </div>
      </div>
    `;
  }).join('');
}

function getVisitaStatus(v) {
  if (v.completada) return 'completada';
  if (v.visitanteId !== null) return 'reservada';
  return 'libre';
}

function formatDate(dateStr) {
  try {
    const [year, month, day] = dateStr.split('T')[0].split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
  } catch {
    return dateStr;
  }
}

// ── Agendar Modal ──
function openAgendarModal(id) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'agendar-modal';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal__title">📅 Agendar Visita #${id}</div>
      <div class="modal__description">Ingresa el ID del visitante que reservará este horario.</div>
      <div class="form-group">
        <label class="form-label" for="modal-visitante-id">Visitante ID</label>
        <input class="form-input" type="number" id="modal-visitante-id" placeholder="Ej: 5" min="1" autofocus>
      </div>
      <div class="modal__actions">
        <button class="btn btn--secondary" onclick="closeModal()">Cancelar</button>
        <button class="btn btn--primary" onclick="handleAgendar(${id})" id="btn-confirm-agendar-${id}">Confirmar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Focus input
  setTimeout(() => $('#modal-visitante-id')?.focus(), 100);

  // Enter key support
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAgendar(id);
    if (e.key === 'Escape') closeModal();
  });
}

function closeModal() {
  const modal = $('#agendar-modal');
  if (modal) modal.remove();
}

// ── Actions ──
async function handleAgendar(id) {
  const visitanteId = Number($('#modal-visitante-id')?.value);

  if (!visitanteId || visitanteId < 1) {
    showToast('Ingresa un Visitante ID válido', 'error');
    return;
  }

  try {
    const { data } = await apiRequest('PATCH', `/visitas/${id}/agendar`, { visitanteId });
    closeModal();

    if (data.success) {
      showToast(data.message, 'success');
      loadAllVisitas();
    } else {
      showToast(data.message, 'error');
    }
  } catch {
    closeModal();
    showToast('Error de conexión', 'error');
  }
}

async function handleCancelar(id) {
  try {
    const { data } = await apiRequest('PATCH', `/visitas/${id}/cancelar`);

    if (data.success) {
      showToast(data.message, 'success');
      loadAllVisitas();
    } else {
      showToast(data.message, 'error');
    }
  } catch {
    showToast('Error de conexión', 'error');
  }
}

async function handleCompletar(id) {
  try {
    const { data } = await apiRequest('PATCH', `/visitas/${id}/completar`);

    if (data.success) {
      showToast(data.message, 'success');
      loadAllVisitas();
    } else {
      showToast(data.message, 'error');
    }
  } catch {
    showToast('Error de conexión', 'error');
  }
}

async function handleEliminar(id) {
  if (!confirm(`¿Estás seguro de eliminar la visita #${id}?`)) return;

  try {
    const { data } = await apiRequest('DELETE', `/visitas/${id}`);

    if (data.success) {
      showToast(data.message, 'success');
      loadAllVisitas();
    } else {
      showToast(data.message, 'error');
    }
  } catch {
    showToast('Error de conexión', 'error');
  }
}

// ── Filter Handlers ──
async function filterById() {
  const id = Number($('#filter-id').value);
  if (!id) { showToast('Ingresa un ID válido', 'error'); return; }

  try {
    const { data } = await apiRequest('GET', `/visitas/${id}`);
    const container = $('#filter-results');

    if (data.success && data.data) {
      renderVisitas([data.data], container);
    } else {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">🔍</div><div class="empty-state__text">${data.message}</div></div>`;
    }
  } catch {
    showToast('Error de conexión', 'error');
  }
}

async function filterByPropiedad() {
  const id = Number($('#filter-propiedad').value);
  if (!id) { showToast('Ingresa un Propiedad ID válido', 'error'); return; }

  try {
    const { data } = await apiRequest('GET', `/visitas/propiedad/${id}`);
    const container = $('#filter-results');

    if (data.success) {
      renderVisitas(data.data || [], container);
    } else {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">🏠</div><div class="empty-state__text">${data.message}</div></div>`;
    }
  } catch {
    showToast('Error de conexión', 'error');
  }
}

async function filterDisponibles() {
  const id = Number($('#filter-disponibles').value);
  if (!id) { showToast('Ingresa un Propiedad ID válido', 'error'); return; }

  try {
    const { data } = await apiRequest('GET', `/visitas/propiedad/${id}/disponibles`);
    const container = $('#filter-results');

    if (data.success) {
      renderVisitas(data.data || [], container);
    } else {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">📅</div><div class="empty-state__text">${data.message}</div></div>`;
    }
  } catch {
    showToast('Error de conexión', 'error');
  }
}

async function filterByVisitante() {
  const id = Number($('#filter-visitante').value);
  if (!id) { showToast('Ingresa un Visitante ID válido', 'error'); return; }

  try {
    const { data } = await apiRequest('GET', `/visitas/visitante/${id}`);
    const container = $('#filter-results');

    if (data.success) {
      renderVisitas(data.data || [], container);
    } else {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">🧑</div><div class="empty-state__text">${data.message}</div></div>`;
    }
  } catch {
    showToast('Error de conexión', 'error');
  }
}

async function filterByArrendador() {
  const id = Number($('#filter-arrendador').value);
  if (!id) { showToast('Ingresa un Arrendador ID válido', 'error'); return; }

  try {
    const { data } = await apiRequest('GET', `/visitas/arrendador/${id}`);
    const container = $('#filter-results');

    if (data.success) {
      renderVisitas(data.data || [], container);
    } else {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">👤</div><div class="empty-state__text">${data.message}</div></div>`;
    }
  } catch {
    showToast('Error de conexión', 'error');
  }
}

function clearFilterResults() {
  $('#filter-results').innerHTML = '';
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Health check
  checkHealth();
  setInterval(checkHealth, 15000);

  // Create form
  $('#create-form').addEventListener('submit', handleCreateVisit);

  // Load visitas
  loadAllVisitas();

  // Refresh button
  $('#btn-refresh').addEventListener('click', loadAllVisitas);

  // Health button
  $('#health-status').addEventListener('click', checkHealth);

  // Filter enter keys
  $('#filter-id').addEventListener('keydown', (e) => { if (e.key === 'Enter') filterById(); });
  $('#filter-propiedad').addEventListener('keydown', (e) => { if (e.key === 'Enter') filterByPropiedad(); });
  $('#filter-disponibles').addEventListener('keydown', (e) => { if (e.key === 'Enter') filterDisponibles(); });
  $('#filter-visitante').addEventListener('keydown', (e) => { if (e.key === 'Enter') filterByVisitante(); });
  $('#filter-arrendador').addEventListener('keydown', (e) => { if (e.key === 'Enter') filterByArrendador(); });
});
