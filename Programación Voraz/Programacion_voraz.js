//Algoritmo Voraz para el ejercicio Reparticion Optima de Cupos

const { Reader } = require("../Middleware/Reader");

//Carga los datos
function cargarDatos() {
	const data = Reader();
	if (data) {
		const materiasJSON = data.materias;
		const estudiantesJSON = data.estudiantes;
		return [materiasJSON, estudiantesJSON];
	}
}

//Ordena los estudiantes de tal manera que las materias se ordenen de manera descendente por su prioridad, y los estudiantes de manera ascendente por su cantidad de materias
function ordenarJSON(estudiantesJSON, materiasJSON) {
	//Recorre la lista de estudiantes, ordena por prioridad las materias de cada estudiante
	for (let i = 0; i < estudiantesJSON.numero_estudiantes; i++) {
		//Se ordena las materias, las materias con misma prioridad se respectaran el orden de llegada.
		quicksort(
			estudiantesJSON.estudiantes[i].materias_estudiante,
			0,
			estudiantesJSON.estudiantes[i].materias_estudiante.length - 1,
			true,
			false,
			materiasJSON
		);

		//pasa por cada materia y guarda suma las prioridades
		let suma = 0;
		for (let j = 0; j < estudiantesJSON.estudiantes[i].numero_materias; j++) {
			suma += estudiantesJSON.estudiantes[i].materias_estudiante[j].prioridad;
		}
		estudiantesJSON.estudiantes[i].prioridadTotal = suma;
	}

	//se ordena los estudiante por su cantidad de materias de manera ascendente, en caso de igualdad, se ordena por su prioridad
	quicksort(
		estudiantesJSON.estudiantes,
		0,
		estudiantesJSON.estudiantes.length - 1,
		false,
		false,
		materiasJSON
	);
}

//Funcion de ordenamiento quicksort, complejidad(n log n)
function quicksort(array, left, right, boolean, boolean2, materiasJSON) {
	if (left < right) {
		let pivotIndex = partition(
			array,
			left,
			right,
			boolean,
			boolean2,
			materiasJSON
		);
		quicksort(array, left, pivotIndex - 1, boolean, boolean2, materiasJSON);
		quicksort(array, pivotIndex + 1, right, boolean, boolean2, materiasJSON);
	}
}

