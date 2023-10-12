//const { Reader } = require("../Middleware/Reader");
const fs = require('fs');
const { Reader } = require('./Reader');



// let materiasJSON = {};
// let estudiantesJSON = {};

function carga_datos (){
  
	const data = Reader();
	if (data) {
		const materiasJSON = data.materias;
		const estudiantesJSON = data.estudiantes;
		return [materiasJSON, estudiantesJSON];
	}
}


function Dinamica(_materiasJSON,_estudiantesJSON){
  
  const estados = estadosVector(cuposMaterias(_materiasJSON))
  const filas = estados.length;
  const columnas = _estudiantesJSON.numero_estudiantes;
  const miMatriz = [];
  let llenar_matriz = ProgramacionDinamica(miMatriz,filas,columnas,estados,_materiasJSON,_estudiantesJSON) 
  let salida = materiasAsignadas(eliminarElementosRepetidos(llenar_matriz),_materiasJSON,_estudiantesJSON)
  escribirDatosEnTxt(salida)
}





function materiasAsignadas(_asignaciones,_materiasJSON,_estudiantesJSON){
  let _estudiantes = solicitudEstudiantes(_materiasJSON,_estudiantesJSON.estudiantes)
  let _asignadas = [] 
  let _insatisfaccion_global = 0
  
  // log(_asignaciones)
  for (let i = 0; i < _asignaciones.length; i++){      
    _estudiantes[_asignaciones[i][0]].materias_asignadas.push(_estudiantes[_asignaciones[i][0]].materias_estudiante[_asignaciones[i][1]].nombre_materia)
    _estudiantes[_asignaciones[i][0]].prioridades_asignadas +=  _estudiantes[_asignaciones[i][0]].materias_estudiante[_asignaciones[i][1]].prioridad
    _estudiantes[_asignaciones[i][0]].total_asignadas += 1
  }

  for (let i = 0; i < _estudiantes.length; i++){      
        _insatisfaccion_global += (1 -  (_estudiantes[i].total_asignadas / _estudiantes[i].numero_materias)
    ) * ( (_estudiantes[i].total_prioridades - _estudiantes[i].prioridades_asignadas)  / _estudiantes[i].total_prioridades    ) }



 _insatisfaccion_global = (_insatisfaccion_global / _estudiantes.length)
 _estudiantes["insatisfaccion_global"] = _insatisfaccion_global 
  return  [_estudiantes,_insatisfaccion_global]
}








function escribirDatosEnTxt(arreglo) {
  const [estudiantes, valor] = arreglo;
  const lines = [];
  lines.push(valor);

  for (const estudiante of estudiantes) {
    if (estudiante.total_asignadas > 0) {
      lines.push(`${estudiante.nombre},${estudiante.total_asignadas}`);
      for (const materia of estudiante.materias_asignadas) {
        lines.push(materia);
      }
    }
  }

  const texto = lines.join('\n');

  fs.writeFileSync('salidas/salida.txt', texto, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo:', err);
    } else {
      console.log('Datos escritos en output.txt');
    }
  });
}


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


