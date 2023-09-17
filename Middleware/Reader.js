const path = require('path');
const fs = require('fs');

function Reader() {
  try {
    const filePath = path.join(__dirname,  'input.txt'); // Ruta relativa a input.txt
    const contenido = fs.readFileSync(filePath, 'utf-8');
    const contenido_l = contenido.split('\n');
    const numero_materias = parseInt(contenido_l[0].trim());

    // Objeto JSON para almacenar las materias
    const materiasJSON = {
      numero_materias: numero_materias,
      materias: []
    };

    // Organiza las materias que están en el archivo y las coloca en el objeto JSON
    for (let i = 1; i <= numero_materias; i++) {
      const materia = contenido_l[i].trim().split(',');
      materiasJSON.materias.push({ Nombre: materia[0], Cupos: parseInt(materia[1]) });
    }

    const numero_estudiantes = contenido_l[numero_materias + 1].trim();   
    let index = 1;   
    let posicion_a = numero_materias + 2;

    // Objeto JSON para almacenar los estudiantes
    const estudiantesJSON = {
      numero_estudiantes: numero_estudiantes,
      estudiantes: []
    };

    while (true) {
      if (index > numero_estudiantes) {
        break;
      }
      let estudiante = contenido_l[posicion_a].trim().split(',');
      let numero_materias = parseInt(estudiante[1]);
      let materias_estudiante = [];
      for (let i = posicion_a + 1; i <= numero_materias + posicion_a; i++) {
        const materia_estudiante = contenido_l[i].trim().split(',');
        materias_estudiante.push({ Nombre_materia: materia_estudiante[0], Prioridad: parseInt(materia_estudiante[1]) });
      }
      estudiantesJSON.estudiantes.push({ Nombre: estudiante[0], Numero_materias: numero_materias, Materias_estudiante: materias_estudiante });
      posicion_a = numero_materias + posicion_a + 1;
      materias_estudiante = [];
      index += 1;
    }
   
    // Devuelve los objetos JSON con los datos procesados
    return { materias: materiasJSON, estudiantes: estudiantesJSON };
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('El archivo no se encontró.');
    } else {
      console.log('Ocurrió un error: ' + error.message);
    }
    return null;
  }
}

module.exports = { Reader };
