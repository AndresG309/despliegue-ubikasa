const BASE = 'http://localhost:3004';
const USUARIO = "40ac6d21-11c8-4dc9-bb1a-a8b4d097987d";



let starValue = 0;
let editStarValue = 0;

const starLabels = ['', 'Muy malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];

// ── NAVEGACIÓN ───────────────────────────────────────────────
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  btn.classList.add('active');
}

// ── TOAST ────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  setTimeout(() => { el.className = 'toast'; }, 3000);
}

// ── ESTRELLAS CREAR ──────────────────────────────────────────
function setStar(val) {
  starValue = val;
  document.querySelectorAll('.star-btn:not(.edit-star)').forEach(b => {
    b.classList.toggle('lit', parseInt(b.dataset.val) <= val);
  });
  document.getElementById('star-label').textContent =
    starLabels[val] + ' (' + val + '/5)';
}

// ── ESTRELLAS EDITAR ─────────────────────────────────────────
function setStarEdit(val) {
  editStarValue = val;
  document.querySelectorAll('.edit-star').forEach(b => {
    b.classList.toggle('lit', parseInt(b.dataset.val) <= val);
  });
  document.getElementById('edit-star-label').textContent =
    starLabels[val] + ' (' + val + '/5)';
}

// ── ESTRELLAS HTML (solo lectura) ────────────────────────────
function starsHTML(n) {
  let h = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    h += `<span class="star-icon ${i <= n ? 'star-filled' : 'star-empty'}">★</span>`;
  }
  return h + '</div>';
}


// ── CREAR RESEÑA ─────────────────────────────────────────────
async function crearResena() {
  const arrendatario_id = parseInt(document.getElementById('c-arrendatario').value);
  const arrendador_id   = parseInt(document.getElementById('c-arrendador').value);
  const comentario      = document.getElementById('c-comentario').value.trim();

  if (!arrendatario_id || !arrendador_id) {
    toast('Completa los campos de ID arrendatario e ID arrendador.', 'error');
    return;

  }
  if (!starValue) {
    toast('Selecciona una calificación con las estrellas.', 'error');
    return;
  }

  const body = { arrendatario_id, arrendador_id, puntuacion: starValue };
  if (comentario) body.comentario = comentario;

  try {
    const res = await fetch(`${BASE}/resenas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json();
      toast(err.error || 'Error al crear la reseña.', 'error');
      return;
    }

    toast('Reseña publicada exitosamente.', 'success');

    // Limpiar formulario
    document.getElementById('c-arrendatario').value = '';
    document.getElementById('c-arrendador').value   = '';
    document.getElementById('c-comentario').value   = '';
    starValue = 0;
    document.getElementById('star-label').textContent = 'Selecciona una calificación';
    document.querySelectorAll('.star-btn:not(.edit-star)').forEach(b => b.classList.remove('lit'));

  } catch (e) {
    toast('No se pudo conectar al servidor. Verifica que el backend esté corriendo.', 'error');
  }
}

// ── BUSCAR ARRENDADOR ────────────────────────────────────────
async function buscarArrendador() {
  const id = parseInt(document.getElementById('a-id').value);
  if (!id) { toast('Ingresa un ID de arrendador.', 'error'); return; }

  document.getElementById('a-lista').innerHTML =
    '<div class="state-msg"><span class="icon">⏳</span>Cargando...</div>';
  document.getElementById('a-resumen').style.display = 'none';

  try {
    const [rResumen, rLista] = await Promise.all([
      fetch(`${BASE}/resenas/arrendador/${id}/resumen`),
      fetch(`${BASE}/resenas/arrendador/${id}`)
    ]);
    const resumen = await rResumen.json();
    const lista   = await rLista.json();

    // Resumen
    document.getElementById('a-resumen').style.display = 'block';
    document.getElementById('a-promedio').textContent  = resumen.promedio || '—';
    document.getElementById('a-stars-avg').innerHTML   = starsHTML(Math.round(resumen.promedio));
    document.getElementById('a-total-label').textContent =
      resumen.total_resenas + ' reseña' + (resumen.total_resenas !== 1 ? 's' : '');

    const maxCant = Math.max(...(resumen.distribucion || []).map(d => d.cantidad), 1);
    let distHTML = '';
    for (let i = 5; i >= 1; i--) {
      const entry = (resumen.distribucion || []).find(d => d.estrellas === i);
      const cnt = entry ? entry.cantidad : 0;
      const pct = Math.round((cnt / maxCant) * 100);
      distHTML += `
        <div class="dist-row">
          <span class="dist-label">${i}★</span>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="dist-count">${cnt}</span>
        </div>`;
    }
    document.getElementById('a-distribucion').innerHTML = distHTML;

    renderLista('a-lista', lista, 'arrendador');

  } catch (e) {
    toast('Error al conectar con el servidor.', 'error');
    document.getElementById('a-lista').innerHTML =
      '<div class="state-msg"><span class="icon">⚠️</span>No se pudo cargar la información.</div>';
  }
}

// ── BUSCAR ARRENDATARIO ──────────────────────────────────────
async function buscarArrendatario() {
  const id = parseInt(document.getElementById('t-id').value);
  if (!id) { toast('Ingresa un ID de arrendatario.', 'error'); return; }

  document.getElementById('t-lista').innerHTML =
    '<div class="state-msg"><span class="icon">⏳</span>Cargando...</div>';

  try {
    const res  = await fetch(`${BASE}/resenas/arrendatario/${id}`);
    const data = await res.json();
    renderLista('t-lista', data, 'arrendatario');
  } catch (e) {
    toast('Error al conectar con el servidor.', 'error');
  }
}

// ── RENDER LISTA DE RESEÑAS ──────────────────────────────────
function renderLista(containerId, lista, contexto) {
  const el = document.getElementById(containerId);

  if (!lista || lista.length === 0) {
    el.innerHTML =
      '<div class="state-msg"><span class="icon">📭</span>No se encontraron reseñas.</div>';
    return;
  }

  const sectionLabel =
    `<p class="section-title">${lista.length} reseña${lista.length !== 1 ? 's' : ''} encontrada${lista.length !== 1 ? 's' : ''}</p>`;

  const cards = lista.map(r => {
    const fecha = r.created_at
      ? new Date(r.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
      : '';

    const comentarioEscapado = (r.comentario || '').replace(/`/g, '').replace(/'/g, "\\'");

    return `
      <div class="review-card" id="review-${r.id}">
        <div class="review-header">
          <div>
            ${starsHTML(r.puntuacion)}
            <div class="review-ids" style="margin-top:6px;">
              <span class="tag tag-arrendatario">Arrendatario #${r.arrendatario_id}</span>
              <span class="tag tag-arrendador">Arrendador #${r.arrendador_id}</span>
            </div>
          </div>
          <div class="review-actions">
            <button class="btn btn-ghost btn-sm"
              onclick="abrirEditar(${r.id}, ${r.puntuacion}, '${comentarioEscapado}')">
              Editar
            </button>
            <button class="btn btn-danger btn-sm"
              onclick="eliminarResena(${r.id})">
              Eliminar
            </button>
          </div>
        </div>
        ${r.comentario
          ? `<p class="review-comment">${r.comentario}</p>`
          : `<p class="no-comment">Sin comentario.</p>`}
        <div class="review-date">${fecha}</div>
      </div>`;
  }).join('');

  el.innerHTML = sectionLabel + '<div class="review-list">' + cards + '</div>';
}

