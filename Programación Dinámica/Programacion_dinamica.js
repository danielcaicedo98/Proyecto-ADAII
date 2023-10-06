const fs = require('fs'); 
const { log } = require("console");
const { Reader } = require("../Middleware/Reader");


const data = Reader();
let materiasJSON = {};
let estudiantesJSON = {};
let cupos_materia = []
if (data) {
  materiasJSON = data.materias;
  estudiantesJSON = data.estudiantes;    
  cupos_materia = cuposMaterias(materiasJSON)
}
const estados = estadosVector(cuposMaterias(materiasJSON))

const estadosJson = estadosCupos(estados)
const filas = estados.length;
const columnas = estudiantesJSON.numero_estudiantes;
const miMatriz = [];

let materias_asignadas = eliminarElementosRepetidos(llenarMatriz(miMatriz,filas,columnas,estados))
//log(materias_asignadas)

 function eliminarElementosRepetidos(arregloDeArreglos) {
  const elementosUnicos = new Set();
  const resultado = [];

  for (const arreglo of arregloDeArreglos) {
    // Convertimos cada arreglo en una cadena JSON para comparar
    const arregloComoString = JSON.stringify(arreglo);

    // Verificamos si esta cadena ya está en el conjunto de elementos únicos
    if (!elementosUnicos.has(arregloComoString)) {
      elementosUnicos.add(arregloComoString);
      resultado.push(arreglo);
    }
  }

  return resultado;
}


function calculoEstadoAnterior(_arr1,_arr2){
  let arr1 = _arr1.slice()
  let arr2 = _arr2.slice()
  // log(arr1," ",arr2)
    // Verificamos que ambos arreglos tengan la misma longitud
    if (arr1.length !== arr2.length) {
      throw new Error('Los arreglos deben tener la misma longitud');
    }
  
    // Creamos un nuevo arreglo para almacenar la suma de los elementos
    let resultado = [];
  
    // Recorremos los arreglos y sumamos los elementos correspondientes
    for (let i = 0; i < arr1.length; i++) {
      resultado.push(arr1[i] + arr2[i]);
    }

    
  
    let indiceMenor = 0; // Suponemos que el primer elemento es el menor
  
    for (let i = 1; i < resultado.length; i++) {
      if (resultado[i] < resultado[indiceMenor]) {
        // Si encontramos un elemento menor, actualizamos el índice del menor
        indiceMenor = i;
      }
    }  
    // log(resultado) 
    // log(indiceMenor)

  return indiceMenor
    
}

function encontrarPosicion(arreglo, conjuntoDeArreglos) {
    for (let i = 0; i < conjuntoDeArreglos.length; i++) {
      if (JSON.stringify(arreglo) === JSON.stringify(conjuntoDeArreglos[i])) {
        return i;
      }
    }
    return -1; // Retorna -1 si el arreglo no se encuentra en el conjuntoDeArreglos
  }

function estadosVector(vector) {
    const estadosPosibles = [];   
    function generarEstados(actuales, indice) {
        if (indice === vector.length) {
        estadosPosibles.push(actuales.slice()); // Clonamos el arreglo para evitar mutaciones
        } else {
        for (let i = 0; i <= vector[indice]; i++) {
            actuales[indice] = i;
            generarEstados(actuales, indice + 1);
        }
        }
    }
    
    generarEstados([], 0);

return estadosPosibles;
}

function cuposMaterias(materias){
arreglo_materias = materias.materias
  let cupos = []
  let indice = []
  for (let i = 0; i < arreglo_materias.length; i++) {
    const elemento = arreglo_materias[i];
    cupos.push(elemento.cupos)    
  }
  
  return cupos
}

function encontrarIndiceDeVector(vectorBuscado, conjuntoDeVectores) {
    const mapaVectores = new Map();
  
    for (let i = 0; i < conjuntoDeVectores.length; i++) {
      const vectorActual = conjuntoDeVectores[i];
      const claveVector = vectorActual.join(',');
      mapaVectores.set(claveVector, i);
    }
  
    const claveVectorBuscado = vectorBuscado.join(',');
    if (mapaVectores.has(claveVectorBuscado)) {
      return mapaVectores.get(claveVectorBuscado);
    }
  
    return -1;
}


function solicitudEstudiantes(jsonMaterias, jsonEstudiantes) {
    const { numero_materias, materias } = jsonMaterias;
  
    for (const estudiante of jsonEstudiantes) {
      if (!estudiante.materias_estudiante) {
        estudiante.materias_estudiante = new Array(numero_materias).fill(false);
      } else {
        estudiante.materias_estudiante = materias.map(materia => {
          const estudianteMateria = estudiante.materias_estudiante.find(
            estMateria => estMateria.nombre_materia === materia.nombre
          );
          return estudianteMateria || false;
        });
      }
    }
    return jsonEstudiantes;
}



