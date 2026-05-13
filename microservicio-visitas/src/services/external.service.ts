export const getUsuarioById = async (usuarioId: number) => {
  // TODO: Actualizar la URL cuando el microservicio de usuarios esté definido
  const URL_MICROSERVICIO_USUARIOS = "http://localhost:3001/usuarios";

  try {
    const response = await fetch(`${URL_MICROSERVICIO_USUARIOS}/${usuarioId}`);

    if (!response.ok) {
      // Si el servicio responde con error, devolvemos null o manejamos el error
      console.warn(`No se pudo obtener el usuario ${usuarioId}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    // Ajustar 'data.data' o 'data' según la estructura de respuesta del microservicio de usuarios
    return data;
  } catch (error) {
    console.error(`Error conectando con el microservicio de usuarios:`, error);
    return null; // Retornamos null temporalmente para no bloquear la visita si el ms falla
  }
};

export const getPropiedadById = async (propiedadId: number) => {
  // TODO: Actualizar la URL cuando el microservicio de propiedades esté definido
  const URL_MICROSERVICIO_PROPIEDADES = "http://localhost:3002/propiedades";

  try {
    const response = await fetch(`${URL_MICROSERVICIO_PROPIEDADES}/${propiedadId}`);

    if (!response.ok) {
      console.warn(`No se pudo obtener la propiedad ${propiedadId}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    // Ajustar 'data.data' o 'data' según la estructura de respuesta del microservicio de propiedades
    return data;
  } catch (error) {
    console.error(`Error conectando con el microservicio de propiedades:`, error);
    return null; // Retornamos null temporalmente para no bloquear la visita si el ms falla
  }
};
