const { readData } = require("../Middleware/Reader.js");

const data = readData();
if (data) {
  const materiasJSON = data.materias;
  const estudiantesJSON = data.estudiantes;
  console.log(materiasJSON);
  console.log(estudiantesJSON);
}
