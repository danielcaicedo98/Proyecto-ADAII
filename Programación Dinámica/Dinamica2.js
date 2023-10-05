const { Console } = require("console");

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
//console.log("S es: ", JSON.stringify(S, null, 2));

    function obtenerVectorCupos(materias) {
      let cupos = [];
      for (let i = 0; i < materias.length; i++) {
      cupos.push(materias[i].cupos);
      }
      return cupos;
    }
    function materiasAsignadas(solucion){
      return solucion.materias.length;
    }
    //console.log(materiasAsignadas(S[0]));
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

//console.log(calcularInsatisfaccion(E, S));

//AQUI EMPIEZA EL ALGORITMO

function hayCupos (cupos){
  return cupos.every(numero => numero !== 0);
}

function cuposMi (cupos, i){
  guardar= cupos[i-1]
  for (let j = 0; j < cupos.length; j++) {
    cupos[j] = 0;
  }
  if(i==0){
    return cupos;
  }else{
    cupos[i-1]=guardar;
  }
  return cupos;
}



//retorna el indice de una materia si la solicitó, si no, retorna -1
function solicitoMateria(estudiante, codigoMateria) {
  for (let i = 0; i < estudiante.solicitud.length; i++) {
    if (estudiante.solicitud[i].codigo === codigoMateria) {
      return true;
    }
  }
  return false;
}

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


//console.log(inicializarSolucion(E))

function addMateriaAestudiante(estudiante, codigoMateria){
 
  estudiante.materias.push({ codigo: codigoMateria });
  return estudiante.materias;
}
//{nombre: "Juan", materias: [ {codigo: "Math"}] }

function addMateria(solucion, estudiante, codigoMateria){
  let copy =JSON.parse(JSON.stringify(solucion))
  copy[estudiante].materias.push({ codigo: codigoMateria });
  return copy;
}

/*console.log("añadir en la p 1", JSON.stringify( addMateria([{nombre: "Juan", materias: [ {codigo: "Fisica"}, {codigo: "Math"} ] },
{nombre: "Nata", materias: [ {codigo: "Math"}]}
], 1, "Español"), null, 2));*/

function asignar(M, m, solicitud){
  if(solicitoMateria(solicitud, m)){
   // console.log("Se la asigo y le calculo la insatisfacción de haberla calculado")
    //supongamos q se le asignó: la solución seria e1=(materia 1)
    solucion=[ { nombre: solicitud.nombre ,  materias: [ { codigo: M[m-1].codigo}] } ];
    return fj(1, materiasSolicitadas(solicitud), prioridadNoAsigada(solicitud, solucion ));
  }else{
    solucion=[ { nombre: solicitud.nombre ,  materias: [ { codigo: M[m-1].codigo}] } ];
    return fj(0, materiasSolicitadas(solicitud), prioridadNoAsigada(solicitud, solucion ));
  }
}

function indiceValorMinimo(lista) {
  const minimo = Math.min(...lista);
  return lista.indexOf(minimo);
}

//determinar a quien es mejor darle la materia
function F(s, estudiantes, materia){
//  console.log("las entradas son ", JSON.stringify(s, null, 1),  JSON.stringify(estudiantes, null, 1),  JSON.stringify(materia, null, 1));
  //let n=0;
  let insatisfacciones=[]
  const solucion = JSON.parse(JSON.stringify(s));
  let nuevaSolucion;

  for(i=0; i<estudiantes.length; i++) {
    nuevaSolucion = JSON.parse(JSON.stringify(solucion));
   /* console.log("a nueva solución se le da el valor de solucion ")
    console.log("solucion es : ", JSON.stringify(solucion, null, 2));
    console.log("nuevaSolucion es : ", JSON.stringify(nuevaSolucion, null, 2));*/
   // console.log("Solucion antes de añadirlr algo al estudiante", i, " " , JSON.stringify(nuevaSolucion, null, 2))
    if(solicitoMateria(estudiantes[i], materia)){ //si el estudiante solicitó la materia
     // console.log("el estudiante ", i, "Solicitó ", materia)
      nuevaSolucion= addMateria(nuevaSolucion, i, materia);
      //console.log("sele añadio la materia al estudiante", i, " " , JSON.stringify(nuevaSolucion, null, 2))
      insatisfacciones.push(calcularInsatisfaccion(estudiantes, nuevaSolucion));
      //console.log("insatisfaccion de ", i, insatisfacciones)
      //insatisfacción global q le causa esa materia
    }else{
      console.log("el estudiante no solicitó la materia");
      insatisfacciones.push(calcularInsatisfaccion(estudiantes, nuevaSolucion));
    }
  } 
  //n++;
  //console.log("n fue:" , n)
 // console.log("las entradas fueron: ", JSON.stringify(s, null, 2),  JSON.stringify(estudiantes, null, 2),  JSON.stringify(materia, null, 2));
  return indiceValorMinimo( insatisfacciones);
}