// ── MODAL EDITAR ─────────────────────────────────────────────
function abrirEditar(id, puntuacion, comentario) {
  document.getElementById('edit-id').value         = id;
  document.getElementById('edit-comentario').value = comentario;
  setStarEdit(puntuacion);
  document.getElementById('modal-editar').classList.add('open');
}

function cerrarModal() {
  document.getElementById('modal-editar').classList.remove('open');
  editStarValue = 0;
}

async function guardarEdicion() {
  const id        = parseInt(document.getElementById('edit-id').value);
  const comentario = document.getElementById('edit-comentario').value.trim();

  if (!editStarValue) {
    toast('Selecciona una calificación.', 'error');
    return;
  }

  try {
    const res = await fetch(`${BASE}/resenas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puntuacion: editStarValue, comentario })
    });

    if (!res.ok) { toast('Error al actualizar.', 'error'); return; }

    toast('Reseña actualizada.', 'success');
    cerrarModal();
    refrescarPaginaActiva();

  } catch (e) {
    toast('Error al conectar con el servidor.', 'error');
  }
}

// ── ELIMINAR ─────────────────────────────────────────────────
async function eliminarResena(id) {
  if (!confirm(`¿Estás seguro de eliminar la reseña #${id}?`)) return;

  try {
    const res = await fetch(`${BASE}/resenas/${id}`, { method: 'DELETE' });

    if (res.status === 204) {
      toast('Reseña eliminada.', 'success');
      refrescarPaginaActiva();
    } else {
      toast('Error al eliminar la reseña.', 'error');
    }
  } catch (e) {
    toast('Error al conectar con el servidor.', 'error');
  }
}

// ── REFRESCO AUTOMÁTICO ──────────────────────────────────────
function refrescarPaginaActiva() {
  const activePage = document.querySelector('.page.active').id;
  if (activePage === 'page-arrendador' && document.getElementById('a-id').value) {
    buscarArrendador();
  } else if (activePage === 'page-arrendatario' && document.getElementById('t-id').value) {
    buscarArrendatario();
  }
}

// ── EVENTOS ──────────────────────────────────────────────────
document.getElementById('a-id').addEventListener('keydown', e => {
  if (e.key === 'Enter') buscarArrendador();
});
document.getElementById('t-id').addEventListener('keydown', e => {
  if (e.key === 'Enter') buscarArrendatario();
});
document.getElementById('modal-editar').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});