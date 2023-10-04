const ReaderBr = require("./reader_br");
const fs = require("fs");
let mejorVariacion = [];
let running = false;
function generarVariaciones(
	materias,
	variacionActual,
	indice,
	todasLasMaterias
) {
	// Si hemos llegado al final de la lista de materias, agregamos la variaciónActual al array de variaciones.
	if (indice === materias.length) {
		const insActualVariacion = calcularInstatisfaccion(variacionActual);
		const insMejorVariacion = calcularInstatisfaccion(mejorVariacion);
		if (insActualVariacion < insMejorVariacion) {
			mejorVariacion = variacionActual.map((materia) => ({
				...materia,
			}));
		}
	} else {
		// Cambiamos el estado de la materia a "asignada" y recursivamente generamos las variaciones.
		variacionActual[indice].asignada = true;
		const valida = esValida(variacionActual, todasLasMaterias);
		if (valida) {
			generarVariaciones(
				materias,
				variacionActual,
				indice + 1,
				todasLasMaterias
			);
		}

		// Cambiamos el estado de la materia a "No asignada" y recursivamente generamos las variaciones.
		variacionActual[indice].asignada = false;
		generarVariaciones(materias, variacionActual, indice + 1, todasLasMaterias);
	}
}

/** Función para generar todas las variaciones posibles e ir calculando la solución más optima*/
function calcularMejorSolucion(materiasSolicitadas, todasLasMaterias) {
	const variacionInicial = materiasSolicitadas.map((materia) => ({
		...materia,
	})); // Copiamos todas las materias para iniciar.
	mejorVariacion = materiasSolicitadas.map((materia) => ({
		...materia,
	}));
	//va generando variaciones y a medida que las genera va calculando cual es mejor
	running = true;
	generarVariaciones(
		materiasSolicitadas,
		variacionInicial,
		0,
		todasLasMaterias
	);
	running = false;
	console.log("mejor variacion", calcularInstatisfaccion(mejorVariacion));
	return mejorVariacion;
}

/** mira que la variación no exceda el cupo de las materias*/
function esValida(variacion = [], materias = []) {
	let valida = true;
	const cuposPorMateria = {};
	materias.forEach((m) => {
		cuposPorMateria[m.nombre] = m.cupos;
	});

	variacion.forEach((ms) => {
		let cuposDisponibles = cuposPorMateria[ms.nombre_materia];
		if (ms.asignada) {
			if (cuposDisponibles > 0) {
				cuposPorMateria[ms.nombre_materia] =
					cuposPorMateria[ms.nombre_materia] - 1;
			} else {
				valida = false;
			}
		}
	});

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
	const insandest = estudiantes.map((e) => {
		return {
			ins: (1 - e.ma / e.ms) * (e.prioridadTotalRec / γ(e.ms)),
			cod: e.cod_estudiante,
		};
	});
	const total =
		insatisfacciones.reduce((a, b) => a + b, 0) / insatisfacciones.length;
	if (total.toFixed(3) === "0.031" && !running) {
		console.log("Insatisfacciones", insandest);
	}
	return total; //promedio de insatisfacciones
}
function rocFB(todasLasMaterias, todosLosEstudiantes) {
	const data = ReaderBr();

	let materiasSolicitadas = todosLosEstudiantes.estudiantes.flatMap((est) => {
		return est.materias_estudiante;
	});
	console.log(
		"Materias :",
		data.materias.materias.map((m) => [m.nombre, m.cupos])
	);
	console.log("solicitudes", materiasSolicitadas.length);

	const mejorSolucion = calcularMejorSolucion(
		materiasSolicitadas,
		todasLasMaterias
	);
	let costo = calcularInstatisfaccion(mejorSolucion);
	let respuestaEnTexto = costo.toFixed(4) + "\n";
	let actualEstudiante = mejorSolucion[0].cod_estudiante;
	let materiasAsignadas = [];
	mejorSolucion.forEach((m) => {
		if (m.asignada) {
			if (m.cod_estudiante == actualEstudiante) {
				materiasAsignadas.push(m);
			} else {
				respuestaEnTexto += `${m.cod_estudiante},${materiasAsignadas.length}\n`;
				materiasAsignadas.forEach((m) => {
					respuestaEnTexto += `${m.nombre_materia}\n`;
				});
				materiasAsignadas = [];
				actualEstudiante = m.cod_estudiante;
				materiasAsignadas.push(m);
			}
		}
	});
	fs.writeFileSync("salidas/salida.txt", respuestaEnTexto);
}

// const data = ReaderBr();
// if (data) {
// 	const todosLosEstudiantes = data.estudiantes;
// 	const todasLasMaterias = data.materias.materias;
// 	rocFB(todasLasMaterias, todosLosEstudiantes);
// }

module.exports = { rocFB };