function solicitudEstudiantes(jsonMaterias, jsonEstudiantes) {
    const { numero_materias, materias } = jsonMaterias;
  
    for (const estudiante of jsonEstudiantes) {
      estudiante["materias_asignadas"] = []
      estudiante["prioridades_asignadas"] = 0
      estudiante["total_asignadas"] = 0
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

function vectorConCeros(tamaño) {
    let vector = []
    for (let i = 0; i < tamaño; i++) {
      vector.push(0);
    }
    return vector;
}
function vectorConUnos(tamaño) {
  let vector = []
  for (let i = 0; i < tamaño; i++) {
    vector.push(1);
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
 
function ProgramacionDinamica(matriz, filas, columnas,_estados,_materiasJSON,_estudiantesJSON) {  

  let cupos_dados = []
  let indices_calcular = indiceMayorCero(_estados)
  let _estudiantes = solicitudEstudiantes(_materiasJSON,_estudiantesJSON.estudiantes) 
  let estados_anteriores = []
  let arreglo_ceros = vectorConCeros(columnas)     
  let arreglo_unos = vectorConUnos(columnas)
  let ins_ant_acum = sumaExceptoActual(arreglo_unos)
  let estado_cero = {   
            index_anterior: -1,         
            prioridad_acumulada:arreglo_ceros.slice(),
            materias_acumuladas:arreglo_ceros.slice(),
            insatisfaccion_acumulada:ins_ant_acum.slice(),
            insatisfaccion:arreglo_unos.slice(),
            estados:arreglo_ceros.slice(),
            estados_cupos: [].slice()            
  }    
  estados_anteriores.push(estado_cero) 
  

  for (let i = 1;i < filas;i++){

    //AQUI ESTAMOS PROGRAMANDO
    let cupo_asignar = indices_calcular[i]
    let diferente_anterior = -1

    
    
    let estado_anterior = {
      index_anterior:estados_anteriores[i-1].index_anterior,
      prioridad_acumulada:estados_anteriores[i-1].prioridad_acumulada.slice(),
      materias_acumuladas:estados_anteriores[i-1].materias_acumuladas.slice(),
      insatisfaccion_acumulada:estados_anteriores[i-1].insatisfaccion_acumulada.slice(),
      insatisfaccion:estados_anteriores[i-1].insatisfaccion.slice(),
      estados:estados_anteriores[i-1].estados.slice(),
      estados_cupos: [].slice() 
    }

    if(_estados[i][_estados[i].length-1] == 0){
      let reduction = reducirPrimeraPosicion(_estados[i].slice())
      _nuevo_estado = encontrarPosicion(reduction,_estados,_estados[i])        
        
      estado_anterior = {
        index_anterior:estados_anteriores[_nuevo_estado].index_anterior,
        prioridad_acumulada:estados_anteriores[_nuevo_estado].prioridad_acumulada.slice(),
        materias_acumuladas:estados_anteriores[_nuevo_estado].materias_acumuladas.slice(),
        insatisfaccion_acumulada:estados_anteriores[_nuevo_estado].insatisfaccion_acumulada.slice(),
        insatisfaccion:estados_anteriores[_nuevo_estado].insatisfaccion.slice(),
        estados:estados_anteriores[_nuevo_estado].estados.slice(),
        estados_cupos: [].slice() 
      }
    }




    if(cupo_asignar[i] === cupo_asignar[i-1]){
      diferente_anterior = estado_anterior.index_anterior
    } 

    
    let estado_actual = {
      index_anterior: -1,
      prioridad_acumulada:arreglo_ceros.slice(),
      materias_acumuladas:arreglo_ceros.slice(),
      insatisfaccion_acumulada:arreglo_ceros.slice(),
      insatisfaccion:arreglo_ceros.slice(),
      estados:arreglo_ceros.slice(),
      estados_cupos: [].slice()    
    }
    let minimo = columnas
    let index_minimo
    
   
    for(let j=0;j < columnas;j++){
      if(_estudiantes[j].materias_estudiante[cupo_asignar]){        
        estado_actual.estados[j] = ((1 - ((estado_anterior.materias_acumuladas[j] + 1) / _estudiantes[j].numero_materias)   ) * ( 
          (_estudiantes[j].total_prioridades -  (_estudiantes[j].materias_estudiante[cupo_asignar].prioridad +  estado_anterior.prioridad_acumulada[j]) )/ _estudiantes[j].total_prioridades  ) )

          estado_actual.insatisfaccion_acumulada[j] = estado_anterior.insatisfaccion_acumulada[j] + estado_actual.estados[j] 


        }else{
          estado_actual.estados[j] = 1
          estado_actual.insatisfaccion_acumulada[j] = estado_anterior.insatisfaccion_acumulada[j] + estado_actual.estados[j] 
        }

        if(estado_actual.insatisfaccion_acumulada[j] < minimo && j != diferente_anterior){
          minimo = estado_actual.insatisfaccion_acumulada[j]
          index_minimo = j
        }

        estado_actual.insatisfaccion[j] = 1
    }

    estado_anterior.prioridad_acumulada[index_minimo] += _estudiantes[index_minimo].materias_estudiante[cupo_asignar].prioridad

    estado_anterior.materias_acumuladas[index_minimo] += 1 
    estado_actual.insatisfaccion[index_minimo] =  estado_actual.estados[index_minimo]
    
    estado_actual.insatisfaccion_acumulada = sumaExceptoActual(estado_actual.insatisfaccion)
    estado_actual.index_anterior = index_minimo


    estado_actual.prioridad_acumulada = estado_anterior.prioridad_acumulada.slice()
    estado_actual.materias_acumuladas = estado_anterior.materias_acumuladas.slice()

    if(i == 1){
      cupos_dados.push([index_minimo,cupo_asignar])  
    }else  if(_estados[i][_estados[i].length-1] == 0){
      cupos_dados.push([index_minimo,cupo_asignar])      
    }else if(_estados[filas-1][_estados[filas-1].length-1] >= ((filas-1) - (i-1))){
      
      cupos_dados.push([index_minimo,cupo_asignar])
    }



    estados_anteriores.push(estado_actual)
  }
  
  return cupos_dados
}


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

// const datos = carga_datos();

// Dinamica(datos[0], datos[1])

module.exports = {carga_datos,Dinamica}