const API_BASE_URL = "http://localhost:3001/usuarios";

function switchTab(tabName) {
  // Ocultar todos los tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Mostrar tab activo
  document.getElementById(tabName).classList.add("active");
  event.target.classList.add("active");
}

function mostrarRespuesta(data, estatus) {
  const responseEl = document.getElementById("response");
  const json = JSON.stringify(data, null, 2);
  responseEl.textContent = json;
  responseEl.className = estatus === "success" ? "success" : "error";
}

function mostrarError(error) {
  const responseEl = document.getElementById("response");
  responseEl.textContent = `❌ Error: ${error}`;
  responseEl.className = "error";
}

function limpiarRespuesta() {
  document.getElementById("response").textContent =
    "Aquí aparecerán las respuestas del servidor...";
  document.getElementById("response").className = "";
}

async function crearUsuario(e) {
  e.preventDefault();
  const body = {
    nombre_completo: document.getElementById("crear-nombre").value,
    correo_electronico: document.getElementById("crear-email").value,
    contrasena: document.getElementById("crear-contrasena").value,
    cedula: document.getElementById("crear-cedula").value,
    numero_celular: document.getElementById("crear-celular").value,
    foto_perfil: document.getElementById("crear-foto").value || undefined,
    enlace_whatsapp: document.getElementById("crear-whatsapp").value || undefined,
  };

  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    mostrarRespuesta(data, response.ok ? "success" : "error");

    if (response.ok) {
      document.querySelector("#crear form").reset();
    }
  } catch (error) {
    mostrarError(error.message);
  }
}

async function obtenerUsuario(e) {
  e.preventDefault();
  const id = document.getElementById("obtener-id").value;

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const data = await response.json();
    mostrarRespuesta(data, response.ok ? "success" : "error");
  } catch (error) {
    mostrarError(error.message);
  }
}

async function actualizarUsuario(e) {
  e.preventDefault();
  const id = document.getElementById("actualizar-id").value;
  const body = {};

  const nombre = document.getElementById("actualizar-nombre").value;
  if (nombre) body.nombre_completo = nombre;

  const celular = document.getElementById("actualizar-celular").value;
  if (celular) body.numero_celular = celular;

  const foto = document.getElementById("actualizar-foto").value;
  if (foto) body.foto_perfil = foto;

  const whatsapp = document.getElementById("actualizar-whatsapp").value;
  if (whatsapp) body.enlace_whatsapp = whatsapp;

  const contrasena = document.getElementById("actualizar-contrasena").value;
  if (contrasena) body.contrasena = contrasena;

  if (Object.keys(body).length === 0) {
    mostrarError("Completa al menos un campo para actualizar");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    mostrarRespuesta(data, response.ok ? "success" : "error");

    if (response.ok) {
      document.querySelector("#actualizar form").reset();
    }
  } catch (error) {
    mostrarError(error.message);
  }
}

async function loginUsuario(e) {
  e.preventDefault();
  const body = {
    correo_electronico: document.getElementById("login-email").value,
    contrasena: document.getElementById("login-contrasena").value,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    mostrarRespuesta(data, response.ok ? "success" : "error");

    if (response.ok) {
      document.querySelector("#login form").reset();
    }
  } catch (error) {
    mostrarError(error.message);
  }
}

async function eliminarUsuario(e) {
  e.preventDefault();
  const id = document.getElementById("eliminar-id").value;

  if (!confirm("⚠️ ¿Estás seguro? Esta acción es irreversible")) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    mostrarRespuesta(data, response.ok ? "success" : "error");

    if (response.ok) {
      document.querySelector("#eliminar form").reset();
    }
  } catch (error) {
    mostrarError(error.message);
  }
}

async function healthCheck(e) {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3001/health");
    const data = await response.json();
    mostrarRespuesta(data, response.ok ? "success" : "error");
  } catch (error) {
    mostrarError(error.message);
  }
}
