try:
    with open("input.txt", 'r') as archivo:
        contenido_l = archivo.readlines()
        numero_materias = int(contenido_l[0].strip())#Guarda el numero de materias están disponibles       
        materias = []
        for i in range(1,numero_materias+1):
          materia = contenido_l[i].strip().split(",")
          materias.append({"Nombre":materia[0],"Cupos":int(materia[1])}) 
        numero_estudiantes = contenido_l[numero_materias+1].strip()  # Obtiene la línea y elimina los espacios en blanco alrededor
        elementos = numero_estudiantes.split(',') # Divide la línea en elementos utilizando la coma como delimitador
        print(materias)   
except FileNotFoundError:
    print(f"El archivo no se encontró.")
except Exception as e:
    print(f"Ocurrió un error: {str(e)}")
