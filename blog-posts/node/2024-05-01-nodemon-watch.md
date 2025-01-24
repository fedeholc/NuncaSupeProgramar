---
title: "Node - nodemon y node --watch"
description: "Node - nodemon y node --watch"
date: 2023-05-01T12:46:07.925Z
preview: ""
draft: false
tags: [Node, nodemon]
categories: []
---

### nodemon

**`nodemon`** es una herramienta diseñada para reiniciar aplicaciones de Node.js automáticamente cada vez que detecta cambios en los archivos del proyecto.

[https://www.npmjs.com/package/nodemon](https://www.npmjs.com/package/nodemon)

Conviene instalar de manera global:

```bash
npm install nodemon --global
```

Luego iniciar con: **`nodemon app.js`** o poner el script para seguir usando **`npm start`**:

```json
"scripts": {
  "start": "nodemon app.js"
}
```

### node --watch

Desde la versión 22 de Node.js, se incluye una funcionalidad nativa (**`--watch`**) que permite reiniciar automáticamente cuando detecta cambios en los archivos que la aplicación usa directamente (solo archivos importados o requeridos, no todos los archivos del directorio como `nodemon`).

Se usa corriendo:

```bash
node --watch app.js
```

[https://nodejs.org/api/cli.html#--watch](https://nodejs.org/api/cli.html#--watch)
