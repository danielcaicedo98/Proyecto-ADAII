const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs");
const http = require("http");
const ReaderBr = require("./Programación Ingenua/reader_br");
const { rocFB } = require("./Programación Ingenua/fuerza_bruta");
const {
	programacionVoraz,
	cargarDatos,
	escritura,
} = require("./Programación Voraz/Programacion_voraz");

const servidor = http.createServer((req, res) => {
	if (req.url === "/roc_fb" && req.method === "POST") {
		// Ruta /roc_fb para solicitudes POST
		let datosCuerpo = "";

		req.on("data", (chunk) => {
			// Recopilar datos del cuerpo de la solicitud
			datosCuerpo += chunk;
			
			
			const cuerpoJson = JSON.parse(datosCuerpo);

			// Accede a las propiedades del JSON
			const opcion = cuerpoJson.opcion;
			const texto = cuerpoJson.texto;
			writeFileSync("./entradas/entrada.txt", texto);
			if (opcion == "1") {
			} else if (opcion == "2") {
				console.log("opcion 2, ingenua");
				const data = ReaderBr();
				if (data) {
					const todosLosEstudiantes = data.estudiantes;
					const todasLasMaterias = data.materias.materias;
					rocFB(todasLasMaterias, todosLosEstudiantes);
				}
			} else if (opcion == "3") {
				const datos = cargarDatos();

				//ejecuta la funcion principal
				programacionVoraz(datos[0], datos[1]);
			}
		});

		req.on("end", () => {
			// Procesar datos del cuerpo
			try {
				res.writeHead(200, { "Content-Type": "text/plain" });

				const filePath = join(__dirname, "salidas/salida.txt");
				const contenido = readFileSync(filePath, "utf8");
				res.end(contenido);
			} catch (error) {
				console.error("Error al procesar datos del cuerpo:", error);
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("Error interno del servidor");
			}
		});
	} else if (req.url === "/") {
		// Ruta principal para servir el archivo HTML
		res.writeHead(200, { "Content-Type": "text/html" });
		const filePath = join(__dirname, "index.html");
		const contenido = readFileSync(filePath, "utf8");
		res.end(contenido);
	} else {
		// Rutas no manejadas
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("404 Not Found");
	}
});

const puerto = 3000;

servidor.listen(puerto, () => {
	console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
