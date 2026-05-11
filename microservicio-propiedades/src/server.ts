import app from "./app.js";

const PORT = 3002;

app.listen(PORT, () => {

  console.log(
    `Microservicio propiedades ejecutándose en puerto ${PORT}`
  );

});