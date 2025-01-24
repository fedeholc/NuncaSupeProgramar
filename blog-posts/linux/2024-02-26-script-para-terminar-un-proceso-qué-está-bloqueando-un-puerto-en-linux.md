---
title: Terminar un proceso que está bloqueando un puerto (Linux)
description: Script para terminar un proceso qué está bloqueando un puerto en Linux
date: 2024-02-26T19:47:08.913Z
preview: ""
draft: false
tags:
  - Bash
  - Linux
  - Script
categories: []
---

Script que permite terminar un proceso que está bloqueando un puerto en Linux:

```bash
#!/bin/bash

# Obtener el PID del proceso que está utilizando el puerto
PID=$(lsof -t -i:$1)

# Verificar si se encontró un PID
if [ -z "$PID" ]
then
  echo "No se encontró ningún proceso utilizando el puerto $1"
else
  echo "Terminando el proceso $PID que está utilizando el puerto $1"
  kill $PID
fi
```

Guardar el script en un archivo dentro de la carpeta `/usr/local/bin` y darle permisos de ejecución (`sudo chmod +x /usr/local/bin/killport`). Luego, ejecutar el script con el número del puerto que se desea liberar, ej: `killport 3000`.
