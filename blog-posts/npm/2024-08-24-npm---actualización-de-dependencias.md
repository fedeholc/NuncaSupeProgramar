---
title: npm - Actualización de dependencias
description: npm - Actualización de dependencias
date: 2024-08-24T18:38:07.637Z
preview: ""
draft: false
tags:
  - npm
categories: []
---

#### **Verificar qué paquetes están desactualizados**

```bash
npm outdated
```

#### **Actualizar un paquete a su última versión compatible**

```bash
npm update <nombre-paquete>
```

#### **Actualizar un paquete a la última versión disponible**

```bash
npm install <nombre-paquete>@latest
```

#### **Actualizar todas las dependencias según las versiones compatibles en `package.json`**

```bash
npm update
```

#### **Actualizar todas las dependencias a sus últimas versiones disponibles**

1. Eliminar `node_modules` y `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```
2. Reinstalar todas las dependencias:

   ```bash
   npm install
   ```

#### **Actualizar un paquete globalmente**

```bash
npm update -g <nombre-paquete>
```

#### **Actualizar todos los paquetes globales**

```bash
npm update -g
```

### **Actualizar dependencias con `npm-check-updates`**

[https://www.npmjs.com/package/npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

1. Instalar la herramienta:
   ```bash
   npm install -g npm-check-updates
   ```
2. Ver actualizaciones disponibles:
   ```bash
   ncu
   ```
3. Actualizar versiones en `package.json`:
   ```bash
   ncu -u
   ```
4. Reinstalar dependencias:
   ```bash
   npm install
   ```

También se puede usar el modo interactivo con `ncu -i`
