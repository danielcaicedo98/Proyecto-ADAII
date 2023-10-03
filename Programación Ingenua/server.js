const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs");
const http = require("http");
const ReaderBr = require("./reader_br");
const { rocFB } = require("./fuerza_bruta");

const servidor = http.createServer((req, res) => {
	if (req.url === "/roc_fb" && req.method === "POST") {
		// Ruta /roc_fb para solicitudes POST
		let datosCuerpo = "";

		req.on("data", (chunk) => {
			// Recopilar datos del cuerpo de la solicitud
			datosCuerpo += chunk.toString();
			writeFileSync("./entradas/entrada.txt", datosCuerpo);

			const data = ReaderBr();
			if (data) {
				const todosLosEstudiantes = data.estudiantes;
				const todasLasMaterias = data.materias.materias;
				rocFB(todasLasMaterias, todosLosEstudiantes);
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
