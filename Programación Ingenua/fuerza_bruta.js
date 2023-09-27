const { ReaderBr } = require("../Middleware/reader_br");
const fs = require("fs");
function generarVariaciones(materias, variacionActual, indice, variaciones) {
	// Si hemos llegado al final de la lista de materias, agregamos la variaciónActual al array de variaciones.
	if (indice === materias.length) {
		variaciones.push(variacionActual.map((materia) => ({ ...materia }))); // Copiamos todas las materias para evitar que se modifiquen.
	} else {
		// Cambiamos el estado de la materia a "Aprobada" y recursivamente generamos las variaciones.
		variacionActual[indice].asignada = true;
		generarVariaciones(materias, variacionActual, indice + 1, variaciones);

		// Cambiamos el estado de la materia a "No Aprobada" y recursivamente generamos las variaciones.
		variacionActual[indice].asignada = false;
		generarVariaciones(materias, variacionActual, indice + 1, variaciones);
	}
}

// Función para generar todas las variaciones posibles.
function obtenerTodasLasVariaciones(materias) {
	const variaciones = [];
	const variacionInicial = materias.map((materia) => ({ ...materia })); // Copiamos todas las materias para iniciar.

	generarVariaciones(materias, variacionInicial, 0, variaciones);

	return variaciones;
}
// Ejemplo de uso:
const materias = [
	{
		nombre_materia: "101",
		prioridad: 4,
		cod_estudiante: "1007",
		asignada: false,
	},
	{
		nombre_materia: "102",
		prioridad: 3,
		cod_estudiante: "1004",
		asignada: false,
	},
	{
		nombre_materia: "102",
		prioridad: 5,
		cod_estudiante: "1004",
		asignada: false,
	},
];

function esValida(variacion = [], materias) {
	// let todasNoAsignadas = variacion.every((v) => v.asignada);
	// if (todasNoAsignadas) {
	// 	return console.log("todas en verdadero");
	// }
	let valida = true;
	const cuposPorMateria = {};
	materias.forEach((m) => {
		cuposPorMateria[m.nombre] = m.cupos;
	});

	variacion.forEach((ms) => {
		let cuposDisponibles = cuposPorMateria[ms.nombre_materia];
		if (ms.asignada) {
			// console.log(cuposDisponibles, ms.nombre_materia);
			if (cuposDisponibles > 0) {
				cuposPorMateria[ms.nombre_materia] =
					cuposPorMateria[ms.nombre_materia] - 1;
			} else {
				valida = false;
			}
		}
		//materias solicitadas
	});
	// console.log("es valida ", variacion, cuposPorMateria, valida);
	return valida;
}
function γ(x) {
	return 3 * x - 1;
}
function calcularInstatisfaccion(variacion) {
	const estudiantes = new Array(); //guardamos objetos con el ma el ms y la sumatoria de prioridades de las rechazadas
	//ma: materia asignada, ms: materia solicitada
	// como la variacion está ordenada por codigo estudiante, es decir . las primeras 3 son de un estudiante, las siguientes 2 son de otro, las siguientes 5 de otro, etc.
	let estudianteActual = variacion[0].cod_estudiante;
	estudiantes[0] = {
		ma: 0,
		ms: 0,
		prioridadTotalRec: 0, //prioridad total de las materias rechazadas
		cod_estudiante: estudianteActual,
	};
	let prioridadASumar = 0;
	let maASumar = 0;
	let indice = 0;
	variacion.forEach((materiaS) => {
		if (estudianteActual !== materiaS.cod_estudiante) {
			estudianteActual = materiaS.cod_estudiante;
			indice++;
			estudiantes[indice] = {
				ma: 0,
				ms: 0,
				prioridadTotalRec: 0, //prioridad total de las materias rechazadas
				cod_estudiante: estudianteActual,
			};
		}
		prioridadASumar = 0;
		maASumar = 1;
		if (!materiaS.asignada) {
			prioridadASumar = materiaS.prioridad;
			maASumar = 0;
		}
		// console.log(indice);
		// if (estudiantes[indice] == undefined) {
		// 	estudiantes[indice]["ma"] = 0;
		// 	estudiantes[indice]["prioridadTotalRec"] = 0;
		// 	estudiantes[indice]["ms"] = 0;
		// }
		estudiantes[indice] = {
			ma: estudiantes[indice]["ma"] + maASumar,
			prioridadTotalRec:
				estudiantes[indice]["prioridadTotalRec"] + prioridadASumar,
			ms: estudiantes[indice]["ms"] + 1,
			cod_estudiante: estudianteActual,
		};
	});

	const insatisfacciones = estudiantes.map((e) => {
		return (1 - e.ma / e.ms) * (e.prioridadTotalRec / γ(e.ms));
	});
	// console.log(
	// 	insatisfacciones.reduce((a, b) => a + b, 0) / insatisfacciones.length
	// );
	return insatisfacciones.reduce((a, b) => a + b, 0) / insatisfacciones.length; //promedio de insatisfacciones
}
const data = ReaderBr();
if (data) {
	const todosLosEstudiantes = data.estudiantes;
	const todasLasMaterias = data.materias.materias;
	let materiasSolicitadas = todosLosEstudiantes.estudiantes.flatMap((est) => {
		return est.materias_estudiante;
	});
	console.log(
		"Materias :",
		data.materias.materias.map((m) => [m.nombre, m.cupos])
	);
	console.log("solicitadas", materiasSolicitadas.length);

	const todasLasVariaciones = obtenerTodasLasVariaciones(materiasSolicitadas);
	// variaciones que no exceden el cupo de las materias
	const variacionesValidas = todasLasVariaciones.filter((variacion) => {
		return esValida(variacion, todasLasMaterias);
	});

	console.log("combinaciones validas", variacionesValidas.length);
	const insatisfaccionesTotales = variacionesValidas.map((variacion) => {
		return calcularInstatisfaccion(variacion);
	});
	console.log(Math.min(...insatisfaccionesTotales));

	//calcularInstatisfaccion(variacionesValidas[0]);
	// console.log("variaciones", todasLasVariaciones.length);
	// console.log("validas", variacionesValidas.length);
	// console.log(
	// 	typeof materiasSolicitadas,
	// 	materiasSolicitadas.map((m) => m.cod_estudiante)
	// );
	// console.log(todasLasMaterias, todasLasVariaciones[0]);
}
