/* Solución al problema utilizando programación dinamica*/

/* 
Paso 1: Caracterizar la estructura de la solución óptima (subestructura óptima).
Cada subproblema consiste en asignar materias a un subconjunto de estudiantes. 
se resuelve el problema para un grupo de estudiantes y materias antes de abordar 
el problema completo
*/

/* 
Paso 2: Definir recursivamente el valor de la solución óptima

F(j,k) , j= estudiantes, k= materias disponibles, 
F(0, k)= 0, si no hay estudiantes no importa la cant de materias dispobles
si el estudiante decide no tomar la materia k
 F(j, k) = F(j, k-1)
Si el estudiante decide tomar esa materia, pjl, su prioridad
 F(j, k) = min(F(j, k-1), pjl + F(j-1, k-1))

tabla[i][j] = min(DP[i][j-1], DP[i-1][k] + fj)
tabla[i][j-1] representa la insatisfacción acumulada mínima si no asignamos la materia j a ningún estudiante.
tabla[i-1][k] + fj representa la insatisfacción acumulada mínima si asignamos la materia j al estudiante i, donde k es el índice de la materia j asignada al estudiante i, y fj es la insatisfacción del estudiante i si se le asigna la materia j.
*/

/* 
Paso 3:Calcular el valor de la solución óptima.

*/


const k = 2; // Número de materias disponibles
const r = 2; // Número de estudiantes
const conjuntoP = [1, 2, 3, 4, 5];
const conjuntoM = [
  { codigo: "Math", cupo: 1 },
  { codigo: "Fisica", cupo: 1 },
];
const conjuntoE = [
    { nombre: "Juan", solicitud: [{codigo: "Math", prioridad: 3} , {codigo: "Fisica", prioridad: 4}] },
    { nombre: "Nata", solicitud: [{codigo: "Math", prioridad: 4}, {codigo: "Fisica", prioridad: 3}] },
  ];


//si a E2 se le asignó M1, 
//insatifacción de E2=0, insatifaccion de E1= (1-0/1)*(3/ 3*1-1)= 1.5

// si a 1 se le asigna M1 a 2 ninguno
//insatisfacción de 1=0 de 2= (1-0/1)*(4/3*1-1)=2
function fj(materiasAsig, materiasSoli, prioriSoliNoAsig){
    return (1-(materiasAsig/materiasSoli))*(prioriSoliNoAsig/ ((3*materiasSoli)-1)) 
}
console.log(fj(1, 2, 4));
console.log("hola" +fj(1, 2, 5));


//retorna si el estudiante dado solicitó la materia dada
function solicito( E, estudiante, materia){
  //return E[estudiante].solicitud.length;  
  for(let i=0; i < E[estudiante].solicitud.length; i++ ){
    console.log(E[estudiante].solicitud[0].codigo == materia)
    if(E[estudiante].solicitud[0].codigo == materia){
      return true
    }
  }
  return false

}

//console.log("insas " + fj(0, 1, 4 ))
//console.log("insas " + fj(0, 1, 3 ))
//como 2+0>1.5+0 es mejor asignar M1 al estudiante E2 porque se causa una insatisfacción total menor
//el valor de la solución seria 1.5, que representa la instifacción menor
//console.log("priorii: " + conjuntoE[1].solicitud.nombre)
  
//k materias, r estudiantes
function valorDeLaSolucion(k, r, M, E) {
  const tabla = new Array(r + 1).fill(null).map(() => new Array(k + 1).fill(Infinity));

   // Caso base: si no hay estudiantes, no hay insatisfacción
   for (let i = 0; i <= k; i++) {
     tabla[0][i] = 0;
   }
     // Llenar la matriz DP usando la recursión definida
  for (let j = 0; j <=r; j++) {
    //recorre estudianres
    for (let i = 0; i <= k; i++) { //recorre las materias
      if (j === 0) { //no hay estudiante
        tabla[j][i] = 0;
      } else if (i === 0) { //no hay materia
        tabla[j][i] = 0;
      } else {
        //.log("la materia " + i + " es " + M[i-1].codigo + " estudiante " + j)
        //el estudiante j solicitó la materia i?
        //console.log("el estudiante " + j + " solicitó la materia" + M[i-1].codigo + " ? " )
       // console.log("el estudiante " + E[j-1].nombre + " solicitó la materia" + M[i-1].codigo + " ? " )
        //console.log("la solicitud es: " + E[j-1].solicitud[0].codigo + "prioridad: " + E[j-1].solicitud[0].prioridad)
        //console.log(solicito(E, j-1 ,  M[i-1].codigo ))
        if(solicito(E, j-1 ,  M[i-1].codigo)){ //si la solicitó qué pasa

         // tabla[i][j] = min(tabla[i][j-1], tabla[i-1][k] + fj)
        }else{ //si no solicitó la materia, no se le asigna y por lo tanto la insatifacción no cambia
          tabla[j][i] = tabla[j][i-1];
        }
        
    }
  }
}
  // El valor de la solución óptima estará en DP[r][k]
  return tabla;
  }
console.log(valorDeLaSolucion(k, r, conjuntoM, conjuntoE))

numero_materias = 3;
materias= [{ nombre: '100', cupos: 1 },{ nombre: '101', cupos: 3 },{ nombre: '102', cupos: 2 }
]
numero_estudiantes= 5;
estudiantes= [
  {nombre: '1000', solicitud: [{codigo: '100', prioridad: 3 }, {codigo: '101', prioridad: 2 }]},
  {nombre: '1001', solicitud: [{codigo: '102', prioridad: 5 }, {codigo: '100', prioridad: 1 }, 
                               {codigo: '101', prioridad: 2 }]},
  {nombre: '1002',  solicitud: [{codigo: '100', prioridad: 3 }, {codigo: '102', prioridad: 2 }]},
  {nombre: '1003', solicitud: [{codigo: '102', prioridad: 2 }]},
  {nombre: '1004',solicitud: [{codigo: '100', prioridad: 1 }, {codigo: '101', prioridad: 4 }] }
]

solicitud= {nombre: '1000', solicitud: [{codigo: '100', prioridad: 3 }, {codigo: '101', prioridad: 2 }]}
solucionProblema= [
  {nombre: '1000', materias: [ {codigo: '100'}]},
  {nombre: '1003', materias: [ {codigo: '102'}]}
]
solucion0 = solucionProblema[0];
