// try:
//     with open("input.txt", 'r') as archivo:
//         contenido_l = archivo.readlines()
//         numero_materias = int(contenido_l[0].strip())#Guarda el numero de materias están disponibles       
//         materias = []
//         for i in range(1,numero_materias+1):
//           materia = contenido_l[i].strip().split(",")
//           materias.append({"Nombre":materia[0],"Cupos":int(materia[1])}) 
//         numero_estudiantes = contenido_l[numero_materias+1].strip()  # Obtiene la línea y elimina los espacios en blanco alrededor
//         elementos = numero_estudiantes.split(',') # Divide la línea en elementos utilizando la coma como delimitador
//         print(materias)   
// except FileNotFoundError:
//     print(f"El archivo no se encontró.")
// except Exception as e:
//     print(f"Ocurrió un error: {str(e)}")
const fs = require('fs');

try {
    const contenido = fs.readFileSync('input.txt', 'utf-8');
    const contenido_l = contenido.split('\n');
    const numero_materias = parseInt(contenido_l[0].trim());
    const materias = [];

    for (let i = 1; i <= numero_materias; i++) {
        const materia = contenido_l[i].trim().split(',');
        materias.push({ Nombre: materia[0], Cupos: parseInt(materia[1]) });
    }

    const numero_estudiantes = contenido_l[numero_materias + 1].trim();
    const elementos = numero_estudiantes.split(',');
    console.log(materias);
} catch (error) {
    if (error.code === 'ENOENT') {
        console.log('El archivo no se encontró.');
    } else {
        console.log('Ocurrió un error: ' + error.message);
    }
}
