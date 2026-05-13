const API =
  "http://localhost:3002/propiedades";

const contenedor =
  document.getElementById(
    "contenedor"
  );

const formulario =
  document.getElementById(
    "formulario"
  );

const inputBusqueda =
  document.getElementById(
    "inputBusqueda"
  );

const modalCrear =
  document.getElementById(
    "modalCrear"
  );

const modalDetalle =
  document.getElementById(
    "modalDetalle"
  );

const modalEditar =
  document.getElementById(
    "modalEditar"
  );

let propiedadActual = null;

/* OBTENER */

async function obtenerPropiedades() {

  const response =
    await fetch(API);

  const propiedades =
    await response.json();

  renderizar(propiedades);
}

/* RENDER */

function renderizar(
  propiedades
) {

  contenedor.innerHTML = "";

  propiedades.forEach(
    (propiedad) => {

      const card =
        document.createElement(
          "div"
        );

      card.classList.add(
        "card"
      );

      card.innerHTML = `
      
        <img src="${propiedad.multimedia}" />

        <div class="card-info">

          <h2>${propiedad.titulo}</h2>

          <p>${propiedad.descripcion}</p>

          <p>
            <strong>Precio:</strong>
            $${propiedad.precio}
          </p>

        </div>
      `;

      card.addEventListener(
        "click",
        () =>
          abrirDetalle(
            propiedad
          )
      );

      contenedor.appendChild(
        card
      );
    }
  );
}

/* DETALLE */

function abrirDetalle(
  propiedad
) {

  propiedadActual =
    propiedad;

  document.getElementById(
    "detalleImagen"
  ).src =
    propiedad.multimedia;

  document.getElementById(
    "detalleTitulo"
  ).textContent =
    propiedad.titulo;

  document.getElementById(
    "detalleDescripcion"
  ).textContent =
    propiedad.descripcion;

  document.getElementById(
    "detalleDireccion"
  ).textContent =
    propiedad.direccion;

  document.getElementById(
    "detallePrecio"
  ).textContent =
    propiedad.precio;

  document.getElementById(
    "detalleArrendador"
  ).textContent =
    propiedad.arrendador_id;

  modalDetalle.classList.remove(
    "oculto"
  );
}

/* CREAR */

formulario.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const nueva = {

      titulo:
        document.getElementById(
          "titulo"
        ).value,

      descripcion:
        document.getElementById(
          "descripcion"
        ).value,

      direccion:
        document.getElementById(
          "direccion"
        ).value,

      multimedia:
        document.getElementById(
          "multimedia"
        ).value,

      arrendador_id:
        Number(
          document.getElementById(
            "arrendador_id"
          ).value
        ),

      precio:
        Number(
          document.getElementById(
            "precio"
          ).value
        ),
    };

    await fetch(API, {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        nueva
      ),
    });

    formulario.reset();

    modalCrear.classList.add(
      "oculto"
    );

    obtenerPropiedades();
  }
);

/* EDITAR */

document
  .getElementById(
    "btnEditar"
  )
  .addEventListener(
    "click",
    () => {

      if (!propiedadActual) return;

      document.getElementById(
        "editTitulo"
      ).value =
        propiedadActual.titulo;

      document.getElementById(
        "editDescripcion"
      ).value =
        propiedadActual.descripcion;

      document.getElementById(
        "editDireccion"
      ).value =
        propiedadActual.direccion;

      document.getElementById(
        "editMultimedia"
      ).value =
        propiedadActual.multimedia;

      document.getElementById(
        "editArrendador"
      ).value =
        propiedadActual.arrendador_id;

      document.getElementById(
        "editPrecio"
      ).value =
        propiedadActual.precio;

      modalDetalle.classList.add(
        "oculto"
      );

      modalEditar.classList.remove(
        "oculto"
      );
    }
  );

document
  .getElementById(
    "formEditar"
  )
  .addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const actualizada = {

        titulo:
          document.getElementById(
            "editTitulo"
          ).value,

        descripcion:
          document.getElementById(
            "editDescripcion"
          ).value,

        direccion:
          document.getElementById(
            "editDireccion"
          ).value,

        multimedia:
          document.getElementById(
            "editMultimedia"
          ).value,

        arrendador_id:
          Number(
            document.getElementById(
              "editArrendador"
            ).value
          ),

        precio:
          Number(
            document.getElementById(
              "editPrecio"
            ).value
          ),
      };

      await fetch(
        `${API}/${propiedadActual.id}`,
        {

          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              actualizada
            ),
        }
      );

      document.getElementById(
        "modalEditar"
      ).classList.add(
        "oculto"
      );

      obtenerPropiedades();
    }
  );

/* ELIMINAR */

document
  .getElementById(
    "btnEliminar"
  )
  .addEventListener(
    "click",
    async () => {

      if (
        !propiedadActual
      ) return;

      await fetch(
        `${API}/${propiedadActual.id}`,
        {
          method:
            "DELETE",
        }
      );

      modalDetalle.classList.add(
        "oculto"
      );

      obtenerPropiedades();
    }
  );

/* BUSCAR */

inputBusqueda.addEventListener(
  "input",
  async () => {

    const response =
      await fetch(API);

    const propiedades =
      await response.json();

    const texto =
      inputBusqueda.value.toLowerCase();

    const filtradas =
      propiedades.filter(
        (p) =>
          p.titulo
            .toLowerCase()
            .includes(texto)
      );

    renderizar(filtradas);
  }
);

/* MODALES */

document
  .getElementById(
    "btnAbrirModal"
  )
  .addEventListener(
    "click",
    () => {

      modalCrear.classList.remove(
        "oculto"
      );
    }
  );

document
  .getElementById(
    "cerrarModalCrear"
  )
  .addEventListener(
    "click",
    () => {

      modalCrear.classList.add(
        "oculto"
      );
    }
  );

document
  .getElementById(
    "cerrarDetalle"
  )
  .addEventListener(
    "click",
    () => {

      modalDetalle.classList.add(
        "oculto"
      );
    }
  );

document
  .getElementById(
    "cerrarEditar"
  )
  .addEventListener(
    "click",
    () => {

      modalEditar.classList.add(
        "oculto"
      );
    }
  );

obtenerPropiedades();