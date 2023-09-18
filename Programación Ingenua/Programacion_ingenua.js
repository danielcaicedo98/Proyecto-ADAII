const { Reader } = require("../Middleware/Reader");


const data = Reader();
if (data) {
  const materiasJSON = data.materias;
  const estudiantesJSON = data.estudiantes;
  console.log(materiasJSON);
  console.log(estudiantesJSON);
  console.log(estudiantesJSON.estudiantes[0]);
}