function aquienEsMejor(solucion, estudiantes, materia){
  const s = JSON.parse(JSON.stringify(solucion));
  let insatisfacciones=[];

  for(i=0; i<estudiantes.length; i++){
    insatisfacciones.push(calcularInsatisfaccion(estudiantes, addMateria(s, i ,materia) ));
  }
  return indiceValorMinimo( insatisfacciones);
}

inicial= inicializarSolucion(E);

console.log(aquienEsMejor(inicial, E, "Math"));
//console.log("El inicial es " , JSON.stringify(inicial, null, 2))
//console.log("insa ", calcularInsatisfaccion(E, S ))

//console.log("es mejor darle la materia al estudiante ", F(inicial, E, "Fisica"), E[F(inicial, E, "Fisica")].nombre);

function  quitarSoli(solicitud, x, codigoMateria){
  const estudiante = solicitud[x];
  estudiante.solicitud = estudiante.solicitud.filter((materia) => materia.codigo !== codigoMateria);
  return solicitud;
}

function asignarCuposMateria(cupos, solicitud, materias){
  //cupos será un numero q me dice cuantos cupos vamos a asignar
  solucion=[]; //la solución está vacia

  nuevaSolicitud=solicitud;
  solucion= inicializarSolucion(solicitud)
  //console.log("solucion inicial " , solucion)
  m=cupos.length;
  //sabemos que si son M materias, son M subproblemas
  for(let subP=1; subP <= m; subP++){
    //console.log("indice de m es ", subP)
    let codigoMateria = materias[subP-1].codigo;
   // console.log(subP, "asignar los cupos de la materia " + codigoMateria);
    let cuposDelaM = cupos[subP-1];

    for(i=0; i < cuposDelaM ; i++){
      console.log(cuposDelaM, subP)
      console.log(i, "asignar el cupo " + (i+1) + " de la materia " + codigoMateria);
       //x = F(solucion, solicitud, codigoMateria);
       console.log(cuposDelaM, subP)
      // console.log("es mejor darle ", codigoMateria, " al estudiante ", solicitud[x].nombre);
      /* solucion= addMateria(solucion, x,codigoMateria); //tengo que quitar lo que asigné
       solicitud= quitarSoli(solicitud, x, codigoMateria);
     */
     //console.log("solucion: " , JSON.stringify(solucion, null, 2))
   }

  }
  return solucion;
}

function rocPD(cupos, solicitud, materias){
  //cupos es [1, 0, 1]
  catidadMaterias=cupos.length
 
  solucion= inicializarSolucion(solicitud)
  //Asignar los cupos de la materia 1
  for(let subP=0; subP < catidadMaterias; subP++){
    
    if(hayCupos(cupos)){
      console.log(subP, "asignar los " + cupos[subP] + "cupos de la materia " +  materias[subP].codigo);
      for(i=0; i< cupos[subP] ; i++){
        console.log(subP, "asignar el " + (i+1) + "dela materia" +  materias[subP]. codigo);
        //calcular a que estudiante es mejor darle esa materia con la funcion F
        x= aquienEsMejor(solucion, solicitud, materias[subP].codigo)
        console.log("dar a ", aquienEsMejor(solucion, solicitud, materias[subP].codigo));
      } 
    }else{
      
    }
  }
  return solucion;
}

console.log("solu final: ", JSON.stringify( rocPD([3,1], E, M), null, 2));