//function auxiliar de quicksort, ligeramente modificaciodo para las necesidades
function partition(array, left, right, boolean, boolean2, materiasJSON) {
	let pivot = array[right];
	let i = left - 1;

	for (let j = left; j < right; j++) {
		if (
			boolean
				? array[j].prioridad >= pivot.prioridad
				: boolean2
				? array[j].insatisfaccion >= pivot.insatisfaccion
				: array[j].numero_materias <= pivot.numero_materias
		) {
			//caso para ordenar estudiantes
			if (!boolean) {
				//cuando se reordena la lista
				if (boolean2) {
					if (array[j].insatisfaccion > pivot.insatisfaccion) {
						i++;
						let temp = array[i];
						array[i] = array[j];
						array[j] = temp;
					} else {
						if (
							array[j].materias_estudiante.length <
							pivot.materias_estudiante.length
						) {
							i++;
							let temp = array[i];
							array[i] = array[j];
							array[j] = temp;
						}
					}
				} else {
					//si la cantidad de materias es menor que el pivote
					if (array[j].numero_materias < pivot.numero_materias) {
						i++;
						let temp = array[i];
						array[i] = array[j];
						array[j] = temp;
					} else {
						//se coloca de primera la que tenga mas prioridad
						if (
							array[j].materias_estudiante[0].prioridad >
							pivot.materias_estudiante[0].prioridad
						) {
							i++;
							let temp = array[i];
							array[i] = array[j];
							array[j] = temp;
						} else if (
							array[j].materias_estudiante[0].prioridad ==
							pivot.materias_estudiante[0].prioridad
						) {
							let cupos_array = 0;
							let cupos_pivot = 0;
							for (
								let materia = 0;
								materia < materiasJSON.numero_materias;
								materia++
							) {
								for (let x = 0; x < array[j].numero_materias; x++) {
									if (
										array[j].materias_estudiante[x].nombre_materia ==
										materiasJSON.materias[materia].nombre
									) {
										cupos_array += materiasJSON.materias[materia].cupos;
									}
									if (
										pivot.materias_estudiante[x].nombre_materia ==
										materiasJSON.materias[materia].nombre
									) {
										cupos_pivot += materiasJSON.materias[materia].cupos;
									}
								}
							}
							if (cupos_array < cupos_pivot) {
								i++;
								let temp = array[i];
								array[i] = array[j];
								array[j] = temp;
							}
						}
					}
				}
				//en caso que sea solo ordenar materias
			} else {
				i++;
				let temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
		}
	}
	let temp = array[i + 1];
	array[i + 1] = array[right];
	array[right] = temp;

	return i + 1;
}

function matricularMaterias(materiasJSON, estudiantes) {
	const estudiantesMatriculados = [];
	let contador = 0;
	let i = 0;
	console.log(estudiantes[0]);
	//bucle hasta que todas las materias ocupen todos los cupos o se acaben las materias de los estudiantes
	while (contador != materiasJSON.numero_materias) {
		//condicional cuando el estudiante se quede sin materias siga al siguiente
		if (estudiantes[i].materias_estudiante[0]) {
			let cantidadAnteriorMaterias = estudiantes[i].materias_estudiante.length;

			//Recorrera las materias
			for (x = 0; x < materiasJSON.materias.length; x++) {
				//verifica que exista materias
				if (estudiantes[i].materias_estudiante[0]) {
					//if para cuando las materias sean las mismas
					if (
						estudiantes[i].materias_estudiante[0].nombre_materia ==
						materiasJSON.materias[x].nombre
					) {
						//if para comprobar si los cupos de esa materia son mayor a cero
						if (materiasJSON.materias[x].cupos > 0) {
							//Busca el index del estudiante si ya se encuentra a los ya matriculados, si no existe da -1
							let estudianteExistenteIndex = estudiantesMatriculados.findIndex(
								(estudiante) => estudiante.nombre === estudiantes[i].nombre
							);

							//si el estudiante ya matriculo, se guardara solo la materia, sino se añadira como nuevo a los ya matriculados
							if (estudianteExistenteIndex !== -1) {
								estudiantesMatriculados[
									estudianteExistenteIndex
								].materias_asignadas.push(
									estudiantes[i].materias_estudiante[0]
								);
							} else {
								estudiantesMatriculados.push({
									nombre: estudiantes[i].nombre,
									materias_asignadas: [estudiantes[i].materias_estudiante[0]],
								});
							}
							//le resta un cupo a la materia
							materiasJSON.materias[x].cupos--;
						} else {
							//en caso de no tener cupo elimina la primer materia de la lista del estudiante y reincio x
							estudiantes[i].materias_estudiante.splice(0, 1);
							if (
								cantidadAnteriorMaterias !=
								estudiantes[i].materias_estudiante.length
							) {
								x = 0;
								cantidadAnteriorMaterias =
									estudiantes[i].materias_estudiante.length;
							}
						}
					}
				}
			}
		}
		//borra la materia que tenia mayor prioridad
		estudiantes[i].materias_estudiante.splice(0, 1);

		//condicional para que cuando acabe con un estudiante siga con el siguiente, o vuelva a reiniciar, o salga del bucle
		if (i == estudiantes.length - 1) {
			let boolean = false;
			//genera una insatisfaccion parcial y verifica si ya se acabaron los estudiantes con materias
			for (let i = 0; i < estudiantes.length; i++) {
				calcularInsatisfaccionParcial(estudiantes, estudiantesMatriculados, i);
				if (estudiantes[i].materias_estudiante.length != 0) {
					boolean = true;
				}
			}

			//Termina si se acabaron las materias
			if (!boolean) {
				break;
			}

			//cuenta las materias que no posean cupos
			for (
				let materia_index = 0;
				materia_index < materiasJSON.materias.length;
				materia_index++
			) {
				if (materiasJSON.materias[materia_index].cupos == 0) {
					contador++;
				}
			}

			//Termina si se acabaron los cupos
			if (contador == materiasJSON.numero_materias) {
				break;
			}
			contador = 0;

			//reorganiza los estudiantes por insatisfaccion parcial
			quicksort(
				estudiantes,
				0,
				estudiantes.length - 1,
				false,
				true,
				materiasJSON
			);
			i = 0;
		} else {
			i++;
		}
	}
}

//Calcula una insatisfaccion parcial/total para cada estudiante para ordenar la lista de mejor manera
function calcularInsatisfaccionParcial(
	estudiantes,
	estudiantesMatriculados,
	i
) {
	function γ(x) {
		return 3 * x - 1;
	}

	//Crea la prioridad total de los rechazados si no la tiene
	if (!estudiantes[i].prioridad_total_rec) {
		estudiantes[i] = {
			...estudiantes[i],
			numero_materias_asignadas: 0,
			prioridad_total_rec: estudiantes[i].prioridadTotal,
		};
	}

	//asigna las cantidades de las prioridades de cada materia y la cantidad de materias matriculadas
	for (let j = 0; j < estudiantesMatriculados.length; j++) {
		if (estudiantes[i].nombre == estudiantesMatriculados[j].nombre) {
			let suma = estudiantes[i].prioridadTotal;
			for (
				let materia = 0;
				materia < estudiantesMatriculados[j].materias_asignadas.length;
				materia++
			) {
				suma -=
					estudiantesMatriculados[j].materias_asignadas[materia].prioridad;
			}
			estudiantes[i].prioridad_total_rec = suma;

			estudiantes[i] = {
				...estudiantes[i],
				numero_materias_asignadas:
					estudiantesMatriculados[j].materias_asignadas.length,
			};
		}
	}

	//genera la insatisfaccion
	const insatisfaccion =
		(1 -
			estudiantes[i].numero_materias_asignadas /
				estudiantes[i].numero_materias) *
		(estudiantes[i].prioridad_total_rec / γ(estudiantes[i].numero_materias));

	//guarda la insatisfaccion
	estudiantes[i] = {
		...estudiantes[i],
		insatisfaccion: insatisfaccion,
	};
}

//Retorna el costo de la funcion
function calcularInsatisfaccionTotal(estudiantes) {
	let resultado = 0;
	for (let i = 0; i < estudiantes.length; i++) {
		console.log(
			"nombre",
			estudiantes[i].nombre,
			"insatisfaccion:",
			estudiantes[i].insatisfaccion
		);
		resultado += estudiantes[i].insatisfaccion;
	}
	return resultado / estudiantes.length;
}

//Ejecuta el programa
function programacionVoraz(materiasJSON, estudiantesJSON) {
	//organiza los estudiantes
	ordenarJSON(estudiantesJSON, materiasJSON);

	//matricula las asignaturas
	matricularMaterias(materiasJSON, estudiantesJSON.estudiantes);

	//calcular insatisfaccion
	console.log(calcularInsatisfaccionTotal(estudiantesJSON.estudiantes));
}

//Carga los datos
// const datos = cargarDatos();

// //ejecuta la funcion principal
// programacionVoraz(datos[0], datos[1]);
module.exports = {
	programacionVoraz,
	cargarDatos,
};
