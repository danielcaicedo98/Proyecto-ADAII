const k = 2; // Número de materias disponibles
const r = 2; // Número de estudiantes
const conjuntoP = [1, 2, 3, 4, 5];
const M = [
  { codigo: "Math", cupo: 3 },
  { codigo: "Fisica", cupo: 1 },
];
const E = [
  { nombre: "Juan", solicitud: [{ codigo: "Math", prioridad: 3}, { codigo: "Fisica", prioridad: 4 }] },
  { nombre: "Nata", solicitud: [{ codigo: "Math", prioridad: 4 }, { codigo: "Fisica", prioridad: 3 }] },
];
const S=[
  {nombre: "Juan", materias: [ { codigo: "Fisica"}] },
  {nombre: "Nata", materias: [ ]}
];

function materiasAsignadas(solucion){
  return solucion.materias.length;
}

function materiasSolicitadas(solicitud){
  return solicitud.solicitud.length;
}
function prioridadSolicitada(solicitud) {
  let sumaPrioridades = 0;
  for (let i = 0; i < solicitud.solicitud.length; i++) {
    sumaPrioridades += solicitud.solicitud[i].prioridad;
  }
  return sumaPrioridades;
}

function obtenerPrioridadAsignada(solicitud, solucion) {
  let prioridadTotal=0;
  for (let i = 0; i < solucion.materias.length; i++) {
    const materiaAsignada = solucion.materias[i];
    const solicitudMateria = solicitud.solicitud.find(s => s.codigo === materiaAsignada.codigo);
    if (solicitudMateria) {
      prioridadTotal += solicitudMateria.prioridad;
    }
  }
  return prioridadTotal;
}
function prioridadNoAsigada(solicitud, solucion){
  return prioridadSolicitada(solicitud)-obtenerPrioridadAsignada(solicitud, solucion);
}

function fj(materiasAsig, materiasSoli, prioriSoliNoAsig, prioridadSolicitada){
  return (1-(materiasAsig/materiasSoli))*(prioriSoliNoAsig/prioridadSolicitada) 
}

function calcularInsatisfaccion(problema, solucion) {
  let insatisfaccionTotal = 0;

  for (let i = 0; i < solucion.length ; i++) {
    const estudiante = solucion[i];
    const solicitudEstudiante = problema[i];

    if (solicitudEstudiante) {
      const asignadas = materiasAsignadas(estudiante);
      const solicitadas = materiasSolicitadas(solicitudEstudiante);
      const prioridadSolicitadaEstudiante = prioridadSolicitada(solicitudEstudiante);
      const prioridadNoAsignadaEstudiante = prioridadNoAsigada(solicitudEstudiante, estudiante);
      const insatisfaccionEstudiante = fj(asignadas, solicitadas, prioridadNoAsignadaEstudiante, prioridadSolicitadaEstudiante);
      // Agregar la insatisfacción individual a la insatisfacción total
      insatisfaccionTotal += insatisfaccionEstudiante;
    }
  }
  return insatisfaccionTotal;
}

/************************/

//retorna si en el vertor de cupos aun hay cupos
function hayCupos (cupos){
  return cupos.every(numero => numero !== 0);
}
//retorna si un estudiante dado solicitó una materia
function solicitoMateria(estudiante, codigoMateria) {
  for (let i = 0; i < estudiante.solicitud.length; i++) {
    if (estudiante.solicitud[i].codigo === codigoMateria) {
      return true;
    }
  }
  return false;
}

//crea una solución inicial, en la que aun no se le han asignado materias a ningun estudiante
function inicializarSolucion(E){
  // Crear un nuevo arreglo para almacenar la solución
  const solucion = [];
  // Recorrer el arreglo de solicitudes E
  for (const estudiante of E) {
    const nombre = estudiante.nombre;
    const materias = [];
      // Agregar el objeto de estudiante con las materias al arreglo de solución
    solucion.push({ nombre, materias: materias.length > 0 ? materias : [] });
  }
  return solucion;
}
//retorna una nueva solucion,añadiendole la materia dada al estudiante dado
function addMateria(solucion, estudiante, codigoMateria){
  let copy =JSON.parse(JSON.stringify(solucion));
  copy[estudiante].materias.push({ codigo: codigoMateria });
  return copy;
}
//selecciona de una lista el valor más pequeño y retorna la ubicación en la que se encuentra ese valor
function indiceValorMinimo(lista) {
  const minimo = Math.min(...lista);
  return lista.indexOf(minimo);
}

//retorna el indice del estudiante al que es mejor darle una materia
function aquienEsMejor(solucion, estudiantes, materia) {
  const s = solucion;
  let insatisfacciones = [];
  let mejorEstudiante = -1; // Inicializar con un valor que no sea un índice válido

  for (let i = 0; i < estudiantes.length; i++) {
    if (solicitoMateria(estudiantes[i], materia)) {
      const insatisfaccion = calcularInsatisfaccion(estudiantes, addMateria(s, i, materia));
      insatisfacciones.push(insatisfaccion);
      if (mejorEstudiante === -1 || insatisfaccion < insatisfacciones[mejorEstudiante]) {
        mejorEstudiante = i;
      }
    } else {
      insatisfacciones.push(calcularInsatisfaccion(estudiantes, solucion));
    }
  }

  return { insatisfacciones, mejorEstudiante };
}

function  quitarSoli(soli, x, codigoMateria){
  let solicitud=JSON.parse(JSON.stringify(soli));
  const estudiante = solicitud[x];
  estudiante.solicitud = estudiante.solicitud.filter((materia) => materia.codigo !== codigoMateria);
  return solicitud;
}
function haySolicitud(solicitudes, materia) {
  // Recorremos todas las solicitudes
  for (let i = 0; i < solicitudes.length; i++) {
    const solicitud = solicitudes[i];
    // Recorremos las materias en la solicitud actual
    for (let j = 0; j < solicitud.solicitud.length; j++) {
      // Comparamos el código de la materia con la que se busca
      if (solicitud.solicitud[j].codigo === materia) {
        return true; // Se encontró una solicitud de la materia
      }
    }
  }
  return false; // No se encontró ninguna solicitud de la materia
}

function asignarUnaMateria(solucion, estudiantes, cupoMateria, materia) {
  let s=JSON.parse(JSON.stringify(solucion));
  let solicitud=JSON.parse(JSON.stringify(estudiantes));
  for (let i = 0; i < cupoMateria; i++) {
    if(haySolicitud(solicitud, materia)){
    console.log("Asignar el cupo " + (i + 1) + " de la materia " + materia);
    const resultado = aquienEsMejor(s, estudiantes, materia);
    const mejorEstudiante = resultado.mejorEstudiante;
    console.log("Dar a estudiante " + mejorEstudiante + ": " + estudiantes[mejorEstudiante].nombre);
    s= addMateria(s,  mejorEstudiante , materia);
    solicitud = quitarSoli(solicitud, mejorEstudiante, materia);
    }else {
      return {s, solicitud};
    }
  }
  return {s, solicitud};
}

inicial= inicializarSolucion(E);
console.log("lista: ", aquienEsMejor(inicial, E, "Math"));
//console.log(asignarUnaMateria(inicial, E, 3, "Math"));
//console.log("a", JSON.stringify( quitarSoli(E, 0, "Math"), null, 2));
console.log("solucion: " , JSON.stringify(asignarUnaMateria(inicial, E, 3, "Math"), null, 2))
