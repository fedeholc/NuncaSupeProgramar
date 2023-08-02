---
title: Comandos útiles para node / npm
description: "Comandos útiles para node / npm"
date: 2023-05-01T12:46:07.925Z
preview: ""
draft: true
tags: [Node, npm]
categories: []
---

Para crear un proyecto y que nos cree el package.json:
`npm init`

Para que se actualice el servidor cuando modificamos un archivo:

- Instalar nodemon:
  ```sh
  npm install nodemon --global
  ```
- Luego iniciar con: **`nodemon app.js`** o poner el script para seguir usando **`npm start`**:
  ```json
  "scripts": {
    "start": "nodemon app.js"
  }
  ```