function estadoCupo(cupos) {
const resultado = {
    cupos: 0,
    numero_materias:0,
    materias: [],
};

for (let i = 0; i < cupos.length; i++) {
    const cuposMateria = cupos[i];
    if (cuposMateria > 0) {
    resultado.materias.push({ index: i, cupos_materia: cuposMateria });
    resultado.cupos+= cuposMateria;
    resultado.numero_materias += 1
    }
}

return resultado;
}

function estadosCupos(vector_estados){
    
    let _estados = []

    for(i=0;i<vector_estados.length;i++){
        _estados.push(estadoCupo(vector_estados[i]))
    }

    return _estados

}



//log(estadosJson[1])
function vectorConCeros(tamaño) {
    let vector = []
    for (let i = 0; i < tamaño; i++) {
      vector.push(0);
    }
    return vector;
}

function sumaExceptoActual(arr) {
    const resultado = [];
    
    for (let i = 0; i < arr.length; i++) {
      let suma = arr.reduce((total, elemento, indice) => {
        return indice !== i ? total + elemento : total;
      }, 0);
      resultado.push(suma);
    }
    
    return resultado;
  }


  function reducirPrimeraPosicion(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > 0) {
        arr[i] -= 1;
        break; // Rompemos el bucle una vez que reducimos la primera posición
      }
    }
    return arr;
  }

  function sumarElementosDelArreglo(_arr) {
    let arr = _arr.slice()
    let suma = 0;
  
    for (let i = 0; i < arr.length; i++) {
      suma += arr[i];
    }
    log(suma)
    return suma/arr.length;
  }

  function estudiantesEmpate(estudiantes) {
    const resultados = [];
  
    for (let i = 0; i < estudiantes.length; i++) {
      const estudianteA = estudiantes[i];
  
      for (let j = i + 1; j < estudiantes.length; j++) {
        const estudianteB = estudiantes[j];
  
        // Verificamos si ambos estudiantes tienen el mismo número de materias
        // y la misma suma total de prioridades
        if (
          estudianteA.numero_materias === estudianteB.numero_materias &&
          estudianteA.total_prioridades === estudianteB.total_prioridades
        ) {
          // Comparamos las materias de ambos estudiantes
          const materiasA = estudianteA.materias_estudiante.map((materia) => materia.prioridad);
          const materiasB = estudianteB.materias_estudiante.map((materia) => materia.prioridad);
  
          // Comparamos si las listas de prioridades son iguales
          if (JSON.stringify(materiasA.sort()) === JSON.stringify(materiasB.sort())) {
            resultados.push(i);
          }
        }
      }
    }
  
    return resultados;
  }


  

  
  function arregloDeArreglos(tamaño) {
    const arregloDeArreglos = [];
  
    for (let i = 0; i < tamaño; i++) {
      arregloDeArreglos.push([]);
    }
  
    return arregloDeArreglos;
  }  
  


