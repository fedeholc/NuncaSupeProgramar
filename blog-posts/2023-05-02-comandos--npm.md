---
title: "npm - Comandos útiles"
description: "Comandos útiles para npm"
date: 2023-05-01T12:46:07.925Z
preview: ""
draft: false
tags: [npm]
categories: []
---

#### **Gestión de paquetes**

- **`npm install <paquete>`**  
  Instala un paquete en el proyecto local.  
  Ejemplo: `npm install express`

- **`npm install -g <paquete>`**  
  Instala un paquete globalmente.  
  Ejemplo: `npm install -g nodemon`

- **`npm uninstall <paquete>`**  
  Desinstala un paquete del proyecto local.  
  Ejemplo: `npm uninstall express`

- **`npm update <paquete>`**  
  Actualiza un paquete en el proyecto local.  
  Ejemplo: `npm update express`

- **`npm outdated`**  
  Muestra los paquetes desactualizados en el proyecto.

- **`npm list`**  
  Lista todos los paquetes instalados en el proyecto.  
  Con `-g` lista los paquetes globales.  
  Ejemplo: `npm list -g`

#### **Gestión del proyecto**

- **`npm init`**  
  Inicia un proyecto nuevo y crea un archivo `package.json` interactivo.

- **`npm init -y`**  
  Crea un archivo `package.json` con valores predeterminados.

- **`npm run <script>`**  
  Ejecuta un script definido en el `package.json`.  
  Ejemplo: `npm run start`

- **`npm test`**  
  Ejecuta el script de pruebas definido como `test`.

- **`npm start`**  
  Ejecuta el script definido como `start`.

#### **Gestión de dependencias**

- **`npm install`**  
  Instala todas las dependencias listadas en el `package.json`.

- **Flags útiles al instalar:**

  - **`--save`** (obsoleto desde npm 5): Guarda el paquete en `dependencies`.
  - **`--save-dev`**: Guarda el paquete en `devDependencies`.
    Ejemplo: `npm install jest --save-dev`
  - **`--no-save`**: No guarda el paquete en el `package.json`.

- **`npm ci`**  
  Instala las dependencias desde el `package-lock.json` (más rápido y consistente).

#### **Cache y limpieza**

- **`npm cache clean --force`**  
  Limpia la caché de npm.

- **`npm rebuild`**  
  Reconstruye los paquetes instalados.

#### **Información y diagnóstico**

- **`npm -v`**  
  Muestra la versión actual de npm.

- **`node -v`**  
  Muestra la versión actual de Node.js.

- **`npm help`**  
  Muestra la documentación de ayuda para npm.

- **`npm info <paquete>`**  
  Muestra información detallada sobre un paquete.  
  Ejemplo: `npm info react`

#### **Publicación y gestión de paquetes**

- **`npm login`**  
  Inicia sesión en npm (para publicar paquetes).

- **`npm publish`**  
  Publica un paquete en el registro de npm.

- **`npm unpublish <paquete>`**  
  Elimina un paquete del registro (con restricciones).
