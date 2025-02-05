---
title: Linux - ¿Problema de permisos al hacer npm install?
description: Linux - ¿Problema de permisos al hacer npm install?
date: 2024-09-16T18:43:37.151Z
preview: ""
draft: false
tags: [Linux, npm]
categories: []
---

Recientemente me encontré con que al hacer `npm install` en un directorio local no instalaba los paquetes, ni daba error, simplemente no hacía nada.
Aún no encontré la causa del problema ni cómo solucionarlo definitivamente, es probable que se deba a un problema de permisos, pues la solución es hacer:

```bash
sudo chown -R $USER:$USER ./directorio-del-repo
```

Y luego `npm install`.

Pero en algunos casos como al crear un directorio usando `npm create vite@latest` no funciona y hay que hacer primero `sudo npm install` y luego cambiar los permisos.