function llenarMatriz(matriz, filas, columnas,_estados) {    
  let indice_materias = []
  let indices_calcular = indiceMayorCero(_estados)
  let _estudiantes = solicitudEstudiantes(materiasJSON,estudiantesJSON.estudiantes)  
  let estados_anteriores = []
  let arreglo_ceros = vectorConCeros(columnas)  
  let empate = materiasJSON.materias[estudiantesEmpate(_estudiantes)[0]]
  let arr_col= arregloDeArreglos(columnas)
  
  for (let i = 0; i < filas; i++) {    
    let estudiante_j = 0
    let materia_j = 0          
    matriz[i] = [];            
    let estado_anterior = {
        empate:false,
        minimos:arreglo_ceros.slice(),
        prioridad_acumulada:arreglo_ceros.slice(),
        materias_acumuladas:arreglo_ceros.slice(),
        insatisfaccion_acumulada:arreglo_ceros.slice(),
        insatisfaccion:arreglo_ceros.slice(),
        estados:arreglo_ceros.slice(),
        
    }      
    let minimo_j = 0    
    let i_1 = estado_anterior
    let insatisfaccion_anterior = []
    
    if(i==0){
      estados_anteriores.push(i_1)
     
    }else if(i>0){if( _estados[i][_estados[i].length-1] == 0 && i > 0){                  
        let reduction = reducirPrimeraPosicion(_estados[i].slice())                  
        _nuevo_estado = encontrarPosicion(reduction,_estados,_estados[i])                  
        i_1 = {...estados_anteriores[_nuevo_estado]}
        insatisfaccion_anterior = i_1.insatisfaccion_acumulada.slice() 
    }
    if(_estados[i][_estados[i].length-1] != 0){
        i_1 = {...estados_anteriores[i-1]}
        insatisfaccion_anterior = i_1.insatisfaccion_acumulada.slice()                    
    }                
    let minimo = 100    
    
    for (let j = 0; j < columnas ; j++) {   
      
      let _index_cupo = indices_calcular[i]   
      estudiante_j = j
      materia_j = _index_cupo
     
      // if(empate == _index_cupo){
      //   log("empate",_index_cupo)
      // }
      let estudiante = _estudiantes[j] 
      let m = 0
      let p = 0
      let ac = 0
      if(i>0){
        p = i_1.prioridad_acumulada[j]
        m = i_1.materias_acumuladas[j]             
        ac = i_1.insatisfaccion_acumulada[j]
      }
           
      
      
      if(estudiante.materias_estudiante[_index_cupo]){    
                        
        matriz[i][j] =  (1 - ((1+m)/estudiante.numero_materias))*((estudiante.total_prioridades-(estudiante.materias_estudiante[_index_cupo].prioridad+p))/estudiante.total_prioridades)
        
        estado_anterior.estados[j] =  matriz[i][j] 
      }
      else if(!estudiante.materias_estudiante[_index_cupo]){
          matriz[i][j] = 1
          estado_anterior.estados[j] =  matriz[i][j] 
      }                    
      if(matriz[i][j]+ac < minimo ){ 
          minimo_j = j          
          val_min = matriz[i][j]               
          minimo = matriz[i][j]  + ac  
          prioridad_j = estudiante.materias_estudiante[_index_cupo].prioridad  
          ac_mat =  1
          ind_c = _index_cupo
      }
      estado_anterior.estados[j] =  matriz[i][j]  
      estado_anterior.insatisfaccion_acumulada[j] = 1      
      estado_anterior.insatisfaccion[j] = 1
    } 

      //calculando estado actual de acuerdo a las materias  
      estado_anterior.materias_acumuladas[minimo_j] = ac_mat     
      estado_anterior.prioridad_acumulada[minimo_j] = prioridad_j
      estado_anterior.minimos[minimo_j] = true
      estado_anterior.insatisfaccion_acumulada[minimo_j] = val_min
      estado_anterior.insatisfaccion[minimo_j] = val_min
      matriz[i][minimo_j] = val_min   
      

    if( _estados[i][_estados[i].length-1] != 0 ){         
      
      i_1 = {...i_1} 
      
      let _i = calculoEstadoAnterior(i_1.insatisfaccion_acumulada.slice(),estado_anterior.estados)   
      estudiante_j = _i
      materia_j = indices_calcular[i]
      let acum = i_1.materias_acumuladas.slice()
      let ins = i_1.insatisfaccion.slice()
      let prio = i_1.prioridad_acumulada.slice()
      acum[_i] += 1
      ins[_i] = estado_anterior.estados[_i] 
      prio[_i] += _estudiantes[_i].materias_estudiante[ indices_calcular[i]].prioridad  
      estado_anterior.prioridad_acumulada = prio    
      estado_anterior.insatisfaccion = ins
      estado_anterior.materias_acumuladas = acum
      indice_materias.push([estudiante_j,materia_j])
    }  else if( _estados[i][_estados[i].length-1] === 0)  {    
     if(_nuevo_estado > 0){
      let _i = calculoEstadoAnterior(i_1.insatisfaccion_acumulada.slice(),estado_anterior.estados)
      estudiante_j = _i
      materia_j = indices_calcular[i]
      let acum = i_1.materias_acumuladas.slice()
      let ins = i_1.insatisfaccion.slice()
      let prio = i_1.prioridad_acumulada.slice()
      acum[_i] += 1
      ins[_i] = estado_anterior.estados[_i] 
      prio[_i] += prioridad_j
      estado_anterior.prioridad_acumulada = prio    
      estado_anterior.insatisfaccion = ins
      estado_anterior.materias_acumuladas = acum
      indice_materias.push([estudiante_j,materia_j])
     }
     
   }      
   
    estado_anterior.insatisfaccion_acumulada = sumaExceptoActual(estado_anterior.insatisfaccion.slice())  
    estados_anteriores.push({...estado_anterior})   
    
  }
}
  return indice_materias
}
const tiempoInicio = performance.now();

//log(materiasJSON.materias)
const resultado = materiasJSON.materias; // Reemplaza esto con tu resultado real

const tiempoFinal = performance.now();
const tiempoTranscurrido = tiempoFinal - tiempoInicio;
fs.writeFileSync("salida.txt", JSON.stringify(resultado, null, 2), "utf-8");


function indiceMayorCero(arregloDeVectores) {
  const resultados = [];

  for (const vector of arregloDeVectores) {
    let indice = -1; // Inicializamos el índice en -1 (ningún elemento es mayor a 0 al principio).

    for (let i = vector.length - 1; i >= 0; i--) {
      if (vector[i] > 0) {
        indice = i;
        break; // Encontramos el primer elemento mayor a 0, salimos del bucle.
      }
    }

    resultados.push(indice);
  }

  return resultados;  
  
}
